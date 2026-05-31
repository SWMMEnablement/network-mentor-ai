import type { Tour } from "./tour-types";

// localStorage-backed tour store. v1 keeps this simple — no auth needed.
// Schema is the same JSON we'd persist in Lovable Cloud later, so swapping
// the backend is a drop-in change.

const KEY = "onboarding-studio:tours:v1";

const isBrowser = () => typeof window !== "undefined";

export function listTours(): Tour[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Tour[];
  } catch {
    return [];
  }
}

export function getTour(id: string): Tour | undefined {
  return listTours().find((t) => t.id === id);
}

export function saveTour(tour: Tour) {
  if (!isBrowser()) return;
  const all = listTours().filter((t) => t.id !== tour.id);
  all.unshift({ ...tour, updatedAt: Date.now() });
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("tours-changed"));
}

export function deleteTour(id: string) {
  if (!isBrowser()) return;
  const all = listTours().filter((t) => t.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
  window.dispatchEvent(new CustomEvent("tours-changed"));
}
