import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Play, Trash2, Share2, FileText, Download } from "lucide-react";
import { listTours, deleteTour } from "@/lib/tour-storage";
import type { Tour } from "@/lib/tour-types";
import { productById } from "@/lib/products";
import { buildShareLink, exportTourJson, exportTourPdf } from "@/lib/tour-export";
import { toast } from "sonner";

export const Route = createFileRoute("/tours")({
  component: Library,
  head: () => ({
    meta: [
      { title: "Tour library · Onboarding Studio" },
      { name: "description", content: "Manage, export, and share your simulated onboarding tours." },
    ],
  }),
});

function Library() {
  const [tours, setTours] = useState<Tour[]>([]);
  useEffect(() => {
    const sync = () => setTours(listTours());
    sync();
    window.addEventListener("tours-changed", sync);
    return () => window.removeEventListener("tours-changed", sync);
  }, []);
  return (
    <div className="mx-auto min-h-screen max-w-4xl px-6 py-10">
      <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to studio
      </Link>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-3xl font-semibold">Tour library</h1>
        <Link
          to="/templates"
          className="rounded-md px-3 py-1.5 text-sm font-medium ring-1 ring-border hover:bg-secondary"
        >
          Browse templates →
        </Link>
      </div>
      {tours.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No tours yet. <Link to="/templates" className="underline">Start from a template</Link>, open a
          product to generate one with AI, or author one manually.
        </p>
      ) : (
        <div className="divide-y divide-border rounded-lg border border-border">
          {tours.map((t) => {
            const p = productById(t.productId);
            return (
              <div key={t.id} className="flex items-center justify-between p-4">
                <div>
                  <div className="font-display text-base font-semibold">{t.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {p?.name} · {t.steps.length} steps · updated {new Date(t.updatedAt).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Link
                    to="/tours/$tourId/play"
                    params={{ tourId: t.id }}
                    className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Play className="h-3.5 w-3.5" aria-hidden /> Play
                  </Link>
                  <Link
                    to="/tours/$tourId"
                    params={{ tourId: t.id }}
                    className="rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={async () => {
                      const link = buildShareLink(t);
                      try {
                        await navigator.clipboard.writeText(link);
                        toast.success("Permalink copied");
                      } catch {
                        toast.message("Permalink", { description: link });
                      }
                    }}
                    aria-label={`Copy share link for ${t.title}`}
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-xs ring-1 ring-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Share2 className="h-3.5 w-3.5" aria-hidden /> Share
                  </button>
                  <button
                    onClick={() => exportTourPdf(t)}
                    aria-label={`Export ${t.title} as PDF`}
                    className="rounded-md p-1.5 text-muted-foreground ring-1 ring-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title="Export PDF"
                  >
                    <FileText className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    onClick={() => exportTourJson(t)}
                    aria-label={`Export ${t.title} as JSON`}
                    className="rounded-md p-1.5 text-muted-foreground ring-1 ring-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    title="Export JSON"
                  >
                    <Download className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete tour?")) deleteTour(t.id);
                    }}
                    aria-label={`Delete ${t.title}`}
                    className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
