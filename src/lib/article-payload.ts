import { ArticleStatus } from "@prisma/client";
import sanitizeHtml from "sanitize-html";
import { prisma } from "@/lib/prisma";
import { buildExcerpt, slugify } from "@/lib/utils";
import { articleSchema, type ArticleInput } from "@/lib/validation/article";

const SANITIZE_OPTIONS: sanitizeHtml.IOptions = {
  allowedTags: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "blockquote",
    "ul",
    "ol",
    "li",
    "h2",
    "h3",
    "h4",
    "a",
    "code",
    "pre",
  ],
  allowedAttributes: {
    a: ["href", "target", "rel"],
  },
  allowedSchemes: ["http", "https", "mailto"],
};

export async function ensureUniqueArticleSlug(source: string, excludeId?: string) {
  const baseSlug = slugify(source) || "article";
  let candidate = baseSlug;
  let counter = 2;

  while (true) {
    const existing = await prisma.article.findFirst({
      where: {
        slug: candidate,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) {
      return candidate;
    }

    candidate = `${baseSlug}-${counter}`;
    counter += 1;
  }
}

export function sanitizeArticleContent(content: string) {
  return sanitizeHtml(content, SANITIZE_OPTIONS);
}

export async function createArticleMutationInput(
  rawInput: unknown,
  userId: string,
  articleId?: string,
) {
  const parsed = articleSchema.safeParse(rawInput);

  if (!parsed.success) {
    return {
      success: false as const,
      issues: parsed.error.flatten(),
    };
  }

  const input = parsed.data;
  const publishDate = new Date(input.publishDate);

  if (Number.isNaN(publishDate.getTime())) {
    return {
      success: false as const,
      issues: { fieldErrors: { publishDate: ["Datum vydání je neplatné."] } },
    };
  }

  const [category, tags] = await Promise.all([
    prisma.category.findFirst({
      where: {
        id: input.categoryId,
        ownerId: userId,
      },
      select: { id: true },
    }),
    prisma.tag.findMany({
      where: {
        id: { in: input.tagIds },
        ownerId: userId,
      },
      select: { id: true },
    }),
  ]);

  if (!category) {
    return {
      success: false as const,
      issues: { fieldErrors: { categoryId: ["Vybraná rubrika neexistuje."] } },
    };
  }

  if (tags.length !== input.tagIds.length) {
    return {
      success: false as const,
      issues: {
        fieldErrors: { tagIds: ["Jeden nebo více vybraných štítků je neplatných."] },
      },
    };
  }

  const sanitizedContent = sanitizeArticleContent(input.content);
  const finalSlug = await ensureUniqueArticleSlug(
    input.slug || input.title,
    articleId,
  );
  const excerpt = input.excerpt || buildExcerpt(sanitizedContent);

  const basePayload = {
    title: input.title,
    slug: finalSlug,
    excerpt,
    content: sanitizedContent,
    coverImage: input.coverImage || null,
    status: input.status as ArticleStatus,
    publishDate,
    categoryId: category.id,
    tagIds: tags.map((tag) => tag.id),
  };

  return {
    success: true as const,
    data: basePayload,
  };
}

export type ValidArticleInput = ArticleInput;
