import { useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Plus } from "lucide-react";
import { ProductWorkspace } from "@/components/sim/ProductWorkspace";
import { TourOverlay } from "@/components/tour/TourOverlay";
import { getTemplate } from "@/lib/tour-templates";
import { productById } from "@/lib/products";
import { tourFromTemplate } from "@/lib/tour-types";
import { saveTour } from "@/lib/tour-storage";
import { toast } from "sonner";

export const Route = createFileRoute("/templates/$templateId")({
  component: Preview,
});

function Preview() {
  const { templateId } = Route.useParams();
  const navigate = useNavigate();
  const template = getTemplate(templateId);
  const product = template ? productById(template.productId) : undefined;
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Materialise steps with stable ids for the overlay.
  const [steps] = useState(() =>
    template ? template.steps.map((s, i) => ({ ...s, id: `tpl-${i}` })) : [],
  );
  const [index, setIndex] = useState(0);

  if (!template || !product) {
    return (
      <div className="p-10 text-sm text-muted-foreground">
        Template not found.{" "}
        <Link to="/templates" className="underline">
          Back to gallery
        </Link>
      </div>
    );
  }

  const step = steps[index];
  const screenId = step?.screenId ?? product.defaultScreen;

  const useTemplate = () => {
    const tour = tourFromTemplate(template);
    saveTour(tour);
    toast.success("Template added to your library");
    navigate({ to: "/tours/$tourId", params: { tourId: tour.id } });
  };

  return (
    <div className="flex h-screen flex-col">
      <header className="flex h-12 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-3">
          <Link to="/templates" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Templates
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="font-display text-sm font-semibold">{template.title}</span>
          <span className="text-xs text-muted-foreground">· {product.name} · preview</span>
        </div>
        <button
          onClick={useTemplate}
          className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90"
        >
          <Plus className="h-3.5 w-3.5" /> Use this template
        </button>
      </header>
      <div ref={stageRef} className="relative flex-1 overflow-hidden">
        <ProductWorkspace productId={template.productId} screenId={screenId} />
        {steps.length > 0 && (
          <TourOverlay
            steps={steps}
            index={index}
            containerRef={stageRef}
            onClose={() => navigate({ to: "/templates" })}
            onBack={() => setIndex((i) => Math.max(0, i - 1))}
            onNext={() => setIndex((i) => Math.min(steps.length - 1, i + 1))}
          />
        )}
      </div>
    </div>
  );
}
