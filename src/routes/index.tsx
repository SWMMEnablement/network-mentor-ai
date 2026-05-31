import { createFileRoute, Link } from "@tanstack/react-router";
import { PRODUCTS } from "@/lib/products";

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
            <Link to="/templates" className="text-muted-foreground hover:text-foreground">Templates</Link>
            <Link to="/tours" className="text-muted-foreground hover:text-foreground">Tour library</Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-12">
        <h1 className="mb-2 font-display text-4xl font-semibold tracking-tight">Pick a product to simulate.</h1>
        <p className="mb-10 max-w-2xl text-muted-foreground">
          Each card opens a high-fidelity replica you can click around in. From the workspace, generate an
          AI-authored tour or build one yourself with the step editor.
        </p>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PRODUCTS.map((p) => (
            <Link
              key={p.id}
              to="/products/$productId"
              params={{ productId: p.id }}
              className="group flex flex-col rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-accent hover:shadow-lg"
            >
              <div className="mb-3 inline-flex w-fit rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {p.vendor}
              </div>
              <h2 className="mb-1 font-display text-xl font-semibold">{p.name}</h2>
              <p className="mb-4 flex-1 text-sm text-muted-foreground">{p.tagline}</p>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{p.screens.length} screens · v1</span>
                <span className="text-foreground/70 transition-colors group-hover:text-accent">Open →</span>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
