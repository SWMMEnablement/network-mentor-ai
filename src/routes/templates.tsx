import { useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Clock, Eye, Plus } from "lucide-react";
import { TEMPLATES } from "@/lib/tour-templates";
import { PRODUCTS, type ProductId } from "@/lib/products";
import { tourFromTemplate, type TourTemplate } from "@/lib/tour-types";
import { saveTour } from "@/lib/tour-storage";
import { toast } from "sonner";

export const Route = createFileRoute("/templates")({
  head: () => ({
    meta: [
      { title: "Tour templates — Onboarding Studio" },
      {
        name: "description",
        content:
          "Reusable onboarding tour templates for InfoWorks ICM, ICM SWMM, EPA SWMM 5, InfoDrainage and Civil 3D drainage.",
      },
    ],
  }),
  component: Gallery,
});

type Filter = ProductId | "all";

function Gallery() {
  const [filter, setFilter] = useState<Filter>("all");
  const navigate = useNavigate();

  const list = useMemo(
    () => (filter === "all" ? TEMPLATES : TEMPLATES.filter((t) => t.productId === filter)),
    [filter],
  );

  const useTemplate = (t: TourTemplate) => {
    const tour = tourFromTemplate(t);
    saveTour(tour);
    toast.success("Template added to your library");
    navigate({ to: "/tours/$tourId", params: { tourId: tour.id } });
  };

  return (
    <div className="mx-auto min-h-screen max-w-6xl px-6 py-10">
      <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to studio
      </Link>
      <h1 className="mb-2 font-display text-3xl font-semibold">Tour templates</h1>
      <p className="mb-6 max-w-2xl text-sm text-muted-foreground">
        Pre-built onboarding flows for every supported product. Preview to see the spotlight tour in
        the real simulated UI, or clone a template into your library to edit and share.
      </p>

      <div className="mb-6 flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All ({TEMPLATES.length})
        </FilterChip>
        {PRODUCTS.map((p) => {
          const n = TEMPLATES.filter((t) => t.productId === p.id).length;
          return (
            <FilterChip key={p.id} active={filter === p.id} onClick={() => setFilter(p.id)}>
              {p.name} ({n})
            </FilterChip>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {list.map((t) => {
          const product = PRODUCTS.find((p) => p.id === t.productId)!;
          return (
            <div
              key={t.templateId}
              className="flex flex-col rounded-xl border border-border bg-card p-5"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="inline-flex rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                  {product.name}
                </span>
                <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                  <Clock className="h-3 w-3" /> {t.estMinutes} min
                </span>
              </div>
              <h2 className="mb-1 font-display text-lg font-semibold">{t.title}</h2>
              <p className="mb-3 text-xs text-muted-foreground">{t.persona}</p>
              <ul className="mb-4 flex-1 space-y-1 text-xs text-foreground/80">
                {t.learn.slice(0, 4).map((l) => (
                  <li key={l} className="flex gap-1.5">
                    <span className="text-accent">·</span>
                    <span>{l}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{t.steps.length} steps</span>
                <div className="flex gap-2">
                  <Link
                    to="/templates/$templateId"
                    params={{ templateId: t.templateId }}
                    className="inline-flex items-center gap-1 rounded-md px-2.5 py-1.5 font-medium ring-1 ring-border hover:bg-secondary"
                  >
                    <Eye className="h-3.5 w-3.5" /> Preview
                  </Link>
                  <button
                    onClick={() => useTemplate(t)}
                    className="inline-flex items-center gap-1 rounded-md bg-foreground px-2.5 py-1.5 font-medium text-background hover:opacity-90"
                  >
                    <Plus className="h-3.5 w-3.5" /> Use template
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1 text-xs font-medium ring-1 transition-colors ${
        active
          ? "bg-foreground text-background ring-foreground"
          : "ring-border text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}
