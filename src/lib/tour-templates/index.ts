import type { ProductId } from "@/lib/products";
import type { TourTemplate } from "@/lib/tour-types";
import { ICM_TEMPLATES } from "./icm";
import { ICM_SWMM_TEMPLATES } from "./icm-swmm";
import { SWMM5_TEMPLATES } from "./swmm5";
import { INFODRAINAGE_TEMPLATES } from "./infodrainage";
import { CIVIL3D_TEMPLATES } from "./civil3d";

export const TEMPLATES: TourTemplate[] = [
  ...ICM_TEMPLATES,
  ...ICM_SWMM_TEMPLATES,
  ...SWMM5_TEMPLATES,
  ...INFODRAINAGE_TEMPLATES,
  ...CIVIL3D_TEMPLATES,
];

export const templatesForProduct = (id: ProductId): TourTemplate[] =>
  TEMPLATES.filter((t) => t.productId === id);

export const getTemplate = (templateId: string): TourTemplate | undefined =>
  TEMPLATES.find((t) => t.templateId === templateId);
