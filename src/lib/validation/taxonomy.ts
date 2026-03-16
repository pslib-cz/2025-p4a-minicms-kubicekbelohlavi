import { z } from "zod";

export const taxonomySchema = z.object({
  name: z.string().trim().min(2).max(40),
  slug: z.string().trim().max(60).optional().or(z.literal("")),
});

export type TaxonomyInput = z.infer<typeof taxonomySchema>;
