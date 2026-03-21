import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

/** Reuse or create Stripe Customer for Checkout / subscriptions. */
export async function getOrCreateStripeCustomerId(
  userId: string,
  email: string | null | undefined
): Promise<string> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) throw new Error("User not found");
  if (user.stripeCustomerId) return user.stripeCustomerId;

  const stripe = getStripe();
  const customer = await stripe.customers.create({
    email: email ?? undefined,
    metadata: { userId },
  });

  await db.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customer.id },
  });

  return customer.id;
}
