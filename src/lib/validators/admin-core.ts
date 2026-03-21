import { z } from "zod";

export const adminToolCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).optional(),
  description: z.string().min(1),
  price: z.coerce.number().nonnegative(),
  accessType: z.enum(["ONE_TIME", "SUBSCRIPTION"]),
  icon: z.string().optional().nullable(),
  published: z.coerce.boolean().optional(),
  featured: z.coerce.boolean().optional(),
  appPath: z.string().max(512).optional().nullable(),
});

export const adminToolUpdateSchema = adminToolCreateSchema.partial();

export const adminUserUpdateSchema = z.object({
  role: z
    .enum([
      "GUEST",
      "USER",
      "SUBSCRIBER",
      "PREMIUM",
      "VIP",
      "ADMIN",
    ])
    .optional(),
  staffRole: z
    .enum(["SUPER_ADMIN", "ADMIN", "SALES", "SHIPPING", "MARKETING"])
    .nullable()
    .optional(),
});

export const adminGrantToolSchema = z.object({
  toolId: z.string().min(1),
  source: z.enum(["MANUAL_GRANT", "TRIAL"]).default("MANUAL_GRANT"),
  expiresAt: z.string().datetime().optional().nullable(),
});

export const discountCodeCreateSchema = z.object({
  code: z.string().min(1).max(64),
  description: z.string().optional().nullable(),
  percentOff: z.coerce.number().int().min(1).max(100).optional().nullable(),
  amountOff: z.coerce.number().nonnegative().optional().nullable(),
  currency: z.string().optional().default("usd"),
  active: z.coerce.boolean().optional(),
  maxRedemptions: z.coerce.number().int().positive().optional().nullable(),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
});

export const discountCodeUpdateSchema = discountCodeCreateSchema.partial();

export const campaignCreateSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional().nullable(),
  active: z.coerce.boolean().optional(),
  startsAt: z.string().datetime().optional().nullable(),
  endsAt: z.string().datetime().optional().nullable(),
});

export const campaignUpdateSchema = campaignCreateSchema.partial();

export const appSettingPatchSchema = z.object({
  key: z.string().min(1),
  value: z.unknown(),
});

export const APP_SETTING_KEYS = [
  "general",
  "payments",
  "tool_rules",
] as const;
