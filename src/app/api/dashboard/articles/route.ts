import { NextResponse } from "next/server";
import { createArticleMutationInput } from "@/lib/article-payload";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardArticles } from "@/lib/dashboard-data";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import { normalizePage } from "@/lib/utils";

export async function GET(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { searchParams } = new URL(request.url);
  const page = normalizePage(searchParams.get("page") ?? undefined);
  const data = await getDashboardArticles(
    user.id,
    page,
    siteConfig.dashboardPageSize,
  );

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const body = await request.json();
  const payload = await createArticleMutationInput(body, user.id);

  if (!payload.success) {
    return jsonError("Validation failed", 400, payload.issues);
  }

  const article = await prisma.article.create({
    data: {
      title: payload.data.title,
      slug: payload.data.slug,
      excerpt: payload.data.excerpt,
      content: payload.data.content,
      coverImage: payload.data.coverImage,
      status: payload.data.status,
      publishDate: payload.data.publishDate,
      author: {
        connect: { id: user.id },
      },
      category: {
        connect: { id: payload.data.categoryId },
      },
      tags: {
        connect: payload.data.tagIds.map((id) => ({ id })),
      },
    },
    select: {
      id: true,
    },
  });

  return NextResponse.json({ id: article.id }, { status: 201 });
}
