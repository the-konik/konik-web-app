import { NextRequest, NextResponse } from "next/server";
import { requireApiStaffCan } from "@/lib/auth/api-auth";
import { uploadProductImage } from "@/lib/integrations/cloudinary";

const MAX_BYTES = 8 * 1024 * 1024; // 8 MB

/**
 * POST multipart/form-data with field `file` — uploads to Cloudinary, returns `{ url }`.
 * Admin only. Frontend sends the URL into product create/update `images[]`.
 */
export async function POST(req: NextRequest) {
  const gate = await requireApiStaffCan("products", "write");
  if (!gate.ok) return gate.response;

  try {
    const formData = await req.formData();
    const file = formData.get("file");
    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Missing file field (multipart form-data)" },
        { status: 400 }
      );
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are allowed" },
        { status: 400 }
      );
    }
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File too large (max 8MB)" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const { url, publicId } = await uploadProductImage(buffer);

    return NextResponse.json({ url, publicId });
  } catch (e) {
    console.error(e);
    const message =
      e instanceof Error ? e.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
