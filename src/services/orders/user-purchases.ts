import { db } from "@/lib/db/prisma";

export type PurchasedProductRow = {
  productId: string;
  name: string;
  slug: string;
  image: string | null;
  lastPurchasedAt: Date;
  orderId: string;
  quantityLastOrder: number;
  size: string | null;
  color: string | null;
};

/**
 * Clothing (`PRODUCT` line items) from **paid** orders, deduped by product
 * (keeps most recent purchase metadata).
 */
export async function getUserPurchasedProducts(
  userId: string
): Promise<PurchasedProductRow[]> {
  const items = await db.orderItem.findMany({
    where: {
      type: "PRODUCT",
      productId: { not: null },
      order: {
        userId,
        paymentStatus: "PAID",
      },
    },
    include: {
      product: true,
      order: { select: { id: true, createdAt: true } },
    },
    orderBy: { order: { createdAt: "desc" } },
  });

  const byProduct = new Map<string, PurchasedProductRow>();

  for (const line of items) {
    if (!line.productId || !line.product) continue;
    if (byProduct.has(line.productId)) continue;

    const img =
      line.product.images.length > 0 ? line.product.images[0]! : null;

    byProduct.set(line.productId, {
      productId: line.productId,
      name: line.product.name,
      slug: line.product.slug,
      image: img,
      lastPurchasedAt: line.order.createdAt,
      orderId: line.order.id,
      quantityLastOrder: line.quantity,
      size: line.size,
      color: line.color,
    });
  }

  return [...byProduct.values()].sort(
    (a, b) => b.lastPurchasedAt.getTime() - a.lastPurchasedAt.getTime()
  );
}
