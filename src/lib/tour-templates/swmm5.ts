import type { TourTemplate } from "@/lib/tour-types";

export const SWMM5_TEMPLATES: TourTemplate[] = [
  {
    templateId: "swmm5.first-project",
    productId: "swmm5",
    title: "Your first SWMM 5 project",
    persona: "Student or engineer new to EPA SWMM",
    goal: "Open a sample project, run it, and read the Status Report.",
    category: "getting-started",
    estMinutes: 7,
    learn: [
      "Navigate the SWMM5 project tree",
      "Identify rain gages, subcatchments, junctions, outfalls, conduits",
      "Launch a simulation",
      "Read continuity and warnings in the Status Report",
    ],
    steps: [
      {
        screenId: "project",
        targetSim: "node-raingages",
        title: "Rain Gages",
        body: "Every SWMM model starts with rainfall. **Rain Gages** define the time-series that drives all subcatchments assigned to them.",
        action: "look",
      },
      {
        screenId: "project",
        targetSim: "node-subcatchments",
        title: "Subcatchments",
        body: "Subcatchments convert rainfall to runoff. Each one has an area, slope, imperviousness, and an outlet.",
        action: "look",
      },
      {
        screenId: "project",
        targetSim: "node-conduits",
        title: "Conduits",
        body: "Conduits carry flow between junctions. SWMM solves dynamic-wave routing along them.",
        action: "look",
      },
      {
        screenId: "map",
        targetSim: "map-node-out1",
        title: "Outfall",
        body: "**Outfalls** are the downstream boundary. Their stage can be free, fixed, tidal, or follow a time-series.",
        action: "look",
      },
      {
        screenId: "run",
        targetSim: "run-start",
        title: "Run the simulation",
        body: "Click **Start**. Watch for *continuity errors* in the status panel — they should be small (well under 10%).",
        action: "click",
      },
      {
        screenId: "report",
        targetSim: "results-pane",
        title: "Read the Status Report",
        body: "The Status Report lists run-time warnings, continuity, and peak flows. Always check this before trusting the results.",
        action: "look",
      },
    ],
    help: [
      {
        title: "Continuity error explained",
        body: "Continuity = water in vs water out + change in storage. EPA recommends keeping flow continuity under 10%.",
      },
      {
        title: "Common warnings",
        body: "*Node flooded*, *negative depth*, and *iterations exceeded* usually signal a too-large time step or an undersized pipe.",
      },
    ],
    glossary: [
      { term: "Rain Gage", definition: "Time-series of rainfall intensity feeding subcatchments." },
      { term: "Junction", definition: "Manhole or node connecting conduits." },
      { term: "Outfall", definition: "Downstream boundary node of a SWMM network." },
      { term: "Continuity error", definition: "Mass-balance error (%) reported after a run." },
    ],
  },
  {
    templateId: "swmm5.read-status-report",
    productId: "swmm5",
    title: "Interpreting the SWMM 5 Status Report",
    persona: "Modeller QA-ing a completed run",
    goal: "Spot continuity errors, warnings, and node flooding.",
    category: "reporting",
    estMinutes: 4,
    learn: [
      "Find the continuity line",
      "Read node flooding summary",
      "Decide if the run is trustworthy",
    ],
    steps: [
      {
        screenId: "report",
        targetSim: "results-pane",
        title: "Status Report overview",
        body: "The report is plain-text. Scroll to **Flow Routing Continuity** — anything above ~10% usually means you should reduce the time step.",
        action: "look",
      },
    ],
    help: [],
    glossary: [
      { term: "Node flooding", definition: "Volume that surcharged out of a junction during the run." },
    ],
  },
];
