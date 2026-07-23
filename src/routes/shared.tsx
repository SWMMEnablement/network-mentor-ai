import { useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductWorkspace } from "@/components/sim/ProductWorkspace";
import { TourOverlay } from "@/components/tour/TourOverlay";
import { decodeTourToken } from "@/lib/tour-export";
import { saveTour } from "@/lib/tour-storage";
import type { Tour } from "@/lib/tour-types";
import { toast } from "sonner";
import { ArrowLeft, Copy, Download } from "lucide-react";

export const Route = createFileRoute("/shared")({
  component: Shared,
  head: () => ({
    meta: [
      { title: "Shared onboarding tour · Onboarding Studio" },
      { name: "description", content: "Play a shared onboarding tour permalink." },
      { name: "robots", content: "noindex" },
    ],
  }),
});

function Shared() {
  const [tour, setTour] = useState<Tour | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [mode, setMode] = useState<"guided" | "let-me-try">("guided");
  const [index, setIndex] = useState(0);
  const stageRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    const m = hash.match(/t=([^&]+)/);
    if (!m) {
      setNotFound(true);
      return;
    }
    const decoded = decodeTourToken(decodeURIComponent(m[1]));
    if (!decoded) {
      setNotFound(true);
      return;
    }
    setTour(decoded);
  }, []);

  const screenId = useMemo(() => {
    if (!tour) return "start";
    const s = tour.steps[index];
    return s?.screenId ?? tour.steps[0]?.screenId ?? "start";
  }, [tour, index]);

  if (notFound) {
    return (
      <main className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-6 text-center">
        <h1 className="font-display text-2xl font-semibold">Shared link is invalid</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The permalink is missing or corrupted. Ask the sender for a fresh link.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-1.5 rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <ArrowLeft className="h-4 w-4" /> Back to studio
        </Link>
      </main>
    );
  }

  if (!tour) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Permalink copied");
    } catch {
      toast.error("Could not copy link");
    }
  };

  const saveToLibrary = () => {
    saveTour({ ...tour, id: crypto.randomUUID(), createdAt: Date.now(), updatedAt: Date.now() });
    toast.success("Saved to your library");
  };

  return (
    <div className="flex h-dvh flex-col">
      <header className="flex h-12 items-center justify-between border-b border-border bg-background px-4">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ArrowLeft className="h-4 w-4" /> Studio
        </Link>
        <div className="truncate font-display text-sm font-semibold">{tour.title}</div>
        <div className="flex items-center gap-2 text-xs">
          <div className="flex gap-1" role="tablist" aria-label="Playback mode">
            <button
              onClick={() => setMode("guided")}
              aria-pressed={mode === "guided"}
              className={`rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                mode === "guided" ? "bg-foreground text-background" : "ring-1 ring-border"
              }`}
            >
              Guided
            </button>
            <button
              onClick={() => setMode("let-me-try")}
              aria-pressed={mode === "let-me-try"}
              className={`rounded-md px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                mode === "let-me-try" ? "bg-foreground text-background" : "ring-1 ring-border"
              }`}
            >
              Let me try
            </button>
          </div>
          <button
            onClick={copyLink}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 ring-1 ring-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Copy className="h-3.5 w-3.5" aria-hidden /> Copy link
          </button>
          <button
            onClick={saveToLibrary}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 ring-1 ring-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Download className="h-3.5 w-3.5" aria-hidden /> Save
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
            onBack={() => setIndex((i) => Math.max(0, i - 1))}
            onNext={() => setIndex((i) => Math.min(tour.steps.length - 1, i + 1))}
          />
        )}
      </div>
    </div>
  );
}
