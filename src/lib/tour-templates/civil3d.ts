import type { TourTemplate } from "@/lib/tour-types";

export const CIVIL3D_TEMPLATES: TourTemplate[] = [
  {
    templateId: "civil3d.pipe-network-analysis",
    productId: "civil3d",
    title: "Pipe network drainage analysis",
    persona: "Civil 3D user analysing a stormwater network",
    goal: "Build a parts list, draw a pipe network, and run drainage analysis.",
    category: "getting-started",
    estMinutes: 9,
    learn: [
      "Navigate Toolspace > Prospector",
      "Pick parts from the Parts List",
      "Draw pipes and structures",
      "Launch the drainage analysis",
    ],
    steps: [
      {
        screenId: "drawing",
        targetSim: "map-node-j1",
        title: "Start in the drawing area",
        body: "Civil 3D works on a DWG drawing. Pipe networks are 3D objects that snap to your alignment and surface.",
        action: "look",
      },
      {
        screenId: "toolspace",
        targetSim: "node-pipe-networks",
        title: "Open Toolspace > Prospector",
        body: "Expand **Pipe Networks** in the Prospector tree to see every network in the drawing.",
        action: "click",
      },
      {
        screenId: "parts",
        targetSim: "docpane-parts",
        title: "Pick a Parts List",
        body: "The **Parts List** defines which pipe and structure types are available. Match it to your standards before drawing.",
        action: "look",
      },
      {
        screenId: "drawing",
        targetSim: "tool-draw-pipe",
        title: "Draw a pipe",
        body: "Use **Draw Pipe** to lay pipes between structures. Civil 3D auto-creates manholes at the ends.",
        action: "click",
      },
      {
        screenId: "analyze",
        targetSim: "run-start",
        title: "Analyze drainage",
        body: "Hit **Analyze**. Civil 3D uses the InfoDrainage engine to size pipes and check HGL against ground.",
        action: "click",
      },
    ],
    help: [
      {
        title: "Parts Lists explained",
        body: "A Parts List is a curated subset of the Parts Catalog. Keep it small to keep your model manageable.",
      },
      {
        title: "HGL vs EGL",
        body: "Hydraulic Grade Line = piezometric head; Energy Grade Line adds velocity head. Civil 3D plots both in the profile view.",
      },
    ],
    glossary: [
      { term: "Pipe Network", definition: "3D Civil 3D object containing pipes and structures." },
      { term: "Structure", definition: "A manhole, catch basin, or junction box in a pipe network." },
      { term: "HGL", definition: "Hydraulic Grade Line — water-surface elevation in pressurised pipes." },
    ],
  },
];
