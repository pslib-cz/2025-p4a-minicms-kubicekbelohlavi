import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { taxonomySchema } from "@/lib/validation/taxonomy";

type Params = Promise<{ id: string }>;

export async function PATCH(
  request: Request,
  { params }: { params: Params },
) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const { id } = await params;
  const body = await request.json();
  const parsed = taxonomySchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  const category = await prisma.category.findFirst({
    where: {
      id,
      ownerId: user.id,
    },
    select: { id: true },
  });

  if (!category) {
    return jsonError("Category not found", 404);
  }

  const name = parsed.data.name.trim();
  const slug = slugify(parsed.data.slug || name) || "category";
  const duplicate = await prisma.category.findFirst({
    where: {
      NOT: { id },
      OR: [{ name }, { slug }],
    },
    select: { id: true },
  });

  if (duplicate) {
    return jsonError("Category name or slug already exists", 409);
  }

  const item = await prisma.category.update({
    where: { id },
    data: { name, slug },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return NextResponse.json({ item });
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
  const category = await prisma.category.findFirst({
    where: {
      id,
      ownerId: user.id,
    },
    select: {
      id: true,
      _count: {
        select: {
          articles: true,
        },
      },
    },
  });

  if (!category) {
    return jsonError("Category not found", 404);
  }

  if (category._count.articles > 0) {
    return jsonError("Category cannot be deleted while articles still use it", 409);
  }

  await prisma.category.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
