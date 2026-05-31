import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RibbonTab {
  id: string;
  label: string;
}
interface RibbonButton {
  id: string;
  label: string;
  icon?: ReactNode;
  primary?: boolean;
}
interface Props {
  appTitle: string;
  tabs: RibbonTab[];
  activeTab?: string;
  buttons: RibbonButton[];
  onTabChange?: (id: string) => void;
  variant?: "ribbon" | "menubar"; // ribbon for ICM/InfoDrainage/Civil3D, menubar for SWMM5
}

export function Ribbon({
  appTitle,
  tabs,
  activeTab,
  buttons,
  onTabChange,
  variant = "ribbon",
}: Props) {
  if (variant === "menubar") {
    return (
      <div
        className="flex flex-col"
        style={{ background: "var(--p-chrome)" as string, color: "var(--p-ink)" }}
      >
        <div
          className="flex items-center gap-3 px-2 py-1 text-[11px]"
          style={{ borderBottom: "1px solid var(--p-line)" }}
        >
          <span className="font-medium">{appTitle}</span>
          <div className="flex gap-3">
            {tabs.map((t) => (
              <button
                key={t.id}
                data-sim={`menu-${t.id}`}
                onClick={() => onTabChange?.(t.id)}
                className="hover:underline"
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <div
          className="flex items-center gap-1 px-2 py-1"
          style={{ borderBottom: "1px solid var(--p-line)" }}
        >
          {buttons.map((b) => (
            <button
              key={b.id}
              data-sim={`tool-${b.id}`}
              className="rounded px-2 py-0.5 text-[11px] hover:bg-black/5"
              style={{ border: "1px solid var(--p-line)", background: "var(--p-chrome-strong)" }}
            >
              {b.icon}
              {b.label}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ background: "var(--p-chrome)" as string, color: "var(--p-ink)" }}>
      <div className="flex items-center justify-between px-3 py-1.5 text-[12px]">
        <div className="flex items-center gap-4">
          <span className="font-display font-semibold tracking-wide">{appTitle}</span>
          <div className="flex gap-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                data-sim={`tab-${t.id}`}
                onClick={() => onTabChange?.(t.id)}
                className={cn(
                  "rounded-sm px-2.5 py-0.5 transition-colors",
                  activeTab === t.id ? "bg-white/15" : "hover:bg-white/10"
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>
        <span className="font-mono text-[11px] opacity-70">demo-project.icm</span>
      </div>
      <div
        className="flex flex-wrap items-stretch gap-1 px-3 py-2"
        style={{ borderTop: "1px solid color-mix(in oklab, var(--p-ink) 20%, transparent)" }}
      >
        {buttons.map((b) => (
          <button
            key={b.id}
            data-sim={`tool-${b.id}`}
            className={cn(
              "flex min-w-[60px] flex-col items-center gap-1 rounded-sm px-2 py-1 text-[11px] transition-colors",
              b.primary ? "bg-white/15 hover:bg-white/25" : "hover:bg-white/10"
            )}
            style={b.primary ? { boxShadow: "0 0 0 1px color-mix(in oklab, var(--p-accent) 60%, transparent)" } : {}}
          >
            {b.icon ?? (
              <span
                className="h-5 w-5 rounded-sm"
                style={{
                  background: b.primary
                    ? "var(--p-accent)"
                    : "color-mix(in oklab, var(--p-ink) 25%, transparent)",
                }}
              />
            )}
            <span>{b.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
