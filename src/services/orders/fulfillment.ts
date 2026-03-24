import { db } from "@/lib/db/prisma";
import { dollarsToCents } from "@/lib/stripe/client";
import type { OrderItem, Prisma } from "@prisma/client";
import type Stripe from "stripe";
import type { MixedCartInput } from "@/lib/validators/checkout";

/**
 * After Stripe confirms payment: mark order paid, adjust inventory, grant tool access.
 * Idempotent: no-op if already PAID.
 */
export async function fulfillOrderAfterPayment(
  orderId: string,
  options?: { stripePaymentIntentId?: string }
): Promise<{
  ok: boolean;
  reason?: string;
}> {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true },
  });

  if (!order) {
    return { ok: false, reason: "order_not_found" };
  }
  if (order.paymentStatus === "PAID") {
    return { ok: true, reason: "already_fulfilled" };
  }

  const hasPhysical = order.items.some((i) => i.type === "PRODUCT");

  try {
    await db.$transaction(async (tx) => {
      for (const item of order.items) {
        if (item.type === "PRODUCT" && item.productId) {
          const updated = await tx.product.updateMany({
            where: {
              id: item.productId,
              stock: { gte: item.quantity },
            },
            data: { stock: { decrement: item.quantity } },
          });
          if (updated.count === 0) {
            throw new Error(`Insufficient stock for product ${item.productId}`);
          }
        }
      }

      await tx.order.update({
        where: { id: orderId },
        data: {
          paymentStatus: "PAID",
          status: hasPhysical ? "PROCESSING" : "DELIVERED",
          ...(options?.stripePaymentIntentId && {
            stripePaymentIntentId: options.stripePaymentIntentId,
          }),
        },
      });

      if (order.userId) {
        for (const item of order.items) {
          if (item.type === "TOOL" && item.toolId) {
            await tx.userToolAccess.upsert({
              where: {
                userId_toolId: { userId: order.userId, toolId: item.toolId },
              },
              create: {
                userId: order.userId,
                toolId: item.toolId,
                source: "PURCHASE",
                orderId: order.id,
              },
              update: {
                source: "PURCHASE",
                orderId: order.id,
              },
            });
          }
        }
      }
    });

    return { ok: true };
  } catch (e) {
    console.error("[fulfillOrderAfterPayment]", e);
    return {
      ok: false,
      reason: e instanceof Error ? e.message : "transaction_failed",
    };
  }
}

export function orderHasPhysicalItems(items: OrderItem[]): boolean {
  return items.some((i) => i.type === "PRODUCT");
}

type ExpandedCart = {
  lines: Prisma.OrderItemCreateWithoutOrderInput[];
  stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
  total: number;
};

/**
 * Validate cart lines against DB (price, stock, publish flags) and build
 * Prisma order lines + Stripe Checkout `line_items` (must match totals).
 */
export async function expandMixedCartForCheckout(
  items: MixedCartInput["items"]
): Promise<ExpandedCart> {
  const lines: Prisma.OrderItemCreateWithoutOrderInput[] = [];
  const stripeLineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  let total = 0;

  for (const line of items) {
    if (line.type === "PRODUCT") {
      const product = await db.product.findUnique({
        where: { id: line.productId },
      });
      if (!product || !product.published || product.archived) {
        throw new Error(`Product not available: ${line.productId}`);
      }
      if (product.stock < line.quantity) {
        throw new Error(`Not enough stock for ${product.name}`);
      }
      if (line.size && !product.sizes.includes(line.size)) {
        throw new Error(`Invalid size for ${product.name}`);
      }
      if (line.color && !product.colors.includes(line.color)) {
        throw new Error(`Invalid color for ${product.name}`);
      }
      const unit = Number(product.price);
      const lineTotal = unit * line.quantity;
      total += lineTotal;
      const variant = [line.size, line.color].filter(Boolean).join(" / ");
      const label = variant ? `${product.name} (${variant})` : product.name;
      lines.push({
        type: "PRODUCT",
        product: { connect: { id: product.id } },
        quantity: line.quantity,
        price: unit,
        size: line.size ?? null,
        color: line.color ?? null,
      });
      stripeLineItems.push({
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: dollarsToCents(unit),
          product_data: { name: label, images: product.images[0] ? [product.images[0]] : undefined },
        },
      });
    } else {
      const tool = await db.tool.findUnique({ where: { id: line.toolId } });
      if (!tool || !tool.published) {
        throw new Error(`Tool not available: ${line.toolId}`);
      }
      const unit = Number(tool.price);
      const lineTotal = unit * line.quantity;
      total += lineTotal;
      lines.push({
        type: "TOOL",
        tool: { connect: { id: tool.id } },
        quantity: line.quantity,
        price: unit,
        size: null,
        color: null,
      });
      stripeLineItems.push({
        quantity: line.quantity,
        price_data: {
          currency: "usd",
          unit_amount: dollarsToCents(unit),
          product_data: {
            name: `${tool.name} (digital)`,
            images: tool.icon ? [tool.icon] : undefined,
          },
        },
      });
    }
  }

  return { lines, stripeLineItems, total };
}
