import { useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Sparkles, ListPlus, Play } from "lucide-react";
import { ProductWorkspace } from "@/components/sim/ProductWorkspace";
import { TourOverlay } from "@/components/tour/TourOverlay";
import { AIGenerateDialog } from "@/components/tour/AIGenerateDialog";
import { productById } from "@/lib/products";
import { newTour } from "@/lib/tour-types";
import { saveTour } from "@/lib/tour-storage";
import { toast } from "sonner";

export const Route = createFileRoute("/products/$productId")({
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const product = useMemo(() => productById(productId), [productId]);
  const navigate = useNavigate();
  const [screenId, setScreenId] = useState(product?.defaultScreen ?? "start");
  const [aiOpen, setAiOpen] = useState(false);
  const [demoTour, setDemoTour] = useState<{ steps: any[]; index: number } | null>(null);
  const stageRef = useRef<HTMLDivElement | null>(null);

  if (!product) {
    return <div className="p-10 text-sm text-muted-foreground">Unknown product.</div>;
  }

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-12 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Studio
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-display text-sm font-semibold">{product.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAiOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90"
          >
            <Sparkles className="h-3.5 w-3.5" /> Generate tour with AI
          </button>
          <button
            onClick={() => {
              const t = newTour(product.id, { title: "Untitled tour" });
              saveTour(t);
              navigate({ to: "/tours/$tourId", params: { tourId: t.id } });
            }}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-border hover:bg-secondary"
          >
            <ListPlus className="h-3.5 w-3.5" /> Author manually
          </button>
        </div>
      </header>

      <div ref={stageRef} className="relative flex-1 overflow-hidden">
        <ProductWorkspace
          productId={product.id}
          screenId={screenId}
          onScreenChange={(id) => setScreenId(id)}
        />
        {demoTour && (
          <TourOverlay
            steps={demoTour.steps}
            index={demoTour.index}
            containerRef={stageRef}
            onClose={() => setDemoTour(null)}
            onBack={() =>
              setDemoTour((d) => (d ? { ...d, index: Math.max(0, d.index - 1) } : d))
            }
            onNext={() =>
              setDemoTour((d) => {
                if (!d) return d;
                if (d.index >= d.steps.length - 1) return null;
                const next = d.index + 1;
                const ns = d.steps[next];
                if (ns.screenId) setScreenId(ns.screenId);
                return { ...d, index: next };
              })
            }
          />
        )}
      </div>

      <AIGenerateDialog
        product={product}
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onResult={(r) => {
          const t = newTour(product.id, r);
          saveTour(t);
          toast.success("Saved to library", {
            action: { label: "Play", onClick: () => navigate({ to: "/tours/$tourId/play", params: { tourId: t.id } }) },
          });
          // Also start a live preview right here:
          if (r.steps[0]?.screenId) setScreenId(r.steps[0].screenId);
          setDemoTour({ steps: r.steps, index: 0 });
        }}
      />
    </div>
  );
}
