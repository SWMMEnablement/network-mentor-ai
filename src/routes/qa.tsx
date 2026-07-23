import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2, Circle, Moon, Sun, RotateCcw } from "lucide-react";

export const Route = createFileRoute("/qa")({
  component: QAPage,
  head: () => ({
    meta: [
      { title: "Dark-mode QA checklist · Onboarding Studio" },
      { name: "description", content: "Interactive dark-mode accessibility checklist covering contrast, focus rings, tooltips, modals, and editor panels." },
      { property: "og:title", content: "Dark-mode QA checklist" },
      { property: "og:description", content: "Verify contrast, focus rings, tooltips, modals, and editor panels across the onboarding tour app." },
    ],
  }),
});

interface Item {
  id: string;
  label: string;
  detail: string;
}

interface Section {
  id: string;
  title: string;
  items: Item[];
}

const SECTIONS: Section[] = [
  {
    id: "contrast",
    title: "Contrast (WCAG AA)",
    items: [
      { id: "c-body", label: "Body text vs background ≥ 4.5:1", detail: "Check `text-foreground` on `bg-background` in both themes." },
      { id: "c-muted", label: "Muted text ≥ 4.5:1 on card + background", detail: "`text-muted-foreground` on `bg-card` and `bg-background`." },
      { id: "c-links", label: "Link/interactive text distinguishable without color alone", detail: "Underline on hover, aria labels present." },
      { id: "c-badges", label: "Difficulty and product badges legible in dark mode", detail: "Hub cards, template cards." },
      { id: "c-code", label: "Inline code / target hotspot chip readable", detail: "Editor target `data-sim` chip." },
    ],
  },
  {
    id: "focus",
    title: "Focus rings & keyboard",
    items: [
      { id: "f-tab", label: "Tab order matches visual order across editor panes", detail: "Sidebar → stage → editor." },
      { id: "f-ring", label: "Every actionable control shows a visible focus ring", detail: "Use `focus-visible:ring-ring` in both themes." },
      { id: "f-esc", label: "Escape closes AI dialog and preview overlay", detail: "Dialog primitive; overlay Skip closes." },
      { id: "f-arrow", label: "Guided/Let-me-try toggle reachable with arrow or Tab", detail: "aria-pressed announces state." },
    ],
  },
  {
    id: "tooltips",
    title: "Tour tooltips & spotlight",
    items: [
      { id: "t-dim", label: "Spotlight dim overlay ≥ 65% opacity in dark", detail: "Tooltip readable over any workspace theme." },
      { id: "t-ring", label: "Spotlight border uses `--ring` token", detail: "Consistent color between themes." },
      { id: "t-md", label: "Markdown body uses `dark:prose-invert`", detail: "Bold, code, and lists have contrast." },
      { id: "t-role", label: "Tooltip uses role=dialog with labelled/description ids", detail: "Screen readers announce step content." },
    ],
  },
  {
    id: "modals",
    title: "Modals & dialogs",
    items: [
      { id: "m-back", label: "AI Generate dialog backdrop ≥ 60% opacity", detail: "Prevents workspace bleed-through in dark." },
      { id: "m-close", label: "Close button has accessible name", detail: "aria-label or visible text." },
      { id: "m-trap", label: "Focus trapped inside dialog", detail: "shadcn/Radix handles this — verify." },
    ],
  },
  {
    id: "editor",
    title: "Editor panels",
    items: [
      { id: "e-title", label: "Title input focus ring visible", detail: "Header title editor in `/tours/:id`." },
      { id: "e-select", label: "Screen selector has label + ring", detail: "Right editor pane." },
      { id: "e-picker", label: "Hotspot picker banner readable in both themes", detail: "Uses primary token." },
      { id: "e-list", label: "Active step highlight distinguishable without color only", detail: "Left border + background." },
    ],
  },
  {
    id: "exportshare",
    title: "Export & share",
    items: [
      { id: "x-json", label: "Export JSON downloads a valid file", detail: "Filename matches slug." },
      { id: "x-pdf", label: "Export PDF renders steps + help + glossary", detail: "Text wraps and paginates." },
      { id: "x-link", label: "Share link opens `/shared` and plays without login", detail: "Permalink is self-contained (base64)." },
      { id: "x-save", label: "Save to library from shared page works", detail: "Clone tour with new id." },
    ],
  },
];

const KEY = "onboarding-studio:qa:v1";

function QAPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setChecked(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(checked));
  }, [checked]);

  const total = useMemo(() => SECTIONS.reduce((n, s) => n + s.items.length, 0), []);
  const done = Object.values(checked).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    document.documentElement.classList.toggle("dark", next === "dark");
    localStorage.setItem("theme", next);
    setTheme(next);
  };

  const reset = () => setChecked({});

  return (
    <main className="mx-auto min-h-dvh max-w-3xl px-6 py-10">
      <Link
        to="/"
        className="mb-6 inline-flex items-center gap-1.5 rounded px-1 text-sm text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to studio
      </Link>

      <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-semibold">Dark-mode QA checklist</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Walk through every tour surface in both themes. Ticks are stored locally.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode for testing`}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {theme === "dark" ? <Sun className="h-3.5 w-3.5" aria-hidden /> : <Moon className="h-3.5 w-3.5" aria-hidden />}
            {theme === "dark" ? "Light" : "Dark"}
          </button>
          <button
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium ring-1 ring-border hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden /> Reset
          </button>
        </div>
      </header>

      <div className="mb-8 rounded-lg border border-border bg-card p-4">
        <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
          <span>{done} of {total} verified</span>
          <span aria-hidden>{pct}%</span>
        </div>
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="QA progress"
          className="h-2 w-full overflow-hidden rounded-full bg-secondary"
        >
          <div className="h-full bg-accent transition-all" style={{ width: `${pct}%` }} />
        </div>
      </div>

      <div className="space-y-6">
        {SECTIONS.map((s) => (
          <section key={s.id} aria-labelledby={`sec-${s.id}`} className="rounded-lg border border-border bg-card">
            <h2 id={`sec-${s.id}`} className="border-b border-border px-4 py-2.5 font-display text-sm font-semibold">
              {s.title}
            </h2>
            <ul className="divide-y divide-border">
              {s.items.map((item) => {
                const on = !!checked[item.id];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => setChecked((c) => ({ ...c, [item.id]: !c[item.id] }))}
                      aria-pressed={on}
                      className="flex w-full items-start gap-3 px-4 py-3 text-left hover:bg-secondary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                    >
                      {on ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-accent" aria-hidden />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden />
                      )}
                      <span className="flex-1">
                        <span className={`block text-sm font-medium ${on ? "text-foreground line-through opacity-70" : "text-foreground"}`}>
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">{item.detail}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </main>
  );
}
