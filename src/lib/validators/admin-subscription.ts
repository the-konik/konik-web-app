import { z } from "zod";

export const adminAssignSubscriptionSchema = z.object({
  userId: z.string().min(1),
  planId: z.string().min(1),
  periodMonths: z.coerce.number().int().min(1).max(120).optional().default(12),
});

export const adminChangeSubscriptionPlanSchema = z.object({
  planId: z.string().min(1),
});
