import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/auth/api-auth";
import { getStripe } from "@/lib/stripe/client";
import { getOrCreateStripeCustomerId } from "@/services/stripe/customer";

const DEFAULT_APP =
  process.env.NEXT_PUBLIC_APP_URL || process.env.AUTH_URL || "http://localhost:3000";

/**
 * POST — Stripe Customer Portal (cancel at period end, payment method, invoices).
 * Configure the portal in Stripe Dashboard → Settings → Billing → Customer portal.
 */
export async function POST() {
  const gate = await requireApiSession();
  if (!gate.ok) return gate.response;

  const user = gate.session.user;
  const customerId = await getOrCreateStripeCustomerId(
    user.id,
    user.email ?? null
  );

  const stripe = getStripe();
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${DEFAULT_APP}/dashboard/subscription`,
  });

  return NextResponse.json({ url: session.url });
}
