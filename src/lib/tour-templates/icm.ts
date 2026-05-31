import type { TourTemplate } from "@/lib/tour-types";

export const ICM_TEMPLATES: TourTemplate[] = [
  {
    templateId: "icm.first-model",
    productId: "icm",
    title: "Your first ICM model in 10 minutes",
    persona: "Civil engineer new to InfoWorks ICM",
    goal: "Open a project, inspect the network, run the engine, and read results.",
    category: "getting-started",
    estMinutes: 10,
    learn: [
      "Navigate the Master Database and Model Group",
      "Open a Network and review the 2D mesh",
      "Configure and launch a hydraulic run",
      "Read flow and depth results in the browser",
    ],
    steps: [
      {
        screenId: "start",
        targetSim: "docpane-start",
        title: "Welcome to InfoWorks ICM",
        body: "The **Start Page** lists recent projects and sample datasets. ICM organises everything inside a *Master Database*, which contains *Model Groups*, *Networks*, *Rainfall Events* and *Simulation Runs*.",
        action: "look",
      },
      {
        screenId: "master-db",
        targetSim: "node-model-group",
        title: "Open the Model Group",
        body: "Expand **Demo Model Group**. Model Groups are folders that bundle the networks, rainfall, and runs for a single project.",
        action: "click",
      },
      {
        screenId: "master-db",
        targetSim: "node-networks",
        title: "Pick a Network",
        body: "Networks contain nodes, links, subcatchments and (optionally) a 2D mesh. Double-click a Network to open the map.",
        action: "click",
      },
      {
        screenId: "network",
        targetSim: "tool-mesh-2d",
        title: "Generate or inspect the 2D mesh",
        body: "**Generate Mesh** triangulates the 2D zone so surface flooding can be simulated alongside the 1D pipe network.",
        action: "look",
      },
      {
        screenId: "run",
        targetSim: "run-dialog",
        title: "Configure the simulation",
        body: "Pick the **duration**, **time step**, and the **design storm**. Keep defaults for your first run.",
        action: "look",
      },
      {
        screenId: "run",
        targetSim: "run-start",
        title: "Start the run",
        body: "Click **Start**. ICM solves 1D + 2D coupled flow. Watch the status panel — continuity should stay above 99%.",
        action: "click",
      },
      {
        screenId: "results",
        targetSim: "results-pane",
        title: "Read the results",
        body: "The **Results Browser** plots time-series for any selected node or link. Toggle *flow* / *depth* to compare hydrology vs hydraulics.",
        action: "look",
      },
    ],
    help: [
      {
        title: "What is a Master Database?",
        body: "A Master Database is a SQL-backed container for every modelling artefact in a project. It enables versioning and multi-user editing.",
      },
      {
        title: "Continuity error explained",
        body: "Continuity is how well water in equals water out + storage change. Below 95% usually indicates a model stability problem.",
      },
    ],
    glossary: [
      { term: "Master Database", definition: "Top-level container for ICM model data." },
      { term: "Model Group", definition: "A bundle of networks, rainfall events, and runs for one project." },
      { term: "2D mesh", definition: "Triangulated surface used to simulate overland flooding." },
    ],
  },
  {
    templateId: "icm.read-2d-results",
    productId: "icm",
    title: "Reading 2D mesh flood results",
    persona: "Flood modeller reviewing a completed run",
    goal: "Interpret depth and velocity layers on the 2D mesh.",
    category: "analysis",
    estMinutes: 5,
    learn: [
      "Switch between depth and velocity layers",
      "Read flood hazard from velocity × depth",
      "Inspect node and link time-series",
    ],
    steps: [
      {
        screenId: "network",
        targetSim: "map-node-j3",
        title: "Pick a node of interest",
        body: "Click a node on the map. The Properties grid on the right updates with its attributes.",
        action: "click",
      },
      {
        screenId: "results",
        targetSim: "results-pane",
        title: "Read the time-series",
        body: "The plot shows the selected element's flow and depth over time. Use this to compare scenarios.",
        action: "look",
      },
    ],
    help: [
      {
        title: "Flood hazard rating",
        body: "Hazard is commonly velocity × depth (m²/s). >1.0 is generally dangerous for adults.",
      },
    ],
    glossary: [
      { term: "Hazard rating", definition: "Combined velocity × depth metric for flood risk." },
    ],
  },
];
