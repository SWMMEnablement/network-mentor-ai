# Reusable Onboarding Tour Templates

Add a curated, built-in **template library** covering all five simulated products. Templates are first-class, read-only blueprints that users can preview, then **clone into their library** to play or edit as a normal tour.

## What ships

For each product, 2–3 ready-to-use templates targeting the canonical "new user" jobs-to-be-done, each anchored to the existing `data-sim` selectors in the workspace screens:

- **InfoWorks ICM**
  - *First model in 10 minutes* — Start Page → Master DB → open Network → Run dialog → Results browser
  - *Reading 2D mesh results* — Network+2D Mesh → Results browser (depth/velocity layers)
  - *Setting up a simulation run* — Run dialog walkthrough (engine, timesteps, output)
- **ICM SWMM Networks**
  - *Build a SWMM network in ICM* — Explorer → Subcatchment Map → Run setup → Time-series
  - *Compare SWMM vs ICM engine* — Run setup callouts + results panel
- **EPA SWMM 5**
  - *Your first SWMM5 project* — Project tree → Study area map → Run → Status report
  - *Interpreting the status report* — Run status → continuity errors → report
- **InfoDrainage**
  - *Design a SuDS scheme* — Site plan → Stormwater controls → Analysis → Compliance
  - *Generate a compliance report* — Analysis → Compliance report
- **Civil 3D — Drainage**
  - *Pipe network drainage analysis* — Drawing → Toolspace → Parts list → Analyze
  - *From draft to analyzed network* — Toolspace parts → Analyze workflow

Each template includes: title, persona, goal, ordered steps (screen + `targetSim` + title + markdown body + action), a short **help article**, and a small **glossary** (e.g. "subcatchment", "SuDS", "outfall", "continuity error").

## UX

- New route **`/templates`** — gallery grouped by product, with cards (title, persona, step count, est. time, "what you'll learn"). Filters: product, persona (engineer / reviewer / student), length.
- Card actions:
  - **Preview** → opens the workspace with the template's `TourOverlay` running in read-only mode (no save).
  - **Use template** → clones the template into the user's library (new `id`, `createdAt`, `updatedAt`) and navigates to the author route, ready to edit.
- Entry points: "Browse templates" button on the Hub (`/`), the Tour Library (`/tours`), and inside `AIGenerateDialog` as "Start from a template instead".
- Template cards on the product workspace (`/products/$productId`) show only that product's templates.

## Data + code structure

- New `src/lib/tour-templates/` directory:
  - `index.ts` — `TEMPLATES: TourTemplate[]` aggregator + `templatesForProduct(id)`.
  - `icm.ts`, `icm-swmm.ts`, `swmm5.ts`, `infodrainage.ts`, `civil3d.ts` — one file per product, each exporting a typed array.
- New type in `src/lib/tour-types.ts`:
  ```ts
  interface TourTemplate extends Omit<Tour, 'id'|'createdAt'|'updatedAt'> {
    templateId: string;           // stable slug, e.g. "icm.first-model"
    estMinutes: number;
    learn: string[];              // bullet outcomes for the card
    category: 'getting-started' | 'analysis' | 'reporting';
  }
  ```
- `src/lib/tour-storage.ts` gains `cloneTemplate(t: TourTemplate): Tour` — assigns new uuid/timestamps, calls `saveTour`, returns the new tour.
- New routes:
  - `src/routes/templates.tsx` — gallery (filters + grid).
  - `src/routes/templates.$templateId.tsx` — preview (uses `ProductWorkspace` + `TourOverlay` in read-only mode, "Use this template" CTA).
- `TourOverlay` accepts an optional `readOnly` prop to hide author-only affordances during preview.
- All template `targetSim` values must match existing selectors already emitted by `Ribbon` (`tab-*`, `tool-*`, `menu-*`) and the other sim primitives. Where a needed hotspot is missing, add a `data-sim` attribute to the relevant sim component — no behavior changes.

## Out of scope

- AI-generating new templates (existing `AIGenerateDialog` already covers that).
- Cloud-side template sharing / community submissions.
- Editing templates in place — clone-to-edit only, keeping templates as a stable seed set.

## Build order

1. Types + storage helper (`cloneTemplate`, `TourTemplate`).
2. Author the 5 product template files (content + selectors).
3. `/templates` gallery + `/templates/$templateId` preview routes.
4. Entry points on Hub, Library, workspace, and AI dialog.
5. Add any missing `data-sim` selectors uncovered while authoring steps.
