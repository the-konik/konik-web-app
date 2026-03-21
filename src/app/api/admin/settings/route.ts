import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { requireApiStaffCan } from "@/lib/api-auth";
import { db } from "@/lib/db";
import {
  APP_SETTING_KEYS,
  appSettingPatchSchema,
} from "@/lib/validators/admin-core";

export async function GET() {
  const gate = await requireApiStaffCan("settings", "read");
  if (!gate.ok) return gate.response;

  const rows = await db.appSetting.findMany({
    where: { key: { in: [...APP_SETTING_KEYS] } },
  });
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  return NextResponse.json({ settings: map });
}

export async function PATCH(req: NextRequest) {
  const gate = await requireApiStaffCan("settings", "write");
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = appSettingPatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const { key, value } = parsed.data;
  if (!APP_SETTING_KEYS.includes(key as (typeof APP_SETTING_KEYS)[number])) {
    return NextResponse.json({ error: "Unknown settings key" }, { status: 400 });
  }

  const jsonVal = value as Prisma.InputJsonValue;
  const row = await db.appSetting.upsert({
    where: { key },
    create: { key, value: jsonVal },
    update: { value: jsonVal },
  });

  return NextResponse.json({ setting: row });
}
