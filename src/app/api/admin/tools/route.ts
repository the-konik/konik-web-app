import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/api-auth";
import { db } from "@/lib/db";
import { adminToolCreateSchema } from "@/lib/validators/admin-core";

function slugify(name: string) {
  const s = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s || "tool";
}

export async function GET() {
  const gate = await requireApiStaffCan("tools", "read");
  if (!gate.ok) return gate.response;

  const tools = await db.tool.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json({ tools });
}

export async function POST(req: NextRequest) {
  const gate = await requireApiStaffCan("tools", "write");
  if (!gate.ok) return gate.response;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = adminToolCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid body" },
      { status: 400 }
    );
  }

  const d = parsed.data;
  let slug = d.slug?.trim() || slugify(d.name);
  const taken = await db.tool.findUnique({ where: { slug } });
  if (taken) {
    slug = `${slug}-${Date.now().toString(36)}`;
  }

  const tool = await db.tool.create({
    data: {
      name: d.name,
      slug,
      description: d.description,
      price: d.price,
      accessType: d.accessType,
      icon: d.icon ?? null,
      published: d.published ?? false,
      featured: d.featured ?? false,
      appPath: d.appPath ?? null,
    },
  });

  return NextResponse.json({ tool });
}
