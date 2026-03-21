import { z } from "zod";

export const cartProductLineSchema = z.object({
  type: z.literal("PRODUCT"),
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
  size: z.string().optional(),
  color: z.string().optional(),
});

export const cartToolLineSchema = z.object({
  type: z.literal("TOOL"),
  toolId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).max(99),
});

export const mixedCartSchema = z.object({
  items: z
    .array(z.union([cartProductLineSchema, cartToolLineSchema]))
    .min(1, "Cart cannot be empty"),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export type MixedCartInput = z.infer<typeof mixedCartSchema>;

/** Resolve cart lines to product/tool rows for UI (no order created). */
export const cartPreviewSchema = z.object({
  items: mixedCartSchema.shape.items,
});

export const subscriptionCheckoutSchema = z.object({
  planId: z.string().min(1),
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});

export const adminOrderUpdateSchema = z.object({
  orderStatus: z
    .enum([
      "PENDING",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED",
    ])
    .optional(),
  paymentStatus: z
    .enum(["PENDING", "PAID", "FAILED", "REFUNDED"])
    .optional(),
});
