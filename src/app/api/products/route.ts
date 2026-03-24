import { NextRequest, NextResponse } from "next/server";
import type { ProductCategory } from "@prisma/client";
import { canUseAdminProductCatalog, requireApiStaffCan } from "@/lib/auth/api-auth";
import { db } from "@/lib/db/prisma";
import { productCreateSchema } from "@/lib/validators/product";
import {
  buildProductWhere,
  productToDTO,
  uniqueProductSlug,
  parseStatusToDb,
} from "@/services/admin/product.service";
/**
 * GET — List products (storefront or full admin catalog).
 * Query: category, minPrice, maxPrice, size, admin=true (requires ADMIN session).
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const adminCatalog =
    searchParams.get("admin") === "true" && (await canUseAdminProductCatalog());

  const category = searchParams.get("category") as ProductCategory | null;
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  const size = searchParams.get("size");

  const where = buildProductWhere({
    adminCatalog,
    category:
      category &&
      [
        "T_SHIRT",
        "HOODIE",
        "JACKET",
        "PANTS",
        "ACCESSORIES",
      ].includes(category)
        ? category
        : undefined,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    size: size || undefined,
  });

  const products = await db.product.findMany({
    where,
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
  });

  return NextResponse.json({
    products: products.map(productToDTO),
  });
}

/** POST — Create product (staff: products write). */
export async function POST(req: NextRequest) {
  const gate = await requireApiStaffCan("products", "write");
  if (!gate.ok) return gate.response;

  try {
    const body = await req.json();
    const parsed = productCreateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid body" },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const rawSlug = data.slug?.trim();
    const slug =
      rawSlug && rawSlug.length > 0
        ? rawSlug
        : await uniqueProductSlug(data.name);
    if (rawSlug && rawSlug.length > 0) {
      const taken = await db.product.findUnique({ where: { slug } });
      if (taken) {
        return NextResponse.json(
          { error: "Slug already in use" },
          { status: 409 }
        );
      }
    }

    const { published, archived } = parseStatusToDb(data.status);

    const product = await db.product.create({
      data: {
        name: data.name,
        slug,
        description: data.description,
        price: data.price,
        category: data.category,
        images: data.images,
        sizes: data.sizes,
        colors: data.colors,
        stock: data.stock,
        featured: data.featured,
        published,
        archived,
        sku: data.sku ?? undefined,
      },
    });

    return NextResponse.json(
      { product: productToDTO(product) },
      { status: 201 }
    );
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
