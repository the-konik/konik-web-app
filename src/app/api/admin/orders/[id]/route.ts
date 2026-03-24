import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/auth/api-auth";
import { db } from "@/lib/db/prisma";
import { adminOrderUpdateSchema } from "@/lib/validators/checkout";

type Ctx = { params: Promise<{ id: string }> };

/**
 * PATCH — Admin: update fulfillment + payment flags (shipping workflow).
 */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const gate = await requireApiStaffCan("orders", "write");
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminOrderUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const { orderStatus, paymentStatus } = parsed.data;
  if (orderStatus === undefined && paymentStatus === undefined) {
    return NextResponse.json(
      { error: "Provide orderStatus and/or paymentStatus" },
      { status: 400 }
    );
  }

  const existing = await db.order.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const order = await db.order.update({
    where: { id },
    data: {
      ...(orderStatus !== undefined && { status: orderStatus }),
      ...(paymentStatus !== undefined && { paymentStatus }),
    },
    include: {
      items: { include: { product: true, tool: true } },
      user: true,
    },
  });

  return NextResponse.json({ order });
}
