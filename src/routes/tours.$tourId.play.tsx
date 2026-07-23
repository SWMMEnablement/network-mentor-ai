import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Share2 } from "lucide-react";
import { ProductWorkspace } from "@/components/sim/ProductWorkspace";
import { TourOverlay } from "@/components/tour/TourOverlay";
import { getTour } from "@/lib/tour-storage";
import { buildShareLink } from "@/lib/tour-export";
import { toast } from "sonner";
import type { Tour } from "@/lib/tour-types";

export const Route = createFileRoute("/tours/$tourId/play")({
  component: Play,
});

function Play() {
  const { tourId } = Route.useParams();
  const navigate = useNavigate();
  const [tour, setTour] = useState<Tour | null>(null);
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<"guided" | "let-me-try">("guided");
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const t = getTour(tourId);
    if (!t) navigate({ to: "/tours" });
    else setTour(t);
  }, [tourId, navigate]);

  if (!tour) return null;
  const step = tour.steps[index];
  const screenId = step?.screenId ?? tour.steps[0]?.screenId ?? "start";

  const share = async () => {
    const link = buildShareLink(tour);
    try {
      await navigator.clipboard.writeText(link);
      toast.success("Permalink copied");
    } catch {
      toast.message("Permalink", { description: link });
    }
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-12 items-center justify-between border-b border-border bg-background px-4">
        <Link
          to="/tours"
          className="rounded px-2 py-1 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          ← Library
        </Link>
        <div className="truncate font-display text-sm font-semibold">{tour.title}</div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex gap-1" role="group" aria-label="Playback mode">
            <button
              onClick={() => setMode("guided")}
              aria-pressed={mode === "guided"}
              className={`rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${mode === "guided" ? "bg-foreground text-background" : "ring-1 ring-border"}`}
            >
              Guided
            </button>
            <button
              onClick={() => setMode("let-me-try")}
              aria-pressed={mode === "let-me-try"}
              className={`rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${mode === "let-me-try" ? "bg-foreground text-background" : "ring-1 ring-border"}`}
            >
              Let me try
            </button>
          </div>
          <button
            onClick={share}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 ring-1 ring-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Share2 className="h-3.5 w-3.5" aria-hidden /> Share
          </button>
        </div>
      </header>
      <div ref={stageRef} className="relative flex-1 overflow-hidden">
        <ProductWorkspace productId={tour.productId} screenId={screenId} />
        {tour.steps.length > 0 && (
          <TourOverlay
            steps={tour.steps}
            index={index}
            mode={mode}
            containerRef={stageRef}
            onClose={() => navigate({ to: "/tours" })}
            onBack={() => setIndex((i) => Math.max(0, i - 1))}
            onNext={() => setIndex((i) => Math.min(tour.steps.length - 1, i + 1))}
          />
        )}
      </div>
    </div>
  );
}
