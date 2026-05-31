import type { TourTemplate } from "@/lib/tour-types";

export const INFODRAINAGE_TEMPLATES: TourTemplate[] = [
  {
    templateId: "infodrainage.suds-scheme",
    productId: "infodrainage",
    title: "Design a SuDS scheme",
    persona: "Drainage designer producing a planning submission",
    goal: "Sketch a site, add stormwater controls, run analysis, and produce a compliance report.",
    category: "getting-started",
    estMinutes: 10,
    learn: [
      "Lay out a site plan",
      "Pick stormwater controls from the library",
      "Run the design analysis",
      "Generate a compliance-ready report",
    ],
    steps: [
      {
        screenId: "site",
        targetSim: "docpane-site",
        title: "Start with the site plan",
        body: "The **Site Plan** is your canvas. Drop in the catchment boundary, then add stormwater controls along the drainage path.",
        action: "look",
      },
      {
        screenId: "controls",
        targetSim: "tool-pond",
        title: "Add a detention pond",
        body: "**Ponds** attenuate peak flows. Click **Pond**, then place it on the site plan. Properties capture invert level, volume curve, and outlet.",
        action: "click",
      },
      {
        screenId: "controls",
        targetSim: "tool-permeable",
        title: "Add permeable paving",
        body: "Permeable pavements provide infiltration + storage. InfoDrainage models the sub-base voids and underdrain.",
        action: "click",
      },
      {
        screenId: "analysis",
        targetSim: "run-start",
        title: "Run the analysis",
        body: "Click **Start**. InfoDrainage runs hydrology + hydraulics against the chosen design storms (e.g. 1-in-30, 1-in-100).",
        action: "click",
      },
      {
        screenId: "compliance",
        targetSim: "results-pane",
        title: "Compliance report",
        body: "The compliance report compares post-development to greenfield runoff and flags any control that fails. Export to PDF for submission.",
        action: "look",
      },
    ],
    help: [
      {
        title: "What is SuDS?",
        body: "Sustainable Drainage Systems mimic natural drainage to manage surface water close to source — ponds, swales, permeable surfaces, green roofs.",
      },
      {
        title: "Greenfield runoff",
        body: "The runoff rate from the site before development. UK planning typically requires post-development peaks ≤ greenfield for relevant storm events.",
      },
    ],
    glossary: [
      { term: "SuDS", definition: "Sustainable Drainage Systems." },
      { term: "Attenuation", definition: "Reducing peak flow rate by temporarily storing water." },
      { term: "Greenfield runoff", definition: "Pre-development surface water runoff rate." },
    ],
  },
];
