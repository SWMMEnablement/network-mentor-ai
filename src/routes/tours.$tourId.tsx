import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Play, Trash2, Plus, Download } from "lucide-react";
import { ProductWorkspace } from "@/components/sim/ProductWorkspace";
import { TourOverlay } from "@/components/tour/TourOverlay";
import { getTour, saveTour } from "@/lib/tour-storage";
import { productById } from "@/lib/products";
import type { Tour, TourStep } from "@/lib/tour-types";
import { toast } from "sonner";

export const Route = createFileRoute("/tours/$tourId")({
  component: Author,
});

function Author() {
  const { tourId } = Route.useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [preview, setPreview] = useState(false);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = getTour(tourId);
    if (!t) {
      toast.error("Tour not found");
      navigate({ to: "/tours" });
      return;
    }
    setTour(t);
  }, [tourId, navigate]);

  const product = useMemo(() => (tour ? productById(tour.productId) : undefined), [tour]);
  if (!tour || !product) return null;

  const step = tour.steps[activeStep];
  const screenId = step?.screenId ?? product.defaultScreen;

  const update = (next: Tour) => {
    setTour(next);
    saveTour(next);
  };

  const addStep = () => {
    const s: TourStep = {
      id: crypto.randomUUID(),
      screenId,
      targetSim: null,
      title: "New step",
      body: "",
    };
    update({ ...tour, steps: [...tour.steps, s] });
    setActiveStep(tour.steps.length);
  };

  const patchStep = (patch: Partial<TourStep>) => {
    const steps = [...tour.steps];
    steps[activeStep] = { ...steps[activeStep], ...patch };
    update({ ...tour, steps });
  };

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(tour, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${tour.title.replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Click-to-pick: while picking, the next data-sim click becomes the target.
  const [picking, setPicking] = useState(false);
  useEffect(() => {
    if (!picking || !stageRef.current) return;
    const handler = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("[data-sim]") as HTMLElement | null;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      patchStep({ targetSim: el.getAttribute("data-sim") });
      setPicking(false);
    };
    const node = stageRef.current;
    node.addEventListener("click", handler, true);
    return () => node.removeEventListener("click", handler, true);
  }, [picking, activeStep]);

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-12 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-3">
          <Link to="/tours" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Library
          </Link>
          <span className="text-muted-foreground">/</span>
          <input
            value={tour.title}
            onChange={(e) => update({ ...tour, title: e.target.value })}
            className="bg-transparent font-display text-sm font-semibold focus:outline-none"
          />
          <span className="text-xs text-muted-foreground">· {product.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPreview((p) => !p)}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-border hover:bg-secondary"
          >
            <Play className="h-3.5 w-3.5" /> {preview ? "Stop preview" : "Preview"}
          </button>
          <button
            onClick={exportJson}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-border hover:bg-secondary"
          >
            <Download className="h-3.5 w-3.5" /> Export JSON
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Step list */}
        <aside className="flex w-64 shrink-0 flex-col border-r border-border bg-card">
          <div className="flex items-center justify-between px-3 py-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Steps ({tour.steps.length})
            <button onClick={addStep} className="rounded p-1 hover:bg-secondary">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <div className="flex-1 overflow-auto">
            {tour.steps.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActiveStep(i)}
                className={`flex w-full items-start gap-2 border-l-2 px-3 py-2 text-left text-xs ${
                  i === activeStep
                    ? "border-accent bg-secondary"
                    : "border-transparent hover:bg-secondary/50"
                }`}
              >
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-secondary text-[10px]">
                  {i + 1}
                </span>
                <span className="flex-1 truncate font-medium">{s.title || "Untitled"}</span>
              </button>
            ))}
          </div>
        </aside>

        {/* Stage */}
        <div ref={stageRef} className="relative flex-1 overflow-hidden">
          <ProductWorkspace
            productId={tour.productId}
            screenId={screenId}
            onScreenChange={(id) => step && patchStep({ screenId: id })}
          />
          {preview && (
            <TourOverlay
              steps={tour.steps}
              index={activeStep}
              containerRef={stageRef}
              onClose={() => setPreview(false)}
              onBack={() => setActiveStep((i) => Math.max(0, i - 1))}
              onNext={() => setActiveStep((i) => Math.min(tour.steps.length - 1, i + 1))}
            />
          )}
          {picking && (
            <div className="pointer-events-none absolute inset-0 z-50 flex items-start justify-center bg-black/20 pt-6">
              <div className="rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground shadow-lg ring-1 ring-border">
                Click any element in the workspace to pick the hotspot…
              </div>
            </div>
          )}
        </div>

        {/* Step editor */}
        <aside className="flex w-80 shrink-0 flex-col gap-3 border-l border-border bg-card p-4">
          {!step ? (
            <p className="text-sm text-muted-foreground">Add a step to get started.</p>
          ) : (
            <>
              <label className="text-xs font-medium">
                Screen
                <select
                  value={step.screenId}
                  onChange={(e) => patchStep({ screenId: e.target.value })}
                  className="mt-1 w-full rounded-md bg-secondary px-2 py-1.5 text-sm ring-1 ring-border"
                >
                  {product.screens.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>
              <div>
                <div className="mb-1 text-xs font-medium">Target element</div>
                <div className="flex items-center gap-2">
                  <code className="flex-1 truncate rounded bg-secondary px-2 py-1 text-[11px]">
                    {step.targetSim ?? "(none)"}
                  </code>
                  <button
                    onClick={() => setPicking(true)}
                    className="rounded-md px-2 py-1 text-xs ring-1 ring-border hover:bg-secondary"
                  >
                    Pick
                  </button>
                </div>
              </div>
              <label className="text-xs font-medium">
                Title
                <input
                  value={step.title}
                  onChange={(e) => patchStep({ title: e.target.value })}
                  className="mt-1 w-full rounded-md bg-secondary px-2 py-1.5 text-sm ring-1 ring-border"
                />
              </label>
              <label className="flex-1 text-xs font-medium">
                Body (markdown)
                <textarea
                  value={step.body}
                  onChange={(e) => patchStep({ body: e.target.value })}
                  rows={8}
                  className="mt-1 w-full rounded-md bg-secondary px-2 py-1.5 text-sm ring-1 ring-border"
                />
              </label>
              <button
                onClick={() => {
                  const steps = tour.steps.filter((_, i) => i !== activeStep);
                  update({ ...tour, steps });
                  setActiveStep(Math.max(0, activeStep - 1));
                }}
                className="inline-flex items-center gap-1.5 self-start rounded-md px-2 py-1 text-xs text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3 w-3" /> Delete step
              </button>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
