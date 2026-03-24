import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth/api-auth";
import { db } from "@/lib/db/prisma";

type Ctx = { params: Promise<{ id: string }> };

/**
 * GET — Order detail for the owning user or an admin.
 */
export async function GET(_req: Request, ctx: Ctx) {
  const gate = await requireApiSession();
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const order = await db.order.findUnique({
    where: { id },
    include: {
      items: { include: { product: true, tool: true } },
      user: { select: { id: true, name: true, email: true } },
    },
  });

  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const isOwner = order.userId === gate.session.user.id;
  const isAdmin = gate.session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ order });
}
