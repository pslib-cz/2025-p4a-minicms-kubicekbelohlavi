import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getUserTags } from "@/lib/dashboard-data";
import { jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { taxonomySchema } from "@/lib/validation/taxonomy";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Nejste přihlášeni.", 401);
  }

  const items = await getUserTags(user.id);

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();

  if (!user) {
    return jsonError("Nejste přihlášeni.", 401);
  }

  const body = await request.json();
  const parsed = taxonomySchema.safeParse(body);

  if (!parsed.success) {
    return jsonError("Validace selhala.", 400, parsed.error.flatten());
  }

  const name = parsed.data.name.trim();
  const slug = slugify(parsed.data.slug || name) || "tag";
  const existing = await prisma.tag.findFirst({
    where: {
      OR: [{ name }, { slug }],
    },
    select: { id: true },
  });

  if (existing) {
    return jsonError("Štítek nebo slug už existuje.", 409);
  }

  const tag = await prisma.tag.create({
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

  return NextResponse.json({ item: tag }, { status: 201 });
}
