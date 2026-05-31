import { DEMO_TIMESERIES } from "./demo-data";

export function ResultsPane() {
  const data = DEMO_TIMESERIES;
  const maxFlow = Math.max(...data.map((d) => d.flow));
  const pts = data
    .map((d, i) => `${(i / (data.length - 1)) * 600},${110 - (d.flow / maxFlow) * 95}`)
    .join(" ");
  return (
    <div
      className="flex h-full flex-col"
      style={{ background: "var(--p-canvas)" }}
      data-sim="results-pane"
    >
      <div
        className="flex items-center gap-3 px-3 py-1.5 text-[11px]"
        style={{ borderBottom: "1px solid var(--p-line)", color: "var(--p-ink-soft)" }}
      >
        <span className="font-semibold">Time-Series</span>
        <span>Flow at J3 conduit C2 · m³/s</span>
      </div>
      <div className="flex-1 p-3">
        <svg viewBox="0 0 620 130" className="h-full w-full">
          <defs>
            <pattern id="gp" width="40" height="20" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#dde2e7" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="620" height="130" fill="url(#gp)" />
          <polyline points={pts} fill="none" stroke="var(--p-accent)" strokeWidth="1.5" />
          <text x="6" y="14" fontSize="9" fill="var(--p-ink-soft)">
            peak {maxFlow.toFixed(2)}
          </text>
        </svg>
      </div>
    </div>
  );
}
