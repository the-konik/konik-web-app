"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import {
  cartLineKey,
  loadCartFromStorage,
  saveCartToStorage,
  type CartLine,
} from "@/lib/cart-storage";

type PreviewRow = {
  line: CartLine;
  title: string;
  subtitle?: string;
  lineTotalFormatted: string;
  available: boolean;
  reason?: string;
};

export function CartPageClient() {
  const { data: session, status } = useSession();
  const [lines, setLines] = useState<CartLine[]>([]);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [subtotalFormatted, setSubtotalFormatted] = useState("");
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const refreshLines = useCallback(() => {
    setLines(loadCartFromStorage());
  }, []);

  useEffect(() => {
    refreshLines();
  }, [refreshLines]);

  useEffect(() => {
    if (lines.length === 0) {
      setPreview([]);
      setSubtotalFormatted("");
      return;
    }
    let cancelled = false;
    setLoadingPreview(true);
    fetch("/api/cart/preview", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: lines }),
    })
      .then(async (res) => {
        const data = (await res.json()) as {
          rows?: PreviewRow[];
          subtotalFormatted?: string;
        };
        if (!res.ok || !data.rows) throw new Error("Preview failed");
        if (cancelled) return;
        setPreview(data.rows);
        setSubtotalFormatted(data.subtotalFormatted ?? "");
      })
      .catch(() => {
        if (!cancelled) {
          setPreview([]);
          setSubtotalFormatted("");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false);
      });
    return () => {
      cancelled = true;
    };
  }, [lines]);

  function removeLine(line: CartLine) {
    const key = cartLineKey(line);
    const next = lines.filter((l) => cartLineKey(l) !== key);
    saveCartToStorage(next);
    setLines(next);
  }

  function setQuantity(line: CartLine, q: number) {
    const key = cartLineKey(line);
    const next = lines.map((l) =>
      cartLineKey(l) === key ? { ...l, quantity: Math.max(1, Math.min(99, q)) } : l
    );
    saveCartToStorage(next);
    setLines(next);
  }

  async function checkout() {
    setCheckoutError(null);
    if (status !== "authenticated" || !session?.user) {
      window.location.href = `/auth/login?callbackUrl=${encodeURIComponent("/cart")}`;
      return;
    }
    const allOk = preview.length > 0 && preview.every((r) => r.available);
    if (!allOk) {
      setCheckoutError("Fix or remove unavailable lines before checkout.");
      return;
    }
    setCheckoutLoading(true);
    try {
      const res = await fetch("/api/checkout/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: lines }),
      });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }
      saveCartToStorage([]);
      setLines([]);
      window.location.href = data.url;
    } catch (e) {
      setCheckoutError(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setCheckoutLoading(false);
    }
  }

  const canPay =
    preview.length > 0 && preview.every((r) => r.available) && lines.length > 0;

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-primary">Cart</h1>
          <p className="text-sm text-muted-foreground">
            Clothing and tools checkout together in one Stripe payment.
          </p>
        </div>
        <Link href="/shop" className="text-sm text-accent hover:underline">
          Continue shopping
        </Link>
      </div>

      {lines.length === 0 ? (
        <div className="rounded-xl border border-border bg-white p-12 text-center text-muted-foreground">
          Your cart is empty.
        </div>
      ) : (
        <div className="space-y-4">
          {loadingPreview && (
            <p className="text-sm text-muted-foreground">Updating cart…</p>
          )}
          {preview.map((row) => (
            <div
              key={cartLineKey(row.line)}
              className="flex flex-col gap-3 rounded-xl border border-border bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium text-primary">{row.title}</p>
                {row.subtitle && (
                  <p className="text-sm text-muted-foreground">{row.subtitle}</p>
                )}
                {!row.available && (
                  <p className="mt-1 text-xs text-destructive">
                    {row.reason === "out_of_stock"
                      ? "Not enough stock — reduce quantity or remove."
                      : row.reason === "bad_variant"
                        ? "Invalid variant for this product."
                        : "This item is no longer available."}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  Qty
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={row.line.quantity}
                    onChange={(e) =>
                      setQuantity(row.line, Number(e.target.value) || 1)
                    }
                    className="w-16 rounded border border-border px-2 py-1"
                  />
                </label>
                <span className="text-sm font-medium text-primary">
                  {row.lineTotalFormatted}
                </span>
                <button
                  type="button"
                  onClick={() => removeLine(row.line)}
                  className="text-sm text-destructive hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          <div className="flex flex-col gap-4 rounded-xl border border-border bg-muted/40 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Subtotal</p>
              <p className="text-xl font-semibold text-primary">
                {subtotalFormatted || "—"}
              </p>
              {status !== "authenticated" && (
                <p className="mt-2 text-sm text-muted-foreground">
                  <Link href="/auth/login" className="text-accent underline">
                    Sign in
                  </Link>{" "}
                  to pay with Stripe.
                </p>
              )}
            </div>
            <button
              type="button"
              disabled={!canPay || checkoutLoading}
              onClick={() => void checkout()}
              className="rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {checkoutLoading ? "Redirecting…" : "Pay with Stripe"}
            </button>
          </div>
          {checkoutError && (
            <p className="text-sm text-destructive">{checkoutError}</p>
          )}
        </div>
      )}
    </div>
  );
}
