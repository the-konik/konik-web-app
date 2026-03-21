import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/api-auth";
import { adminGrantToolSchema } from "@/lib/validators/admin-core";
import { grantToolAccess } from "@/services/tool-access";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const gate = await requireApiStaffCan("users", "write");
  if (!gate.ok) return gate.response;

  const { id: userId } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminGrantToolSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const { toolId, source, expiresAt } = parsed.data;
  const access = await grantToolAccess(userId, toolId, {
    source,
    expiresAt: expiresAt ? new Date(expiresAt) : undefined,
  });

  return NextResponse.json({ access });
}
