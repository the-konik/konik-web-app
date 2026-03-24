import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/cn";
import { cartPreviewSchema } from "@/lib/validators/checkout";

/**
 * POST — Resolve cart line ids to names/prices for the cart UI (public).
 */
export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = cartPreviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid cart" },
      { status: 400 }
    );
  }

  type Row = {
    line: (typeof parsed.data.items)[number];
    title: string;
    subtitle?: string;
    unitPrice: number;
    lineTotal: number;
    available: boolean;
    reason?: string;
  };

  const rows: Row[] = [];

  for (const line of parsed.data.items) {
    if (line.type === "PRODUCT") {
      const product = await db.product.findUnique({
        where: { id: line.productId },
      });
      if (!product || !product.published || product.archived) {
        rows.push({
          line,
          title: "Unavailable product",
          unitPrice: 0,
          lineTotal: 0,
          available: false,
          reason: "removed",
        });
        continue;
      }
      if (product.stock < line.quantity) {
        const unit = Number(product.price);
        rows.push({
          line,
          title: product.name,
          subtitle: [line.size, line.color].filter(Boolean).join(" · ") || undefined,
          unitPrice: unit,
          lineTotal: unit * line.quantity,
          available: false,
          reason: "out_of_stock",
        });
        continue;
      }
      if (line.size && !product.sizes.includes(line.size)) {
        rows.push({
          line,
          title: product.name,
          unitPrice: Number(product.price),
          lineTotal: Number(product.price) * line.quantity,
          available: false,
          reason: "bad_variant",
        });
        continue;
      }
      if (line.color && !product.colors.includes(line.color)) {
        rows.push({
          line,
          title: product.name,
          unitPrice: Number(product.price),
          lineTotal: Number(product.price) * line.quantity,
          available: false,
          reason: "bad_variant",
        });
        continue;
      }
      const unit = Number(product.price);
      rows.push({
        line,
        title: product.name,
        subtitle: [line.size, line.color].filter(Boolean).join(" · ") || undefined,
        unitPrice: unit,
        lineTotal: unit * line.quantity,
        available: true,
      });
    } else {
      const tool = await db.tool.findUnique({ where: { id: line.toolId } });
      if (!tool || !tool.published) {
        rows.push({
          line,
          title: "Unavailable tool",
          unitPrice: 0,
          lineTotal: 0,
          available: false,
          reason: "removed",
        });
        continue;
      }
      const unit = Number(tool.price);
      rows.push({
        line,
        title: `${tool.name} (digital)`,
        unitPrice: unit,
        lineTotal: unit * line.quantity,
        available: true,
      });
    }
  }

  const subtotal = rows.reduce((s, r) => s + (r.available ? r.lineTotal : 0), 0);

  return NextResponse.json({
    rows: rows.map((r) => ({
      ...r,
      unitPriceFormatted: formatPrice(String(r.unitPrice)),
      lineTotalFormatted: formatPrice(String(r.lineTotal)),
    })),
    subtotal,
    subtotalFormatted: formatPrice(String(subtotal)),
  });
}
