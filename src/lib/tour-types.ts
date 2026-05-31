import type { ProductId } from "./products";

export interface TourStep {
  id: string;
  screenId: string;
  // The `data-sim` attribute value of the target element.
  targetSim: string | null;
  title: string;
  body: string;
  action?: "click" | "look" | "type";
}

export interface HelpArticle {
  id: string;
  title: string;
  body: string;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface Tour {
  id: string;
  productId: ProductId;
  title: string;
  persona: string;
  goal: string;
  steps: TourStep[];
  help: HelpArticle[];
  glossary: GlossaryEntry[];
  createdAt: number;
  updatedAt: number;
}

export type TemplateCategory = "getting-started" | "analysis" | "reporting";

export interface TourTemplate {
  templateId: string;
  productId: ProductId;
  title: string;
  persona: string;
  goal: string;
  category: TemplateCategory;
  estMinutes: number;
  learn: string[];
  steps: Omit<TourStep, "id">[];
  help: Omit<HelpArticle, "id">[];
  glossary: GlossaryEntry[];
}

export const newTour = (productId: ProductId, partial: Partial<Tour> = {}): Tour => ({
  id: crypto.randomUUID(),
  productId,
  title: partial.title ?? "Untitled tour",
  persona: partial.persona ?? "New user",
  goal: partial.goal ?? "",
  steps: partial.steps ?? [],
  help: partial.help ?? [],
  glossary: partial.glossary ?? [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});

export const tourFromTemplate = (t: TourTemplate): Tour => ({
  id: crypto.randomUUID(),
  productId: t.productId,
  title: t.title,
  persona: t.persona,
  goal: t.goal,
  steps: t.steps.map((s) => ({ ...s, id: crypto.randomUUID() })),
  help: t.help.map((h) => ({ ...h, id: crypto.randomUUID() })),
  glossary: [...t.glossary],
  createdAt: Date.now(),
  updatedAt: Date.now(),
});
