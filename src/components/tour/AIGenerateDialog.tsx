import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { ProductDef } from "@/lib/products";
import type { Tour, TourStep, HelpArticle, GlossaryEntry } from "@/lib/tour-types";

interface Props {
  product: ProductDef;
  open: boolean;
  onClose: () => void;
  onResult: (partial: { title: string; steps: TourStep[]; help: HelpArticle[]; glossary: GlossaryEntry[] }) => void;
}

// Collects available data-sim selectors per screen by mounting each screen in
// a hidden container would be expensive — instead we ship a small static map
// derived from the workspace components.
const SIMS_BY_SCREEN: Record<string, string[]> = {
  start: ["docpane-start"],
  "master-db": ["node-master-db", "node-model-group", "node-networks", "tool-import"],
  network: ["map-node-j1", "map-node-j2", "map-node-out1", "link-c1", "tool-mesh-2d"],
  run: ["run-dialog", "run-start"],
  results: ["results-pane"],
  explorer: ["node-networks", "node-subcatchments", "tool-subcatchment"],
  map: ["map-node-j1", "map-node-j2", "poly-p-s1", "tool-conduit"],
  project: ["node-raingages", "node-subcatchments", "node-junctions", "node-conduits"],
  report: ["results-pane"],
  site: ["docpane-site", "tool-pond", "tool-swale"],
  controls: ["node-controls", "tool-pond", "tool-permeable"],
  analysis: ["run-dialog", "run-start"],
  compliance: ["results-pane"],
  drawing: ["map-node-j1", "tool-draw-pipe", "tool-draw-structure"],
  toolspace: ["docpane-toolspace", "node-prospector", "node-pipe-networks"],
  parts: ["docpane-parts", "node-pipe-networks"],
  analyze: ["run-dialog", "run-start"],
};

export function AIGenerateDialog({ product, open, onClose, onResult }: Props) {
  const [persona, setPersona] = useState("Civil engineer new to the software");
  const [goal, setGoal] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { if (open) setError(null); }, [open]);

  if (!open) return null;

  const generate = async () => {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/ai/generate-tour", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.id,
          productLabel: product.name,
          persona,
          goal,
          screens: product.screens.map((s) => ({
            id: s.id,
            label: s.label,
            sims: SIMS_BY_SCREEN[s.id] ?? [],
          })),
        }),
      });
      if (res.status === 429) throw new Error("Rate limit reached. Try again in a moment.");
      if (res.status === 402) throw new Error("Add credits in Settings → Workspace → Usage.");
      if (!res.ok || !res.body) throw new Error(`AI gateway error (${res.status}).`);

      // Stream and accumulate the tool-call arguments.
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let argsAcc = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        let nl;
        while ((nl = buf.indexOf("\n")) !== -1) {
          let line = buf.slice(0, nl);
          buf = buf.slice(nl + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") continue;
          try {
            const parsed = JSON.parse(json);
            const tc = parsed.choices?.[0]?.delta?.tool_calls?.[0];
            const argsChunk = tc?.function?.arguments;
            if (typeof argsChunk === "string") argsAcc += argsChunk;
          } catch {
            // partial — re-buffer
            buf = line + "\n" + buf;
            break;
          }
        }
      }
      const parsed = JSON.parse(argsAcc);
      onResult({
        title: parsed.title,
        steps: (parsed.steps as any[]).map((s) => ({
          id: crypto.randomUUID(),
          screenId: s.screenId,
          targetSim: s.targetSim ?? null,
          title: s.title,
          body: s.body,
          action: s.action,
        })),
        help: (parsed.help as any[]).map((h) => ({ id: crypto.randomUUID(), title: h.title, body: h.body })),
        glossary: parsed.glossary,
      });
      toast.success("Tour generated.");
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="w-[520px] rounded-lg bg-background p-5 shadow-2xl ring-1 ring-border">
        <h2 className="mb-1 font-display text-lg font-semibold">Generate a tour with AI</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          For <span className="font-medium text-foreground">{product.name}</span>. The AI uses the live UI selectors, so steps will point at real elements.
        </p>
        <label className="mb-3 block text-xs font-medium">
          Learner persona
          <input
            value={persona}
            onChange={(e) => setPersona(e.target.value)}
            className="mt-1 w-full rounded-md bg-secondary px-3 py-2 text-sm ring-1 ring-border focus:outline-none focus:ring-accent"
          />
        </label>
        <label className="mb-3 block text-xs font-medium">
          Goal
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            rows={3}
            placeholder="Teach a new user to import a SWMM5 .inp and run a steady-state simulation."
            className="mt-1 w-full rounded-md bg-secondary px-3 py-2 text-sm ring-1 ring-border focus:outline-none focus:ring-accent"
          />
        </label>
        {error && <p className="mb-3 text-xs text-destructive">{error}</p>}
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="rounded-md px-3 py-1.5 text-sm ring-1 ring-border hover:bg-secondary">
            Cancel
          </button>
          <button
            onClick={generate}
            disabled={busy || !goal.trim()}
            className="rounded-md bg-foreground px-3 py-1.5 text-sm text-background hover:opacity-90 disabled:opacity-50"
          >
            {busy ? "Generating…" : "Generate tour"}
          </button>
        </div>
      </div>
    </div>
  );
}
