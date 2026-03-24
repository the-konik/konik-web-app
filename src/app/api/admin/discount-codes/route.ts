import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/auth/api-auth";
import { db } from "@/lib/db/prisma";
import { discountCodeCreateSchema } from "@/lib/validators/admin-core";

export async function GET() {
  const gate = await requireApiStaffCan("marketing", "read");
  if (!gate.ok) return gate.response;

  const codes = await db.discountCode.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ codes });
}

export async function POST(req: NextRequest) {
  const gate = await requireApiStaffCan("marketing", "write");
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = discountCodeCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const d = parsed.data;
  if (
    (d.percentOff == null && d.amountOff == null) ||
    (d.percentOff != null && d.amountOff != null)
  ) {
    return NextResponse.json(
      { error: "Set exactly one of percentOff or amountOff" },
      { status: 400 }
    );
  }

  const code = await db.discountCode.create({
    data: {
      code: d.code.toUpperCase(),
      description: d.description ?? null,
      percentOff: d.percentOff ?? null,
      amountOff: d.amountOff != null ? d.amountOff : null,
      currency: d.currency ?? "usd",
      active: d.active ?? true,
      maxRedemptions: d.maxRedemptions ?? null,
      startsAt: d.startsAt ? new Date(d.startsAt) : null,
      endsAt: d.endsAt ? new Date(d.endsAt) : null,
    },
  });

  return NextResponse.json({ code });
}
