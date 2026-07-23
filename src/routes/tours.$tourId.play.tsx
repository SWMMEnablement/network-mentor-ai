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

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-12 items-center justify-between border-b border-border bg-background px-4">
        <Link to="/tours" className="text-sm text-muted-foreground hover:text-foreground">
          ← Library
        </Link>
        <div className="font-display text-sm font-semibold">{tour.title}</div>
        <div className="flex gap-2 text-xs">
          <button
            onClick={() => setMode("guided")}
            className={`rounded-md px-2 py-1 ${mode === "guided" ? "bg-foreground text-background" : "ring-1 ring-border"}`}
          >
            Guided
          </button>
          <button
            onClick={() => setMode("let-me-try")}
            className={`rounded-md px-2 py-1 ${mode === "let-me-try" ? "bg-foreground text-background" : "ring-1 ring-border"}`}
          >
            Let me try
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
