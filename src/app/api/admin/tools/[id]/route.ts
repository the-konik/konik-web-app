import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/auth/api-auth";
import { db } from "@/lib/db/prisma";
import { adminToolUpdateSchema } from "@/lib/validators/admin-core";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const gate = await requireApiStaffCan("tools", "read");
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const tool = await db.tool.findUnique({ where: { id } });
  if (!tool) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ tool });
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const gate = await requireApiStaffCan("tools", "write");
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const existing = await db.tool.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminToolUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const tool = await db.tool.update({
    where: { id },
    data: {
      ...(d.name !== undefined && { name: d.name }),
      ...(d.slug !== undefined && { slug: d.slug }),
      ...(d.description !== undefined && { description: d.description }),
      ...(d.price !== undefined && { price: d.price }),
      ...(d.accessType !== undefined && { accessType: d.accessType }),
      ...(d.icon !== undefined && { icon: d.icon }),
      ...(d.published !== undefined && { published: d.published }),
      ...(d.featured !== undefined && { featured: d.featured }),
      ...(d.appPath !== undefined && { appPath: d.appPath }),
    },
  });

  return NextResponse.json({ tool });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const gate = await requireApiStaffCan("tools", "write");
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const existing = await db.tool.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await db.tool.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
