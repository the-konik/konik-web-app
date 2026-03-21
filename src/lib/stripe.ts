import Stripe from "stripe";

let stripeSingleton: Stripe | null = null;

/** Server-only Stripe client. */
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is not set");
  }
  if (!stripeSingleton) {
    stripeSingleton = new Stripe(process.env.STRIPE_SECRET_KEY, {
      typescript: true,
    });
  }
  return stripeSingleton;
}

/** USD amount in cents for Stripe `unit_amount`. */
export function dollarsToCents(amount: number): number {
  return Math.round(amount * 100);
}
