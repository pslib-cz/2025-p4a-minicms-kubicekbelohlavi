import { z } from "zod";

export const taxonomySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Název musí mít alespoň 2 znaky.")
    .max(40, "Název může mít maximálně 40 znaků."),
  slug: z
    .string()
    .trim()
    .max(60, "Slug může mít maximálně 60 znaků.")
    .optional()
    .or(z.literal("")),
});

export type TaxonomyInput = z.infer<typeof taxonomySchema>;
