import { ArticleStatus } from "@prisma/client";
import { z } from "zod";

const imageSchema = z
  .string()
  .trim()
  .url("Cover image must be a valid URL")
  .optional()
  .or(z.literal(""));

export const articleSchema = z.object({
  title: z.string().trim().min(3).max(120),
  slug: z.string().trim().max(140).optional().or(z.literal("")),
  excerpt: z.string().trim().max(220).optional().or(z.literal("")),
  content: z.string().trim().min(20, "Article content is too short"),
  coverImage: imageSchema,
  categoryId: z.string().trim().min(1, "Category is required"),
  tagIds: z.array(z.string().trim()).max(10),
  status: z.nativeEnum(ArticleStatus),
  publishDate: z.string().trim().min(1, "Publish date is required"),
});

export type ArticleInput = z.infer<typeof articleSchema>;
