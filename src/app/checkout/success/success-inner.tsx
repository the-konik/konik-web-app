"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function CheckoutSuccessInner() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");

  return (
    <div className="mx-auto max-w-lg px-6 py-20 text-center">
      <h1 className="text-2xl font-bold text-primary">Thank you!</h1>
      <p className="mt-4 text-muted-foreground">
        Your payment is processing. When Stripe confirms it, we&apos;ll mark your
        order paid and update fulfillment status. Digital tools unlock under{" "}
        <Link href="/dashboard/dashboard/tools" className="text-accent underline">
          Dashboard → Tools
        </Link>
        .
      </p>
      {sessionId && (
        <p className="mt-6 font-mono text-xs text-muted-foreground">
          Session: {sessionId}
        </p>
      )}
      <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/dashboard/dashboard/orders"
          className="rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground hover:bg-accent/90"
        >
          View orders
        </Link>
        <Link
          href="/shop"
          className="rounded-lg border border-border bg-white px-6 py-3 font-medium text-primary hover:bg-muted"
        >
          Back to shop
        </Link>
      </div>
    </div>
  );
}
