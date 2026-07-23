import jsPDF from "jspdf";
import LZString from "lz-string";
import type { Tour } from "./tour-types";
import { productById } from "./products";

/** Trigger a browser download of a Blob. */
function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const slug = (s: string) => s.replace(/\s+/g, "-").toLowerCase();

export function exportTourJson(tour: Tour) {
  const blob = new Blob([JSON.stringify(tour, null, 2)], { type: "application/json" });
  download(blob, `${slug(tour.title)}.json`);
}

/** Render a printable, screen-reader-friendly PDF of the tour. */
export function exportTourPdf(tour: Tour) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const product = productById(tour.productId);
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 54;
  let y = margin;

  const ensureRoom = (needed: number) => {
    if (y + needed > pageH - margin) {
      doc.addPage();
      y = margin;
    }
  };

  const writeWrapped = (text: string, size: number, opts: { bold?: boolean; color?: [number, number, number] } = {}) => {
    doc.setFont("helvetica", opts.bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...(opts.color ?? [20, 20, 30]));
    const lines = doc.splitTextToSize(text, pageW - margin * 2) as string[];
    for (const line of lines) {
      ensureRoom(size * 1.25);
      doc.text(line, margin, y);
      y += size * 1.25;
    }
  };

  // Header
  writeWrapped(tour.title, 22, { bold: true });
  y += 6;
  writeWrapped(`${product?.name ?? tour.productId} · ${tour.steps.length} steps`, 11, {
    color: [110, 110, 130],
  });
  y += 4;
  if (tour.persona) writeWrapped(`Persona: ${tour.persona}`, 11, { color: [70, 70, 90] });
  if (tour.goal) writeWrapped(`Goal: ${tour.goal}`, 11, { color: [70, 70, 90] });
  y += 12;

  // Steps
  writeWrapped("Steps", 14, { bold: true });
  y += 6;
  tour.steps.forEach((s, i) => {
    ensureRoom(60);
    writeWrapped(`${i + 1}. ${s.title || "Untitled step"}`, 12, { bold: true });
    writeWrapped(`Screen: ${s.screenId}${s.targetSim ? ` · Target: ${s.targetSim}` : ""}`, 9, {
      color: [120, 120, 140],
    });
    if (s.body) writeWrapped(s.body, 11);
    y += 8;
  });

  // Help articles
  if (tour.help?.length) {
    ensureRoom(40);
    y += 8;
    writeWrapped("Help articles", 14, { bold: true });
    y += 4;
    tour.help.forEach((h) => {
      writeWrapped(h.title, 12, { bold: true });
      if (h.body) writeWrapped(h.body, 11);
      y += 6;
    });
  }

  // Glossary
  if (tour.glossary?.length) {
    ensureRoom(40);
    y += 8;
    writeWrapped("Glossary", 14, { bold: true });
    y += 4;
    tour.glossary.forEach((g) => {
      writeWrapped(`${g.term} — ${g.definition}`, 11);
    });
  }

  doc.save(`${slug(tour.title)}.pdf`);
}

/** Encode a tour into a URL-safe token for /shared#t=... permalinks. */
export function encodeTourToken(tour: Tour): string {
  return LZString.compressToEncodedURIComponent(JSON.stringify(tour));
}

export function decodeTourToken(token: string): Tour | null {
  try {
    const json = LZString.decompressFromEncodedURIComponent(token);
    if (!json) return null;
    return JSON.parse(json) as Tour;
  } catch {
    return null;
  }
}

/** Build an absolute permalink for the given tour. */
export function buildShareLink(tour: Tour): string {
  if (typeof window === "undefined") return "";
  const token = encodeTourToken(tour);
  return `${window.location.origin}/shared#t=${token}`;
}
