import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserCategories } from "@/lib/dashboard-data";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { taxonomySchema } from "@/lib/validation/taxonomy";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const items = await getUserCategories(user.id);

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Unauthorized", 401);
  }

  const body = await request.json();
  const parsed = taxonomySchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Validation failed", 400, parsed.error.flatten());
  }

  const name = parsed.data.name.trim();
  const slug = slugify(parsed.data.slug || name) || "category";
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name }, { slug }],
    },
    select: { id: true },
  });

  if (existing) {
    return jsonError("Category name or slug already exists", 409);
  }

  const category = await prisma.category.create({
    data: {
      name,
      slug,
      ownerId: user.id,
    },
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return NextResponse.json({ item: category }, { status: 201 });
}
