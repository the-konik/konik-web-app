"use client";

import { useState } from "react";

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function openPortal() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/billing/portal", { method: "POST" });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not open billing portal");
      }
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={loading}
        onClick={() => void openPortal()}
        className="rounded-lg border border-border bg-white px-4 py-2 text-sm font-medium text-primary hover:bg-muted disabled:opacity-50"
      >
        {loading ? "Opening…" : "Manage in Stripe (payment method, cancel)"}
      </button>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Opens Stripe&apos;s customer portal. Enable it in Stripe Dashboard →
        Settings → Billing → Customer portal.
      </p>
    </div>
  );
}
