import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan, requireApiSuperStaff } from "@/lib/auth/api-auth";
import { db } from "@/lib/db/prisma";
import { adminUserUpdateSchema } from "@/lib/validators/admin-core";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const gate = await requireApiStaffCan("users", "write");
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminUserUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const { role, staffRole } = parsed.data;
  if (role === undefined && staffRole === undefined) {
    return NextResponse.json(
      { error: "Provide role and/or staffRole" },
      { status: 400 }
    );
  }

  if (staffRole !== undefined) {
    const sg = await requireApiSuperStaff();
    if (!sg.ok) return sg.response;
  }

  const user = await db.user.update({
    where: { id },
    data: {
      ...(role !== undefined && { role }),
      ...(staffRole !== undefined && { staffRole }),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      staffRole: true,
    },
  });

  return NextResponse.json({ user });
}
