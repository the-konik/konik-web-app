import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { requireApiStaffCan } from "@/lib/api-auth";
import { canReadSection, getEffectiveStaffRole } from "@/lib/staff-rbac";
import { db } from "@/lib/db";
import { productUpdateSchema } from "@/lib/validators/product";
import { productToDTO, parseStatusToDb } from "@/services/product.service";

type Ctx = { params: Promise<{ id: string }> };

async function getProductOr404(id: string) {
  return db.product.findUnique({ where: { id } });
}

/**
 * GET — Single product by id.
 * Public only if listing is active (published & not archived); admins see any.
 */
export async function GET(_req: NextRequest, ctx: Ctx) {
  const { id } = await ctx.params;
  const product = await getProductOr404(id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const session = await auth();
  const staff = getEffectiveStaffRole(session);
  const isStaffProductReader =
    !!staff && canReadSection(staff, "products");
  const visible = product.published && !product.archived;
  if (!visible && !isStaffProductReader) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json({ product: productToDTO(product) });
}

/** PATCH — Update product (staff: products write). */
export async function PATCH(req: NextRequest, ctx: Ctx) {
  const gate = await requireApiStaffCan("products", "write");
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const existing = await getProductOr404(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid body" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    let slug = existing.slug;
    if (data.slug !== undefined) {
      const next = data.slug.trim();
      if (next !== existing.slug) {
        const taken = await db.product.findFirst({
          where: { slug: next, NOT: { id } },
        });
        if (taken) {
          return NextResponse.json(
            { error: "Slug already in use" },
            { status: 409 }
          );
        }
        slug = next;
      }
    }

    const { published, archived } =
      data.status != null
        ? parseStatusToDb(data.status)
        : {
            published: existing.published,
            archived: existing.archived,
          };

    const product = await db.product.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        slug,
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.images !== undefined && { images: data.images }),
        ...(data.sizes !== undefined && { sizes: data.sizes }),
        ...(data.colors !== undefined && { colors: data.colors }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.featured !== undefined && { featured: data.featured }),
        ...(data.status !== undefined && { published, archived }),
        ...(data.sku !== undefined && { sku: data.sku }),
      },
    });

    return NextResponse.json({ product: productToDTO(product) });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

/** DELETE — Remove product (staff: products write). */
export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const gate = await requireApiStaffCan("products", "write");
  if (!gate.ok) return gate.response;

  const { id } = await ctx.params;
  const existing = await getProductOr404(id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await db.product.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
