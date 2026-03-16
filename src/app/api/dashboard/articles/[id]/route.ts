import { NextResponse } from "next/server";
import { createArticleMutationInput } from "@/lib/article-payload";
import { getCurrentUser } from "@/lib/auth";
import { getDashboardArticleById } from "@/lib/dashboard-data";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

type Params = Promise<{ id: string }>;

export async function GET(
  _request: Request,
  { params }: { params: Params },
) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await params;
  const article = await getDashboardArticleById(user.id, id);

  if (!article) {
    return jsonError("Article not found", 404);
  }

  return NextResponse.json({ item: article });
}

export async function PATCH(
  request: Request,
  { params }: { params: Params },
) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await params;
  const existing = await prisma.article.findFirst({
    where: {
      id,
      authorId: user.id,
    },
    select: { id: true },
  });

  if (!existing) {
    return jsonError("Article not found", 404);
  }

  const body = await request.json();
  const payload = await createArticleMutationInput(body, user.id, id);

  if (!payload.success) {
    return jsonError("Validation failed", 400, payload.issues);
  }

  await prisma.article.update({
    where: { id },
    data: {
      title: payload.data.title,
      slug: payload.data.slug,
      excerpt: payload.data.excerpt,
      content: payload.data.content,
      coverImage: payload.data.coverImage,
      status: payload.data.status,
      publishDate: payload.data.publishDate,
      category: {
        connect: { id: payload.data.categoryId },
      },
      tags: {
        set: [],
        connect: payload.data.tagIds.map((tagId) => ({ id: tagId })),
      },
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Params },
) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await params;
  const existing = await prisma.article.findFirst({
    where: {
      id,
      authorId: user.id,
    },
    select: { id: true },
  });

  if (!existing) {
    return jsonError("Article not found", 404);
  }

  await prisma.article.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
