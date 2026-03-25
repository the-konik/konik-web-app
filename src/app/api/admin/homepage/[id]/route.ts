import { NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/auth/api-auth";
import { db } from "@/lib/db/prisma";
import { isValidSectionType } from "@/lib/homepage/component-map";
import { Stage } from "@/generated/prisma";

/**
 * PATCH /api/admin/homepage/[id] — update a homepage section.
 * Body: Partial<{ stage, sectionType, content, mediaUrl, sortOrder, isActive }>
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireApiStaffCan("products", "write");
  if (!authResult.ok) return authResult.response;

  const { id } = await params;

  try {
    const body = await req.json();
    const updateData: Record<string, unknown> = {};

    if (body.stage !== undefined) {
      if (!["COLD", "WARM", "HOT"].includes(body.stage)) {
        return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
      }
      updateData.stage = body.stage as Stage;
    }

    if (body.sectionType !== undefined) {
      if (!isValidSectionType(body.sectionType)) {
        return NextResponse.json({ error: "Invalid sectionType" }, { status: 400 });
      }
      updateData.sectionType = body.sectionType;
    }

    if (body.content !== undefined) updateData.content = body.content;
    if (body.mediaUrl !== undefined) updateData.mediaUrl = body.mediaUrl;
    if (body.sortOrder !== undefined) updateData.sortOrder = parseInt(body.sortOrder, 10);
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const section = await db.homepageSection.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(section);
  } catch {
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/homepage/[id] — delete a homepage section.
 */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authResult = await requireApiStaffCan("products", "write");
  if (!authResult.ok) return authResult.response;

  const { id } = await params;

  try {
    await db.homepageSection.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 }
    );
  }
}
