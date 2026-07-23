import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS, type ProductId } from "@/lib/products";
import { templatesForProduct } from "@/lib/tour-templates";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Onboarding Studio for Drainage & Hydraulic Apps" },
      {
        name: "description",
        content:
          "Design, simulate, and AI-generate onboarding tours for InfoWorks ICM, ICM SWMM, SWMM5, InfoDrainage, and Civil 3D drainage.",
      },
    ],
  }),
  component: Hub,
});

// Per-product metadata for richer cards. Kept next to the hub so the
// product registry itself stays a lean source of truth.
const PRODUCT_META: Record<ProductId, { difficulty: "Beginner" | "Intermediate" | "Advanced"; updated: string; accent: string }> = {
  "icm": { difficulty: "Advanced", updated: "Jul 2026", accent: "from-sky-500/20 to-cyan-400/10" },
  "icm-swmm": { difficulty: "Intermediate", updated: "Jul 2026", accent: "from-emerald-500/20 to-teal-400/10" },
  "swmm5": { difficulty: "Beginner", updated: "Jul 2026", accent: "from-amber-500/20 to-orange-400/10" },
  "swmm6": { difficulty: "Intermediate", updated: "Jul 2026", accent: "from-cyan-500/20 to-blue-500/10" },
  "infodrainage": { difficulty: "Intermediate", updated: "Jul 2026", accent: "from-violet-500/20 to-fuchsia-400/10" },
  "civil3d": { difficulty: "Advanced", updated: "Jul 2026", accent: "from-rose-500/20 to-pink-400/10" },
};

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick a product",
    body: "Open a high-fidelity replica of ICM, SWMM5, InfoDrainage, and more. Click ribbons, tree nodes, and the map like the real thing.",
  },
  {
    step: "02",
    title: "Start from a template or the AI",
    body: "Clone one of the curated onboarding flows, or describe a persona and goal — the AI drafts steps anchored to real UI selectors.",
  },
  {
    step: "03",
    title: "Edit, preview, and ship",
    body: "Refine step copy, help articles, and glossary in the editor. Preview live inside the simulated app, then share a play link.",
  },
];

const FEATURES = [
  {
    title: "Step editor with UI anchoring",
    body: "Every step targets a real data-sim selector inside the replica. Reorder, rewrite markdown, add click/look/type actions, and add screens as you go.",
  },
  {
    title: "AI author, grounded in the real UI",
    body: "The generator sees each screen's actual selectors, plus your persona and goal. Outputs steps, a help article stub, and a glossary — no hallucinated buttons.",
  },
  {
    title: "Play links + JSON export",
    body: "Every tour has a shareable /tours/:id/play URL. Full tour JSON (steps, help, glossary) is stored locally and portable to any LMS or docs site.",
  },
  {
    title: "Coverage across five products",
    body: "ICM, ICM SWMM, SWMM5, InfoDrainage, and Civil 3D drainage — one workspace, one authoring model, one help schema.",
  },
];

function Hub() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <div>
            <div className="font-display text-lg font-semibold tracking-tight">Onboarding Studio</div>
            <div className="text-xs text-muted-foreground">
              Simulate · author · generate help systems for drainage software
            </div>
          </div>
          <nav className="flex items-center gap-4 text-sm">
            <a href="#how" className="text-muted-foreground hover:text-foreground">How it works</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <Link to="/templates" className="text-muted-foreground hover:text-foreground">Templates</Link>
            <Link to="/tours" className="text-muted-foreground hover:text-foreground">Tour library</Link>
            <Link to="/qa" className="text-muted-foreground hover:text-foreground">QA</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-12">
        {/* Hero */}
        <section className="mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            High-fidelity replicas · AI-authored tours · Shareable play links
          </div>
          <h1 className="mb-3 max-w-3xl font-display text-4xl font-semibold tracking-tight md:text-5xl">
            Onboarding for drainage software, without waiting on the vendor.
          </h1>
          <p className="mb-8 max-w-2xl text-muted-foreground">
            Design and simulate first-run experiences for five specialised hydraulic modelling apps. Click through a
            faithful replica, then hand-author or AI-generate a tour anchored to the real UI.
          </p>
          <div className="flex flex-wrap gap-2">
            <a href="#products" className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90">
              Pick a product
            </a>
            <Link to="/templates" className="rounded-md px-4 py-2 text-sm font-medium ring-1 ring-border hover:bg-secondary">
              Browse templates
            </Link>
          </div>
        </section>

        {/* How it works */}
        <section id="how" className="mb-16 scroll-mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">How it works</div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">Three steps, one afternoon.</h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {HOW_IT_WORKS.map((s) => (
              <div key={s.step} className="rounded-xl border border-border bg-card p-5">
                <div className="mb-3 font-display text-2xl font-semibold text-accent">{s.step}</div>
                <h3 className="mb-1.5 font-display text-lg font-semibold">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.body}</p>
              </div>
            ))}
          </div>

          {/* Example tour preview */}
          <div className="mt-6 overflow-hidden rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border bg-secondary/60 px-4 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="ml-2 font-mono text-muted-foreground">preview · your first ICM model</span>
              </div>
              <span className="text-muted-foreground">Step 2 of 5</span>
            </div>
            <div className="grid gap-0 md:grid-cols-[1fr,320px]">
              {/* Fake workspace */}
              <div className="relative min-h-[260px] bg-[linear-gradient(135deg,var(--secondary),transparent)] p-4">
                <div className="mb-3 flex gap-1">
                  {["Home", "Model", "Network", "Run", "Results"].map((t, i) => (
                    <div key={t} className={`rounded px-2 py-1 text-[10px] ${i === 2 ? "bg-accent/20 text-accent" : "bg-secondary text-muted-foreground"}`}>{t}</div>
                  ))}
                </div>
                <div className="grid grid-cols-[110px,1fr] gap-3">
                  <div className="space-y-1 rounded border border-border bg-background/60 p-2 text-[10px]">
                    <div>📁 Master DB</div>
                    <div className="pl-3">📁 Model group</div>
                    <div className="pl-6 text-accent">📁 Networks ●</div>
                    <div className="pl-3">📁 Rainfall</div>
                    <div className="pl-3">📁 Runs</div>
                  </div>
                  <div className="relative rounded border border-border bg-background/40 p-3">
                    <div className="absolute left-6 top-6 h-2 w-2 rounded-full bg-sky-400" />
                    <div className="absolute left-20 top-14 h-2 w-2 rounded-full bg-sky-400" />
                    <div className="absolute left-40 top-24 h-2 w-2 rounded-full bg-emerald-500" />
                    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 300 200" fill="none">
                      <path d="M28 28 L88 60 L168 100" stroke="currentColor" strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 3" />
                    </svg>
                    <div className="absolute right-3 top-3 rounded-full border border-accent/40 bg-accent/10 px-2 py-0.5 text-[10px] text-accent">Networks</div>
                  </div>
                </div>
                {/* Callout arrow */}
                <div className="pointer-events-none absolute left-[112px] top-[92px]">
                  <div className="h-4 w-4 animate-pulse rounded-full ring-4 ring-accent/40" />
                </div>
              </div>
              {/* Tour card */}
              <div className="border-t border-border bg-secondary/40 p-5 md:border-l md:border-t-0">
                <div className="mb-1 text-[10px] uppercase tracking-widest text-muted-foreground">Step 2 · Look</div>
                <h4 className="mb-2 font-display text-base font-semibold">Open the Networks group</h4>
                <p className="mb-3 text-xs text-muted-foreground">
                  Every model version lives inside a network. Click <span className="rounded bg-background px-1 py-0.5 font-mono text-[10px]">Networks</span> in the
                  Master Database tree to see the versions available in this master DB.
                </p>
                <div className="mb-3 rounded border border-border bg-background p-2 text-[10px] text-muted-foreground">
                  <span className="font-medium text-foreground">Glossary — Network:</span> a named, versioned model of the pipe/channel system.
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">1 · 2 · 3 · 4 · 5</span>
                  <span className="rounded bg-foreground px-2 py-1 text-background">Next →</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Products */}
        <section id="products" className="mb-16 scroll-mt-16">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">Products</div>
              <h2 className="font-display text-2xl font-semibold tracking-tight">Pick a product to simulate.</h2>
            </div>
            <Link to="/templates" className="text-sm text-muted-foreground hover:text-foreground">All templates →</Link>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {PRODUCTS.map((p) => {
              const meta = PRODUCT_META[p.id];
              const templateCount = templatesForProduct(p.id).length;
              return (
                <Link
                  key={p.id}
                  to="/products/$productId"
                  params={{ productId: p.id }}
                  className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
                >
                  <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-60 ${meta.accent}`} />
                  <div className="relative">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="inline-flex w-fit rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                        {p.vendor}
                      </div>
                      <div className="rounded-full border border-border bg-background/70 px-2 py-0.5 text-[10px] text-foreground/80">
                        {meta.difficulty}
                      </div>
                    </div>
                    <h2 className="mb-1 font-display text-xl font-semibold">{p.name}</h2>
                    <p className="mb-4 flex-1 text-sm text-muted-foreground">{p.tagline}</p>
                    <div className="mb-3 flex flex-wrap gap-1.5 text-[10px]">
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-muted-foreground">{p.screens.length} screens</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-muted-foreground">{templateCount} template{templateCount === 1 ? "" : "s"}</span>
                      <span className="rounded bg-secondary px-1.5 py-0.5 text-muted-foreground">Updated {meta.updated}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">v1 · shallow replica</span>
                      <span className="text-foreground/70 transition-colors group-hover:text-accent">Open →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Features / transparency */}
        <section id="features" className="mb-16 scroll-mt-16">
          <div className="mb-6">
            <div className="mb-1 text-xs uppercase tracking-widest text-muted-foreground">What you get</div>
            <h2 className="font-display text-2xl font-semibold tracking-tight">Everything a tour needs, nothing it doesn't.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5">
                <h3 className="mb-1.5 font-display text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.body}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Note: the workspace UIs here are original replicas built for training and documentation. They are not
            affiliated with, endorsed by, or connected to Autodesk, Innovyze, or the US EPA.
          </p>
        </section>
      </main>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6 text-xs text-muted-foreground">
          <span>Onboarding Studio · built for drainage & hydraulic modelling teams</span>
          <div className="flex gap-4">
            <a href="#how" className="hover:text-foreground">How it works</a>
            <Link to="/templates" className="hover:text-foreground">Templates</Link>
            <Link to="/tours" className="hover:text-foreground">Tours</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
