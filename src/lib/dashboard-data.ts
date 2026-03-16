import { prisma } from "@/lib/prisma";
import { clampPage } from "@/lib/utils";

const DASHBOARD_ARTICLE_SELECT = {
  id: true,
  title: true,
  slug: true,
  excerpt: true,
  content: true,
  coverImage: true,
  publishDate: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  categoryId: true,
  category: {
    select: {
      id: true,
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
} as const;

export async function getDashboardArticles(userId: string, page: number, pageSize: number) {
  const total = await prisma.article.count({
    where: { authorId: userId },
  });
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = clampPage(page, totalPages);

  const items = await prisma.article.findMany({
    where: { authorId: userId },
    orderBy: [{ updatedAt: "desc" }],
    select: DASHBOARD_ARTICLE_SELECT,
    skip: (safePage - 1) * pageSize,
    take: pageSize,
  });

  return {
    items,
    page: safePage,
    pageSize,
    total,
    totalPages,
  };
}

export async function getDashboardArticleById(userId: string, id: string) {
  return prisma.article.findFirst({
    where: {
      id,
      authorId: userId,
    },
    select: DASHBOARD_ARTICLE_SELECT,
  });
}

export async function getUserCategories(userId: string) {
  return prisma.category.findMany({
    where: { ownerId: userId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          articles: true,
        },
      },
    },
  });
}

export async function getUserTags(userId: string) {
  return prisma.tag.findMany({
    where: { ownerId: userId },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      slug: true,
      _count: {
        select: {
          articles: true,
        },
      },
    },
  });
}
