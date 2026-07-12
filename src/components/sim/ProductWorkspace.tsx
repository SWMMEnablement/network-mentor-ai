import { useState } from "react";
import { WorkspaceFrame } from "./WorkspaceFrame";
import { Ribbon } from "./Ribbon";
import { ModelTree } from "./ModelTree";
import { MapCanvas } from "./MapCanvas";
import { PropertiesGrid } from "./PropertiesGrid";
import { ResultsPane } from "./ResultsPane";
import { StatusBar } from "./StatusBar";
import { DEMO_LINKS, DEMO_NODES, DEMO_POLYGONS } from "./demo-data";
import { productById, type ProductId } from "@/lib/products";

interface Props {
  productId: ProductId;
  screenId: string;
  onScreenChange?: (id: string) => void;
}

// Switchboard that picks the right workspace shape per product.
export function ProductWorkspace({ productId, screenId, onScreenChange }: Props) {
  const product = productById(productId);
  if (!product) return null;

  return (
    <WorkspaceFrame productId={productId}>
      <div className="flex h-full flex-col">
        <Chrome productId={productId} screenId={screenId} onScreenChange={onScreenChange} />
        <div className="flex flex-1 overflow-hidden">{renderScreen(productId, screenId)}</div>
        <StatusBar />
      </div>
    </WorkspaceFrame>
  );
}

function Chrome({
  productId,
  screenId,
  onScreenChange,
}: {
  productId: ProductId;
  screenId: string;
  onScreenChange?: (id: string) => void;
}) {
  const product = productById(productId)!;
  const tabs = product.screens.map((s) => ({ id: s.id, label: s.label }));

  if (productId === "swmm5") {
    return (
      <Ribbon
        variant="menubar"
        appTitle="EPA SWMM 5.2 — example1.inp"
        tabs={[
          { id: "file", label: "File" },
          { id: "edit", label: "Edit" },
          { id: "view", label: "View" },
          { id: "project", label: "Project" },
          { id: "report", label: "Report" },
          { id: "tools", label: "Tools" },
          { id: "help", label: "Help" },
        ]}
        buttons={[
          { id: "new", label: "New" },
          { id: "open", label: "Open" },
          { id: "save", label: "Save" },
          { id: "run", label: "Run Simulation", primary: true },
          { id: "report", label: "Report" },
        ]}
      />
    );
  }

  const buttonsByProduct: Record<ProductId, { id: string; label: string; primary?: boolean }[]> = {
    icm: [
      { id: "new-network", label: "New Network" },
      { id: "import", label: "Import GIS" },
      { id: "mesh-2d", label: "Generate Mesh" },
      { id: "validate", label: "Validate" },
      { id: "run", label: "Run", primary: true },
      { id: "results", label: "Results" },
    ],
    "icm-swmm": [
      { id: "new-network", label: "New SWMM Net" },
      { id: "subcatchment", label: "Subcatchment" },
      { id: "conduit", label: "Conduit" },
      { id: "raingage", label: "Rain Gauge" },
      { id: "run", label: "Run SWMM", primary: true },
    ],
    swmm5: [],
    swmm6: [
      { id: "add-component", label: "Add Component" },
      { id: "connect", label: "Couple Ports" },
      { id: "validate", label: "Validate Graph" },
      { id: "run", label: "Run", primary: true },
      { id: "results", label: "Results" },
    ],
    infodrainage: [
      { id: "new-site", label: "New Site" },
      { id: "pond", label: "Pond" },
      { id: "swale", label: "Swale" },
      { id: "permeable", label: "Permeable" },
      { id: "analyze", label: "Analyze", primary: true },
      { id: "report", label: "Compliance" },
    ],
    civil3d: [
      { id: "create-network", label: "Create Pipe Network" },
      { id: "parts-list", label: "Parts List" },
      { id: "draw-pipe", label: "Draw Pipe" },
      { id: "draw-structure", label: "Structure" },
      { id: "analyze", label: "Analyze Drainage", primary: true },
    ],
  };

  return (
    <Ribbon
      appTitle={`${product.name} — demo-project`}
      tabs={tabs}
      activeTab={screenId}
      onTabChange={onScreenChange}
      buttons={buttonsByProduct[productId]}
    />
  );
}

function renderScreen(productId: ProductId, screenId: string) {
  // Most products share the tree+map+properties shape — we vary the tree
  // contents and the centre pane's content based on screen.
  const tree = treeForProduct(productId);
  const props = propsForScreen(screenId);

  return (
    <>
      <ModelTree title="Project Explorer" nodes={tree} />
      <div className="flex flex-1 flex-col overflow-hidden">
        {renderCenter(productId, screenId)}
      </div>
      <PropertiesGrid title="Properties" rows={props} />
    </>
  );
}

function renderCenter(productId: ProductId, screenId: string) {
  if (screenId.includes("results") || screenId.includes("report") || screenId === "compliance") {
    return <ResultsPane />;
  }
  if (screenId === "run" || screenId === "analysis" || screenId === "analyze") {
    return <RunPane productId={productId} />;
  }
  if (screenId === "workflow") {
    return <CouplingGraphPane />;
  }
  if (screenId === "start" || screenId === "toolspace" || screenId === "parts" || screenId === "components") {
    return <DocPane productId={productId} screenId={screenId} />;
  }
  // Default: map
  const surface = productId === "civil3d" ? "dark" : productId === "icm" || productId === "icm-swmm" || productId === "swmm6" ? "map" : "paper";
  return (
    <MapCanvas
      nodes={DEMO_NODES}
      links={DEMO_LINKS}
      polygons={DEMO_POLYGONS}
      surface={surface as "dark" | "paper" | "map"}
    />
  );
}

function CouplingGraphPane() {
  const comps = [
    { id: "rain", label: "Rainfall", x: 40, y: 60, color: "#38bdf8" },
    { id: "runoff", label: "Runoff", x: 220, y: 40, color: "#22d3ee" },
    { id: "routing", label: "1D Routing", x: 400, y: 90, color: "#14b8a6" },
    { id: "quality", label: "Water Quality", x: 220, y: 190, color: "#a78bfa" },
    { id: "outfall", label: "Receiving Water", x: 580, y: 160, color: "#f472b6" },
  ];
  const edges = [
    ["rain", "runoff"], ["runoff", "routing"], ["runoff", "quality"],
    ["routing", "outfall"], ["quality", "outfall"],
  ];
  const byId = Object.fromEntries(comps.map((c) => [c.id, c]));
  return (
    <div className="h-full w-full overflow-auto p-6" style={{ background: "var(--p-canvas)" }} data-sim="coupling-graph">
      <div className="mb-4 text-xs" style={{ color: "var(--p-ink-soft)" }}>
        Component coupling graph · drag ports to wire outputs → inputs
      </div>
      <svg width="720" height="280" className="rounded-md" style={{ background: "var(--p-tree)", border: "1px solid var(--p-line)" }}>
        {edges.map(([a, b]) => {
          const A = byId[a]; const B = byId[b];
          return (
            <line key={`${a}-${b}`} x1={A.x + 120} y1={A.y + 24} x2={B.x} y2={B.y + 24}
              stroke="var(--p-accent)" strokeWidth={1.5} strokeDasharray="4 3" />
          );
        })}
        {comps.map((c) => (
          <g key={c.id} data-sim={`component-${c.id}`}>
            <rect x={c.x} y={c.y} width={120} height={48} rx={6}
              fill="var(--p-canvas)" stroke={c.color} strokeWidth={1.5} />
            <circle cx={c.x} cy={c.y + 24} r={4} fill={c.color} />
            <circle cx={c.x + 120} cy={c.y + 24} r={4} fill={c.color} />
            <text x={c.x + 60} y={c.y + 29} textAnchor="middle" fontSize={12}
              fill="var(--p-ink)" fontFamily="var(--font-sans)">{c.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

function RunPane({ productId }: { productId: string }) {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <div className="flex h-full items-center justify-center p-8" style={{ background: "var(--p-canvas)" }}>
      <div
        className="w-[440px] rounded-md p-5"
        style={{ background: "var(--p-tree)", border: "1px solid var(--p-line)" }}
        data-sim="run-dialog"
      >
        <h3 className="mb-1 text-sm font-semibold" style={{ color: "var(--p-ink)" }}>
          Run simulation
        </h3>
        <p className="mb-4 text-xs" style={{ color: "var(--p-ink-soft)" }}>
          {productId === "infodrainage"
            ? "Run the analysis against the selected design storm."
            : productId === "civil3d"
              ? "Analyze drainage for the selected pipe network."
              : "Run the hydraulic engine using the current run parameters."}
        </p>
        <div className="space-y-2 text-xs">
          {[
            ["Duration", "24:00:00"],
            ["Time step", "00:01:00"],
            ["Design storm", "1-in-30 yr"],
          ].map(([k, v]) => (
            <div key={k} className="flex items-center justify-between">
              <span style={{ color: "var(--p-ink-soft)" }}>{k}</span>
              <span className="font-mono">{v}</span>
            </div>
          ))}
        </div>
        <button
          data-sim="run-start"
          onClick={() => {
            setRunning(true);
            setTimeout(() => {
              setRunning(false);
              setDone(true);
            }, 1400);
          }}
          className="mt-5 w-full rounded-sm py-1.5 text-xs font-medium"
          style={{ background: "var(--p-accent)", color: "white" }}
        >
          {running ? "Running…" : done ? "Re-run" : "Start"}
        </button>
        {done && (
          <p className="mt-3 text-[11px]" style={{ color: "var(--p-ink-soft)" }}>
            Completed in 1.4s · 0 errors · 2 warnings · Continuity 99.6%
          </p>
        )}
      </div>
    </div>
  );
}

function DocPane({ productId, screenId }: { productId: string; screenId: string }) {
  return (
    <div className="flex h-full items-stretch overflow-auto p-6" style={{ background: "var(--p-canvas)" }}>
      <div
        className="grid w-full grid-cols-2 gap-3"
        data-sim={`docpane-${screenId}`}
        style={{ color: "var(--p-ink)" }}
      >
        {["Recent projects", "What's new", "Sample datasets", "Documentation"].map((t) => (
          <div
            key={t}
            className="rounded-sm p-4 text-xs"
            style={{ background: "var(--p-tree)", border: "1px solid var(--p-line)" }}
          >
            <div className="mb-2 font-semibold">{t}</div>
            <div className="opacity-70">
              {productId === "icm"
                ? "Open the Master Database and pick a Model Group to begin."
                : "Click a tile to load a sample project."}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function treeForProduct(productId: string) {
  if (productId === "swmm5") {
    return [
      {
        id: "project",
        label: "Project",
        children: [
          { id: "title-notes", label: "Title/Notes" },
          { id: "options", label: "Options" },
          { id: "climatology", label: "Climatology" },
          {
            id: "hydrology",
            label: "Hydrology",
            children: [
              { id: "raingages", label: "Rain Gages", count: 1 },
              { id: "subcatchments", label: "Subcatchments", count: 3 },
              { id: "aquifers", label: "Aquifers", count: 0 },
            ],
          },
          {
            id: "hydraulics",
            label: "Hydraulics",
            children: [
              { id: "junctions", label: "Junctions", count: 4 },
              { id: "outfalls", label: "Outfalls", count: 1 },
              { id: "conduits", label: "Conduits", count: 4 },
            ],
          },
        ],
      },
    ];
  }
  if (productId === "swmm6") {
    return [
      { id: "components", label: "Components", children: [
        { id: "comp-rainfall", label: "Rainfall (SWMM6)", count: 1 },
        { id: "comp-runoff", label: "Runoff (SWMM6)", count: 1 },
        { id: "comp-routing", label: "1D Routing (SWMM6)", count: 1 },
        { id: "comp-quality", label: "Water Quality", count: 1 },
        { id: "comp-receiving", label: "Receiving Water (EFDC)", count: 1 },
      ]},
      { id: "couplings", label: "Couplings", count: 5 },
      { id: "scenarios", label: "Scenarios", count: 2 },
      { id: "outputs", label: "Output Exchange Items", count: 8 },
    ];
  }
  if (productId === "civil3d") {
    return [
      { id: "prospector", label: "Prospector", children: [
        { id: "alignments", label: "Alignments", count: 2 },
        { id: "pipe-networks", label: "Pipe Networks", count: 1 },
        { id: "surfaces", label: "Surfaces", count: 1 },
      ]},
      { id: "settings", label: "Settings" },
      { id: "survey", label: "Survey" },
    ];
  }
  if (productId === "infodrainage") {
    return [
      { id: "site", label: "Site", children: [
        { id: "catchments", label: "Catchments", count: 3 },
        { id: "controls", label: "Stormwater Controls", count: 5 },
        { id: "networks", label: "Networks", count: 1 },
      ]},
      { id: "criteria", label: "Design Criteria" },
      { id: "rainfall", label: "Rainfall" },
    ];
  }
  // ICM / ICM SWMM
  return [
    { id: "master-db", label: "Master DB" },
    { id: "model-group", label: "Demo Model Group", children: [
      { id: "networks", label: "Networks", count: 1 },
      { id: "subcatchments", label: "Subcatchment Groups", count: 3 },
      { id: "rainfall-events", label: "Rainfall Events", count: 4 },
      { id: "runs", label: "Sim Runs", count: 2 },
    ]},
  ];
}

function propsForScreen(_screenId: string) {
  return [
    { label: "ID", value: "J3" },
    { label: "Invert level", value: "23.40", unit: "mAOD" },
    { label: "Ground level", value: "26.10", unit: "mAOD" },
    { label: "Chamber dia.", value: "1.20", unit: "m" },
    { label: "Inflow", value: "0.00", unit: "L/s" },
    { label: "Connections", value: "3" },
  ];
}
