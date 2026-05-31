interface Node { id: string; x: number; y: number; kind: "junction" | "outfall" | "raingage" | "subcatchment"; label: string }
interface Link { id: string; from: string; to: string; kind?: "conduit" | "pipe" }

interface Props {
  nodes: Node[];
  links: Link[];
  /** Overlay shapes for subcatchment polygons */
  polygons?: { id: string; points: string; label?: string }[];
  /** Background style — `paper` for SWMM, `dark` for Civil 3D, `map` for ICM */
  surface?: "paper" | "dark" | "map";
}

const KIND_COLORS: Record<Node["kind"], string> = {
  junction: "#1f6feb",
  outfall: "#b80c19",
  raingage: "#2ecc71",
  subcatchment: "#888",
};

export function MapCanvas({ nodes, links, polygons = [], surface = "paper" }: Props) {
  const bg =
    surface === "dark"
      ? "var(--p-canvas)"
      : surface === "map"
        ? "linear-gradient(180deg, #f9fbfd 0%, #eaf1f9 100%)"
        : "var(--p-canvas)";

  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: bg }}>
      <svg viewBox="0 0 800 500" className="h-full w-full" preserveAspectRatio="xMidYMid meet">
        {/* grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path
              d="M 40 0 L 0 0 0 40"
              fill="none"
              stroke={surface === "dark" ? "#3a3d40" : "#dde2e7"}
              strokeWidth="0.5"
            />
          </pattern>
        </defs>
        <rect width="800" height="500" fill="url(#grid)" />

        {polygons.map((p) => (
          <g key={p.id} data-sim={`poly-${p.id}`}>
            <polygon
              points={p.points}
              fill={surface === "dark" ? "#2d4858" : "#cfe6f5"}
              fillOpacity={0.55}
              stroke={surface === "dark" ? "#5a8ea8" : "#5a8ea8"}
              strokeWidth={1.2}
            />
            {p.label && (
              <text
                x={Number(p.points.split(" ")[0].split(",")[0]) + 10}
                y={Number(p.points.split(" ")[0].split(",")[1]) + 18}
                fontSize="10"
                fill={surface === "dark" ? "#cfe6f5" : "#1c3d50"}
              >
                {p.label}
              </text>
            )}
          </g>
        ))}

        {links.map((l) => {
          const a = nodes.find((n) => n.id === l.from);
          const b = nodes.find((n) => n.id === l.to);
          if (!a || !b) return null;
          return (
            <line
              key={l.id}
              data-sim={`link-${l.id}`}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={surface === "dark" ? "#7ecbe6" : "#1f6feb"}
              strokeWidth={2}
            />
          );
        })}

        {nodes.map((n) => (
          <g key={n.id} data-sim={`map-node-${n.id}`}>
            {n.kind === "raingage" ? (
              <rect x={n.x - 5} y={n.y - 5} width={10} height={10} fill={KIND_COLORS[n.kind]} />
            ) : n.kind === "outfall" ? (
              <polygon
                points={`${n.x - 6},${n.y + 5} ${n.x + 6},${n.y + 5} ${n.x},${n.y - 6}`}
                fill={KIND_COLORS[n.kind]}
              />
            ) : (
              <circle cx={n.x} cy={n.y} r={5} fill={KIND_COLORS[n.kind]} />
            )}
            <text
              x={n.x + 8}
              y={n.y - 6}
              fontSize="10"
              fill={surface === "dark" ? "#cfd6dd" : "#202830"}
            >
              {n.label}
            </text>
          </g>
        ))}
      </svg>

      <div
        className="pointer-events-none absolute bottom-2 right-3 font-mono text-[10px]"
        style={{ color: "var(--p-ink-soft)" }}
      >
        EPSG:27700 · 1:5,000
      </div>
    </div>
  );
}
