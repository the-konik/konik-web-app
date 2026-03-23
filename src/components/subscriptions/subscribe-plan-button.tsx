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
    <div className="space-y-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => void subscribe()}
        className="w-full bg-[#121212] py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] shadow-lg hover:bg-[#121212]/90 disabled:opacity-50 transition-all active:scale-95"
      >
        {loading ? "Redirecting…" : label.toUpperCase()}
      </button>
      {error && (
        <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[#EF4444]">{error}</p>
      )}
    </div>
  );
}
