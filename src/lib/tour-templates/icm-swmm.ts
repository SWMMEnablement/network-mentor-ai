import type { TourTemplate } from "@/lib/tour-types";

export const ICM_SWMM_TEMPLATES: TourTemplate[] = [
  {
    templateId: "icm-swmm.build-network",
    productId: "icm-swmm",
    title: "Build a SWMM network in ICM",
    persona: "Stormwater engineer migrating from EPA SWMM",
    goal: "Sketch a subcatchment + conduit network and run the SWMM engine.",
    category: "getting-started",
    estMinutes: 8,
    learn: [
      "Find the SWMM-style explorer inside ICM",
      "Add subcatchments and conduits from the toolbar",
      "Set up and launch a SWMM run",
      "Plot time-series results",
    ],
    steps: [
      {
        screenId: "explorer",
        targetSim: "node-subcatchments",
        title: "The SWMM explorer",
        body: "ICM exposes the SWMM data model — *subcatchments*, *junctions*, *conduits*, *raingages* — inside its usual tree.",
        action: "look",
      },
      {
        screenId: "map",
        targetSim: "tool-subcatchment",
        title: "Add a subcatchment",
        body: "Click **Subcatchment** then drag a polygon on the map. Subcatchments convert rainfall to runoff using the SWMM hydrology model.",
        action: "click",
      },
      {
        screenId: "map",
        targetSim: "tool-conduit",
        title: "Connect with a conduit",
        body: "Use **Conduit** to draw a pipe between two junctions. Set diameter and Manning's n in Properties.",
        action: "click",
      },
      {
        screenId: "run",
        targetSim: "run-start",
        title: "Run the SWMM engine",
        body: "Hit **Start**. The SWMM engine is faster than ICM's full 1D-2D solver — great for option testing.",
        action: "click",
      },
      {
        screenId: "results",
        targetSim: "results-pane",
        title: "Inspect time-series",
        body: "Flow at each conduit and depth at each node are plotted. Compare to your design storm peak.",
        action: "look",
      },
    ],
    help: [
      {
        title: "SWMM vs ICM engine",
        body: "SWMM in ICM uses the EPA SWMM5 dynamic wave solver. It's 1D only; for surface flooding use ICM's native 1D-2D engine.",
      },
    ],
    glossary: [
      { term: "Subcatchment", definition: "Land area that drains to a single outlet node." },
      { term: "Conduit", definition: "A SWMM link representing a pipe or channel." },
      { term: "Manning's n", definition: "Surface roughness coefficient used in flow equations." },
    ],
  },
];
