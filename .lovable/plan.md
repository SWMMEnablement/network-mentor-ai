
# Onboarding Studio for Drainage & Hydraulic Modeling Apps

A single web app that does three jobs at once for **InfoWorks ICM**, **InfoWorks ICM SWMM Networks**, **EPA SWMM5**, **Autodesk InfoDrainage**, and **drainage analysis in Civil 3D**:

1. **Simulate** each product as a high-fidelity, clickable replica.
2. **Author** product tours and help articles (steps, tooltips, hotspots, branching).
3. **Generate** tour content with AI from a goal like "teach a new user to import a SWMM5 .inp and run a steady-state sim".

The simulated product becomes the *canvas* the tour plays on — same component, used in author mode, preview mode, and "new user" simulation mode.

---

## What the user gets in v1

- **Product hub**: 5 product cards (ICM, ICM SWMM, SWMM5, InfoDrainage, Civil 3D Drainage). Each opens a dedicated simulated workspace.
- **Simulated workspaces** (high-fidelity, schematic where exact UI is unknowable): replica ribbon/menus, model tree / project explorer, map/canvas area, properties grid, output/results pane. Each product gets its own chrome (Innovyze blue ICM, Autodesk dark Civil 3D ribbon, SWMM5 classic MDI, InfoDrainage card-based).
- **Tour player**: spotlight overlay, tooltip bubbles, "Next / Back / Skip", progress bar, branching ("did the import succeed?"), and a "let me try" mode that locks the UI to one valid click.
- **Tour authoring**: pick a screen → click any element → add a step (title, body markdown, hotspot shape, required action, branch). Reorder via drag-and-drop. Live preview.
- **AI tour designer**: enter product + learner persona + goal → AI returns a structured tour (steps, copy, suggested hotspots, help article, glossary). Editable before save. Streamed via Lovable AI Gateway (`google/gemini-3-flash-preview` default).
- **Help system**: per-product searchable help center generated alongside each tour — articles, FAQs, glossary, "related tours".
- **Library**: saved tours, versioning, duplicate, fork across products ("port this ICM tour to SWMM5").
- **Export**: JSON (schema below), Markdown handbook, printable PDF (browser print route), and a shareable read-only preview link.
- **Telemetry of the simulation itself**: track which step new users get stuck on (time-on-step, skips, wrong clicks) to mark "friction points" in the authoring UI.

## Honest scope note

Five drainage apps at *true* pixel-fidelity is a months-long art project. v1 commits to **high-fidelity schematic replicas**: correct layout grammar, menu/ribbon structure, signature panels, and 4–6 deeply modeled screens per product (the ones a new user actually meets in the first hour). Deeper screens render as annotated placeholders the tour can still point at. We can densify product-by-product after v1.

## Per-product v1 screen set (4–6 each)

- **InfoWorks ICM**: Start page → Master DB / Model Group tree → 2D mesh + network map → Run dialog → Results browser.
- **ICM SWMM Networks**: Network explorer → Subcatchment/conduit map → SWMM run setup → Time-series results.
- **SWMM5 (EPA)**: Classic MDI shell → Project tree (Subcatchments/Junctions/Conduits/Raingages) → Study area map → Run status → Status report + time-series plot.
- **InfoDrainage**: Project dashboard → Site plan canvas → Stormwater control library → Analysis run → Results & compliance report.
- **Civil 3D drainage**: Ribbon (Home / Analyze / Output) → Toolspace (Prospector/Settings) → Drawing area with pipe network → Parts list / Pipe Network Properties → Analyze drainage workflow.

Each replica is built from shared primitives (`<Ribbon>`, `<ModelTree>`, `<MapCanvas>`, `<PropertiesGrid>`, `<ResultsPane>`, `<StatusBar>`) themed per product via CSS tokens — so adding screens later is cheap.

---

## How it works (technical section)

### Stack
- TanStack Start (existing), Tailwind v4, shadcn, framer-motion for spotlight/tooltip motion.
- **Lovable Cloud** enabled → Postgres for tours, accounts (Supabase Auth, email + Google), storage for screenshot assets, RLS per user/workspace.
- **Lovable AI Gateway** via server functions for tour generation (`google/gemini-3-flash-preview`; streamed for the long generations).

### Routes
```
/                                  hub: product picker + recent tours
/products/$productId               simulated workspace (default screen)
/products/$productId/$screenId     specific screen
/tours                             library
/tours/$tourId                     author mode (sim canvas + side panel)
/tours/$tourId/play                player mode (sim canvas + tour overlay)
/tours/$tourId/print               print route for PDF export
/help/$productId                   generated help center
/api/ai/generate-tour              server route, streamed SSE
/api/ai/generate-help-article      server route, streamed SSE
/api/public/share/$shareId         read-only public tour preview
```

### Data model (Lovable Cloud, all with RLS by `owner_id`)
- `products` (seeded, 5 rows) — id, name, theme tokens, screen registry pointer.
- `tours` — id, owner_id, product_id, title, persona, goal, status, version, fork_of.
- `tour_steps` — id, tour_id, order, screen_id, hotspot {selector|coords|shape}, title, body_md, required_action, branch_rules jsonb.
- `help_articles` — id, owner_id, product_id, tour_id (nullable), title, body_md, tags.
- `tour_runs` — id, tour_id, anon_session_id, started_at, finished_at.
- `tour_run_events` — run_id, step_id, event (`view|next|back|skip|wrong_click|complete`), ms_on_step.
- `user_roles` (separate table, per security rules) — owner / editor / viewer.
- `share_links` — id, tour_id, slug, expires_at (read-only `/api/public/share`).

### Tour JSON schema (export & AI output)
```json
{
  "product": "swmm5",
  "title": "Run your first SWMM5 simulation",
  "persona": "civil engineer new to SWMM",
  "steps": [
    { "screen": "project-tree", "hotspot": {"selector": "[data-sim='node-subcatchments']"},
      "title": "Subcatchments live here", "body": "...", "action": "click",
      "branches": [{"if": "skipped", "go": "step-glossary-subcatchment"}] }
  ],
  "help": [{ "title": "What is a subcatchment?", "body_md": "..." }],
  "glossary": [{ "term": "Subcatchment", "def": "..." }]
}
```

### AI generation
- Server function `generateTour` → POST `/v1/chat/completions` with tool-calling (`emit_tour` function whose parameters mirror the schema above). Streams chunks via `/api/ai/generate-tour` (server route, raw `Response`). The author UI shows steps appearing live.
- Separate `generateHelpArticle` (non-streamed, `supabase.functions.invoke`-style server fn) for individual articles.
- 402/429 surfaced as toasts ("Add credits in Settings → Workspace → Usage").

### Simulation engine
- Each product screen is a real React tree with `data-sim="..."` attributes on interactive elements.
- The tour player resolves hotspots by `data-sim` selector first, falls back to coords overlay if the element is offscreen.
- "Let me try" mode: a single transparent overlay covers everything except the matched element, so the new user is physically guided to the right click — that's the core "simulated onboarding" feel.

### Design direction
Two-pane chrome: a calm, neutral *studio shell* (off-white #FAFAF7, ink #14181D, accent oklch teal) wrapping per-product workspaces that adopt that product's own visual language. Studio uses one display font + one mono (e.g., `@fontsource/space-grotesk` + `@fontsource/jetbrains-mono`). Per-product themes override CSS tokens only inside the workspace frame.

### Out of scope for v1
- Real hydraulic computation. The "Run" button plays a canned result.
- Importing real `.inp` / `.icmm` / `.dwg` files. We ship demo projects.
- Multi-tenant orgs / SSO / billing.

---

## Build order

1. Enable Lovable Cloud; migrations for the schema above + seed `products`.
2. Studio shell, routing, product hub, auth.
3. Shared simulation primitives (`Ribbon`, `ModelTree`, `MapCanvas`, `PropertiesGrid`, `ResultsPane`).
4. Product 1 end-to-end (SWMM5 — simplest UI grammar) including 5 screens.
5. Tour data model + author mode + player overlay + "let me try".
6. AI generate-tour server route (streamed) wired to author mode.
7. Help center generation + library + export (JSON/Markdown/print PDF).
8. Public share links (`/api/public/share/$slug`).
9. Replicate steps 4 for the other four products in turn (shared primitives keep this cheap).
10. Friction-point telemetry surfaced in author mode.

Ready to enable Lovable Cloud and start building when you approve.
