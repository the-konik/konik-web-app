import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/auth/api-auth";
import { db } from "@/lib/db/prisma";
import { discountCodeUpdateSchema } from "@/lib/validators/admin-core";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const gate = await requireApiStaffCan("marketing", "write");
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = discountCodeUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const code = await db.discountCode.update({
    where: { id },
    data: {
      ...(d.code !== undefined && { code: d.code.toUpperCase() }),
      ...(d.description !== undefined && { description: d.description }),
      ...(d.percentOff !== undefined && { percentOff: d.percentOff }),
      ...(d.amountOff !== undefined && { amountOff: d.amountOff }),
      ...(d.currency !== undefined && { currency: d.currency }),
      ...(d.active !== undefined && { active: d.active }),
      ...(d.maxRedemptions !== undefined && { maxRedemptions: d.maxRedemptions }),
      ...(d.startsAt !== undefined && {
        startsAt: d.startsAt ? new Date(d.startsAt) : null,
      }),
      ...(d.endsAt !== undefined && {
        endsAt: d.endsAt ? new Date(d.endsAt) : null,
      }),
    },
  });

  return NextResponse.json({ code });
}
