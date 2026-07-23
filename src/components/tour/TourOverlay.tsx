import { useEffect, useRef, useState, type RefObject } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import type { TourStep } from "@/lib/tour-types";

interface Props {
  steps: TourStep[];
  index: number;
  containerRef: RefObject<HTMLElement | null>;
  onNext: () => void;
  onBack: () => void;
  onClose?: () => void;
  /** "guided" shows tooltip + spotlight; "let-me-try" forces the user to click the right element */
  mode?: "guided" | "let-me-try";
}

interface Rect { left: number; top: number; width: number; height: number }

export function TourOverlay({ steps, index, containerRef, onNext, onBack, onClose, mode = "guided" }: Props) {
  const step = steps[index];
  const [rect, setRect] = useState<Rect | null>(null);
  const observerRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (!step || !containerRef.current) {
      setRect(null);
      return;
    }
    const update = () => {
      if (!containerRef.current) return;
      const container = containerRef.current.getBoundingClientRect();
      if (!step.targetSim) {
        // Center if no target
        setRect({
          left: container.width / 2 - 200,
          top: container.height / 2 - 60,
          width: 400,
          height: 120,
        });
        return;
      }
      const el = containerRef.current.querySelector(
        `[data-sim="${step.targetSim}"]`
      ) as HTMLElement | null;
      if (!el) {
        setRect(null);
        return;
      }
      const r = el.getBoundingClientRect();
      setRect({
        left: r.left - container.left,
        top: r.top - container.top,
        width: r.width,
        height: r.height,
      });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(containerRef.current);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    observerRef.current = ro;
    return () => {
      ro.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [step, containerRef]);

  if (!step) return null;

  // In "let-me-try" mode, clicking the target advances. We do that by leaving
  // a hole in the overlay (pointer-events:none over the target) and listening
  // for clicks anywhere inside the target rect.
  const handleTargetClick = () => {
    if (mode === "let-me-try") onNext();
  };

  const PAD = 8;
  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {/* dimming mask using SVG mask-image to cut out the spotlight */}
      <svg className="absolute inset-0 h-full w-full">
        <defs>
          <mask id="spotlight-mask">
            <rect width="100%" height="100%" fill="white" />
            {rect && (
              <rect
                x={rect.left - PAD}
                y={rect.top - PAD}
                width={rect.width + PAD * 2}
                height={rect.height + PAD * 2}
                rx="8"
                fill="black"
              />
            )}
          </mask>
        </defs>
        <rect width="100%" height="100%" fill="rgba(4,8,16,0.72)" mask="url(#spotlight-mask)" />
        {rect && (
          <rect
            x={rect.left - PAD}
            y={rect.top - PAD}
            width={rect.width + PAD * 2}
            height={rect.height + PAD * 2}
            rx="8"
            fill="none"
            stroke="var(--ring)"
            strokeWidth="2.5"
            strokeDasharray="6 4"
          />
        )}
      </svg>

      {rect && mode === "let-me-try" && (
        <button
          onClick={handleTargetClick}
          className="pointer-events-auto absolute cursor-pointer"
          style={{
            left: rect.left - PAD,
            top: rect.top - PAD,
            width: rect.width + PAD * 2,
            height: rect.height + PAD * 2,
            background: "transparent",
          }}
          aria-label="Click target to continue"
        />
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-auto absolute z-50 w-[340px] rounded-lg bg-popover p-4 text-popover-foreground shadow-2xl ring-1 ring-border"
          style={tooltipPosition(rect)}
          role="dialog"
          aria-labelledby={`tour-step-${step.id}-title`}
          aria-describedby={`tour-step-${step.id}-body`}
        >
          <div className="mb-1 flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
            Step {index + 1} of {steps.length}
          </div>
          <h3 id={`tour-step-${step.id}-title`} className="mb-1 font-display text-base font-semibold text-foreground">
            {step.title}
          </h3>
          <div
            id={`tour-step-${step.id}-body`}
            className="prose prose-sm mb-3 max-w-none text-sm leading-relaxed text-foreground dark:prose-invert prose-p:my-1 prose-strong:text-foreground prose-code:rounded prose-code:bg-secondary prose-code:px-1 prose-code:py-0.5 prose-code:text-foreground prose-code:before:content-none prose-code:after:content-none"
          >
            <ReactMarkdown>{step.body || "_No description yet._"}</ReactMarkdown>
          </div>
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onClose}
              className="rounded px-1 text-xs text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Skip tour
            </button>
            <div className="flex gap-2">
              {index > 0 && (
                <button
                  onClick={onBack}
                  className="rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-border hover:bg-accent/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  Back
                </button>
              )}
              <button
                onClick={onNext}
                autoFocus
                className="rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-popover"
              >
                {mode === "let-me-try" ? "Skip" : index === steps.length - 1 ? "Done" : "Next"}
              </button>
            </div>
          </div>
          {mode === "let-me-try" && step.targetSim && (
            <div className="mt-2 text-[10px] italic text-muted-foreground">
              Click the highlighted element to continue.
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function tooltipPosition(rect: Rect | null): React.CSSProperties {
  if (!rect) return { left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
  const TOOLTIP_W = 340;
  // Prefer right of element, fall back to below.
  return {
    left: Math.min(rect.left + rect.width + 16, window.innerWidth - TOOLTIP_W - 24),
    top: Math.max(16, rect.top),
  };
}
