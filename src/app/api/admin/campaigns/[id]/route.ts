import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { campaignUpdateSchema } from "@/lib/validators/admin-core";

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

  const parsed = campaignUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const campaign = await db.marketingCampaign.update({
    where: { id },
    data: {
      ...(d.name !== undefined && { name: d.name }),
      ...(d.slug !== undefined && { slug: d.slug }),
      ...(d.description !== undefined && { description: d.description }),
      ...(d.active !== undefined && { active: d.active }),
      ...(d.startsAt !== undefined && {
        startsAt: d.startsAt ? new Date(d.startsAt) : null,
      }),
      ...(d.endsAt !== undefined && {
        endsAt: d.endsAt ? new Date(d.endsAt) : null,
      }),
    },
  });

  return NextResponse.json({ campaign });
}
