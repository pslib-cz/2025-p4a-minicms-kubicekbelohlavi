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

  const tag = await prisma.tag.findFirst({
    where: {
      id,
      ownerId: user.id,
    },
    select: { id: true },
  });

  if (!tag) {
    return jsonError("Tag not found", 404);
  }

  const name = parsed.data.name.trim();
  const slug = slugify(parsed.data.slug || name) || "tag";
  const duplicate = await prisma.tag.findFirst({
    where: {
      NOT: { id },
      OR: [{ name }, { slug }],
    },
    select: { id: true },
  });

  if (duplicate) {
    return jsonError("Tag name or slug already exists", 409);
  }

  const item = await prisma.tag.update({
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
  const tag = await prisma.tag.findFirst({
    where: {
      id,
      ownerId: user.id,
    },
    select: { id: true },
  });

  if (!tag) {
    return jsonError("Tag not found", 404);
  }

  await prisma.tag.delete({
    where: { id },
  });

  return NextResponse.json({ ok: true });
}
