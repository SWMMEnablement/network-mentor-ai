// Product registry — the source of truth for the 5 simulated apps.
// Each product lists the screens that exist in v1, the order they appear in
// the project explorer / ribbon, and the human-readable label.

export type ProductId =
  | "icm"
  | "icm-swmm"
  | "swmm5"
  | "swmm6"
  | "infodrainage"
  | "civil3d";

export interface ProductScreen {
  id: string;
  label: string;
}

export interface ProductDef {
  id: ProductId;
  name: string;
  vendor: string;
  tagline: string;
  defaultScreen: string;
  screens: ProductScreen[];
}

export const PRODUCTS: ProductDef[] = [
  {
    id: "icm",
    name: "InfoWorks ICM",
    vendor: "Autodesk / Innovyze",
    tagline: "Integrated catchment modelling for urban drainage and rivers.",
    defaultScreen: "start",
    screens: [
      { id: "start", label: "Start Page" },
      { id: "master-db", label: "Master Database" },
      { id: "network", label: "Network + 2D Mesh" },
      { id: "run", label: "Run Simulation" },
      { id: "results", label: "Results Browser" },
    ],
  },
  {
    id: "icm-swmm",
    name: "ICM SWMM Networks",
    vendor: "Autodesk / Innovyze",
    tagline: "SWMM-engine networks inside the ICM workspace.",
    defaultScreen: "explorer",
    screens: [
      { id: "explorer", label: "Network Explorer" },
      { id: "map", label: "Subcatchment Map" },
      { id: "run", label: "SWMM Run Setup" },
      { id: "results", label: "Time-Series Results" },
    ],
  },
  {
    id: "swmm5",
    name: "EPA SWMM 5",
    vendor: "US EPA",
    tagline: "The classic hydrology + hydraulics model. Free, open-source.",
    defaultScreen: "project",
    screens: [
      { id: "project", label: "Project Tree" },
      { id: "map", label: "Study Area Map" },
      { id: "run", label: "Run Status" },
      { id: "report", label: "Status Report" },
    ],
  },
  {
    id: "swmm6",
    name: "EPA SWMM 6 (HydroCouple)",
    vendor: "HydroCouple / US EPA",
    tagline: "Next-gen SWMM built on the HydroCouple component-coupling framework.",
    defaultScreen: "components",
    screens: [
      { id: "components", label: "Components" },
      { id: "workflow", label: "Coupling Graph" },
      { id: "network", label: "Network Editor" },
      { id: "run", label: "Run Simulation" },
      { id: "results", label: "Results" },
    ],
  },
  {
    id: "infodrainage",
    name: "InfoDrainage",
    vendor: "Autodesk",
    tagline: "SuDS and stormwater design with built-in compliance reporting.",
    defaultScreen: "site",
    screens: [
      { id: "site", label: "Site Plan" },
      { id: "controls", label: "Stormwater Controls" },
      { id: "analysis", label: "Analysis" },
      { id: "compliance", label: "Compliance Report" },
    ],
  },
  {
    id: "civil3d",
    name: "Civil 3D — Drainage",
    vendor: "Autodesk",
    tagline: "Pipe network drainage analysis inside Civil 3D.",
    defaultScreen: "drawing",
    screens: [
      { id: "drawing", label: "Drawing Area" },
      { id: "toolspace", label: "Toolspace" },
      { id: "parts", label: "Parts List" },
      { id: "analyze", label: "Analyze Drainage" },
    ],
  },
];

export const productById = (id: string): ProductDef | undefined =>
  PRODUCTS.find((p) => p.id === id);
