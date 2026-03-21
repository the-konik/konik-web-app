import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { campaignCreateSchema } from "@/lib/validators/admin-core";

export async function GET() {
  const gate = await requireApiStaffCan("marketing", "read");
  if (!gate.ok) return gate.response;

  const campaigns = await db.marketingCampaign.findMany({
    orderBy: { createdAt: "desc" },
    take: 100,
  });
  return NextResponse.json({ campaigns });
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

  const parsed = campaignCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const d = parsed.data;
  const campaign = await db.marketingCampaign.create({
    data: {
      name: d.name,
      slug: d.slug,
      description: d.description ?? null,
      active: d.active ?? true,
      startsAt: d.startsAt ? new Date(d.startsAt) : null,
      endsAt: d.endsAt ? new Date(d.endsAt) : null,
    },
  });

  return NextResponse.json({ campaign });
}
