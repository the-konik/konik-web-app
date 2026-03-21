"use client";

import { useState } from "react";

type Props = { planId: string; label?: string };

/**
 * Starts Stripe Checkout in `subscription` mode for the given plan.
 */
export function SubscribePlanButton({ planId, label = "Subscribe" }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subscribe() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/checkout/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = `/auth/login?callbackUrl=${encodeURIComponent("/plans")}`;
          return;
        }
        throw new Error(data.error || "Checkout failed");
      }
      if (!data.url) throw new Error("No checkout URL");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-1">
      <button
        type="button"
        disabled={loading}
        onClick={() => void subscribe()}
        className="w-full rounded-lg bg-accent py-2.5 text-sm font-medium text-accent-foreground hover:bg-accent/90 disabled:opacity-50"
      >
        {loading ? "Redirecting…" : label}
      </button>
      {error && (
        <p className="text-center text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
