import { NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/auth/api-auth";
import { db } from "@/lib/db/prisma";
import { isValidSectionType } from "@/lib/homepage/component-map";
import { Stage } from "@/generated/prisma";

/**
 * GET /api/admin/homepage — list all homepage sections.
 * Query params: ?stage=COLD|WARM|HOT (optional filter)
 */
export async function GET(req: Request) {
  const authResult = await requireApiStaffCan("products", "read");
  if (!authResult.ok) return authResult.response;

  const { searchParams } = new URL(req.url);
  const stageFilter = searchParams.get("stage") as Stage | null;

  const sections = await db.homepageSection.findMany({
    where: stageFilter ? { stage: stageFilter } : undefined,
    orderBy: [{ stage: "asc" }, { sortOrder: "asc" }],
  });

  return NextResponse.json(sections);
}

/**
 * POST /api/admin/homepage — create a new homepage section.
 * Body: { stage, sectionType, content, mediaUrl?, sortOrder, isActive? }
 */
export async function POST(req: Request) {
  const authResult = await requireApiStaffCan("products", "write");
  if (!authResult.ok) return authResult.response;

  try {
    const body = await req.json();
    const { stage, sectionType, content, mediaUrl, sortOrder, isActive } = body;

    // Validate required fields
    if (!stage || !sectionType || content === undefined || sortOrder === undefined) {
      return NextResponse.json(
        { error: "Missing required fields: stage, sectionType, content, sortOrder" },
        { status: 400 }
      );
    }

    // Validate stage
    if (!["COLD", "WARM", "HOT"].includes(stage)) {
      return NextResponse.json(
        { error: `Invalid stage: "${stage}". Must be COLD, WARM, or HOT.` },
        { status: 400 }
      );
    }

    // Validate sectionType against component map
    if (!isValidSectionType(sectionType)) {
      return NextResponse.json(
        { error: `Invalid sectionType: "${sectionType}". Not found in component map.` },
        { status: 400 }
      );
    }

    const section = await db.homepageSection.create({
      data: {
        stage: stage as Stage,
        sectionType,
        content,
        mediaUrl: mediaUrl || null,
        sortOrder: parseInt(sortOrder, 10),
        isActive: isActive !== false,
      },
    });

    return NextResponse.json(section, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 }
    );
  }
}
