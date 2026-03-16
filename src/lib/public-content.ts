import { ArticleStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { clampPage } from "@/lib/utils";

type PublicFilters = {
  category?: string;
  page?: number;
  query?: string;
  tag?: string;
};

const PUBLIC_ARTICLE_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  coverImage: true,
  publishDate: true,
  createdAt: true,
  category: {
    select: {
      name: true,
      slug: true,
    },
  },
  tags: {
    select: {
      id: true,
      name: true,
      slug: true,
    },
  },
  author: {
    select: {
      name: true,
    },
  },
} satisfies Prisma.ArticleSelect;

function createPublicWhere(filters: PublicFilters): Prisma.ArticleWhereInput {
  const query = filters.query?.trim();

  return {
    status: ArticleStatus.PUBLISHED,
    publishDate: { lte: new Date() },
    ...(filters.category
      ? { category: { slug: filters.category } }
      : {}),
    ...(filters.tag ? { tags: { some: { slug: filters.tag } } } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { excerpt: { contains: query } },
            { content: { contains: query } },
          ],
        }
      : {}),
  };
}

export async function getPublishedArticles(filters: PublicFilters, pageSize: number) {
  const requestedPage = filters.page ?? 1;
  const where = createPublicWhere(filters);
  const total = await prisma.article.count({ where });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clampPage(requestedPage, totalPages);

  const items = await prisma.article.findMany({
    where,
    orderBy: [{ publishDate: "desc" }, { createdAt: "desc" }],
    select: PUBLIC_ARTICLE_SELECT,
    skip: (page - 1) * pageSize,
    take: pageSize,
  });

  return {
    items,
    page,
    pageSize,
    total,
    totalPages,
  };
}

export async function getPublishedArticleBySlug(slug: string) {
  return prisma.article.findFirst({
    where: {
      slug,
      status: ArticleStatus.PUBLISHED,
      publishDate: { lte: new Date() },
    },
    select: {
      ...PUBLIC_ARTICLE_SELECT,
      content: true,
      updatedAt: true,
    },
  });
}

export async function getPublicTaxonomy() {
  const [categories, tags] = await Promise.all([
    prisma.category.findMany({
      where: {
        articles: {
          some: {
            status: ArticleStatus.PUBLISHED,
            publishDate: { lte: new Date() },
          },
        },
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
    prisma.tag.findMany({
      where: {
        articles: {
          some: {
            status: ArticleStatus.PUBLISHED,
            publishDate: { lte: new Date() },
          },
        },
      },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ]);

  return { categories, tags };
}
