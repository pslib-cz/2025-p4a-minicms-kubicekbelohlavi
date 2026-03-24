import { ArticleStatus } from "@prisma/client";
import { z } from "zod";

const imageSchema = z
  .string()
  .trim()
  .url("Cover obrázek musí mít platnou URL adresu.")
  .optional()
  .or(z.literal(""));

export const articleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Titulek musí mít alespoň 3 znaky.")
    .max(120, "Titulek může mít maximálně 120 znaků."),
  slug: z
    .string()
    .trim()
    .max(140, "Slug může mít maximálně 140 znaků.")
    .optional()
    .or(z.literal("")),
  excerpt: z
    .string()
    .trim()
    .max(220, "Perex může mít maximálně 220 znaků.")
    .optional()
    .or(z.literal("")),
  content: z
    .string()
    .trim()
    .min(20, "Obsah článku je příliš krátký."),
  coverImage: imageSchema,
  categoryId: z.string().trim().min(1, "Rubrika je povinná."),
  tagIds: z
    .array(z.string().trim())
    .max(10, "Můžete vybrat maximálně 10 štítků."),
  status: z.nativeEnum(ArticleStatus),
  publishDate: z.string().trim().min(1, "Datum vydání je povinné."),
});

export type ArticleInput = z.infer<typeof articleSchema>;
