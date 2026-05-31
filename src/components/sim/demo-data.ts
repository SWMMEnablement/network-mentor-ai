// Demo nodes/links/polygons shared across products so screens feel real
// without needing per-product data.
export const DEMO_NODES = [
  { id: "rg1", x: 60, y: 40, kind: "raingage" as const, label: "RG1" },
  { id: "s1", x: 140, y: 130, kind: "subcatchment" as const, label: "S1" },
  { id: "j1", x: 230, y: 200, kind: "junction" as const, label: "J1" },
  { id: "j2", x: 360, y: 220, kind: "junction" as const, label: "J2" },
  { id: "j3", x: 480, y: 260, kind: "junction" as const, label: "J3" },
  { id: "j4", x: 600, y: 300, kind: "junction" as const, label: "J4" },
  { id: "out1", x: 720, y: 360, kind: "outfall" as const, label: "Out1" },
];

export const DEMO_LINKS = [
  { id: "c1", from: "j1", to: "j2" },
  { id: "c2", from: "j2", to: "j3" },
  { id: "c3", from: "j3", to: "j4" },
  { id: "c4", from: "j4", to: "out1" },
];

export const DEMO_POLYGONS = [
  { id: "p-s1", points: "60,60 220,60 240,180 70,180", label: "S1 — 4.2 ha" },
  { id: "p-s2", points: "260,90 420,110 410,240 270,230", label: "S2 — 6.1 ha" },
  { id: "p-s3", points: "450,160 620,180 610,310 470,310", label: "S3 — 5.7 ha" },
];

export const DEMO_TIMESERIES = Array.from({ length: 60 }, (_, i) => ({
  t: i,
  flow: Math.max(0, Math.sin((i - 8) / 6) * 12 + (i > 10 && i < 40 ? 8 : 0) + Math.random() * 1.2),
  depth: Math.max(0, Math.sin((i - 6) / 7) * 0.6 + (i > 10 && i < 42 ? 0.8 : 0) + Math.random() * 0.1),
}));
