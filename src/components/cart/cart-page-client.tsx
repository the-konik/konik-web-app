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
    <div className="mx-auto max-w-[1440px] px-6 sm:px-8 lg:px-12 py-10 pt-32 sm:pt-36 min-h-[60vh]">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="font-atmospheric text-4xl sm:text-5xl text-[#121212] tracking-tight">CART</h1>
          <p className="mt-2 text-sm text-[#4B5563]">
            Clothing and tools checkout together in one secure payment.
          </p>
        </div>
        <Link href="/shop" className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B8860B] hover:underline whitespace-nowrap">
          Continue shopping →
        </Link>
      </div>

      {lines.length === 0 ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-16 text-center shadow-sm">
          <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#4B5563]">
            Your cart is empty.
          </p>
          <Link
            href="/shop"
            className="mt-6 inline-block border border-[#121212] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] hover:bg-[#F8F8F8] transition-colors"
          >
            Explore Collections
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {loadingPreview && (
            <p className="text-[11px] font-bold tracking-widest uppercase text-[#B8860B] animate-pulse">Syncing cart…</p>
          )}
          
          <div className="space-y-4">
            {preview.map((row) => (
              <div
                key={cartLineKey(row.line)}
                className="flex flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between transition-all hover:border-[#B8860B]/30"
              >
                <div>
                  <p className="text-sm font-bold text-[#121212]">{row.title}</p>
                  {row.subtitle && (
                    <p className="mt-1 text-[11px] font-medium text-[#4B5563] tracking-wide uppercase">{row.subtitle}</p>
                  )}
                  {!row.available && (
                    <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-[#EF4444]">
                      {row.reason === "out_of_stock"
                        ? "Not enough stock — reduce quantity or remove."
                        : row.reason === "bad_variant"
                          ? "Invalid variant for this product."
                          : "This item is no longer available."}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap items-center gap-6 sm:gap-8">
                  <div className="flex items-center gap-3">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#4B5563]">
                      Qty
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={99}
                      value={row.line.quantity}
                      onChange={(e) =>
                        setQuantity(row.line, Number(e.target.value) || 1)
                      }
                      className="w-16 rounded-none border border-[#E5E7EB] bg-[#F8F8F8] px-3 py-1.5 text-sm font-medium text-[#121212] focus:border-[#B8860B] focus:ring-0 appearance-none"
                    />
                  </div>
                  <span className="text-sm font-bold text-[#121212] min-w-[80px] text-right">
                    {row.lineTotalFormatted}
                  </span>
                  <button
                    type="button"
                    onClick={() => removeLine(row.line)}
                    className="text-[10px] font-bold uppercase tracking-wider text-[#EF4444] hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-col gap-6 rounded-xl border border-[#E5E7EB] bg-[#F8F8F8] p-8 sm:flex-row sm:items-center sm:justify-between shadow-inner">
            <div>
              <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#4B5563]">Subtotal</p>
              <p className="mt-2 text-2xl font-bold text-[#121212]">
                {subtotalFormatted || "—"}
              </p>
              {status !== "authenticated" && (
                <p className="mt-2 text-[11px] text-[#4B5563]">
                  <Link href="/auth/login" className="text-[#B8860B] font-bold uppercase tracking-wider underline hover:text-[#B8860B]/80">
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
              className="w-full sm:w-auto rounded-none bg-[#121212] px-10 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] shadow-lg hover:bg-[#121212]/90 disabled:cursor-not-allowed disabled:opacity-50 transition-all active:scale-95"
            >
              {checkoutLoading ? "Redirecting…" : "SECURE CHECKOUT ->"}
            </button>
          </div>
          
          {checkoutError && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 border border-red-100 flex items-center justify-center">
              <p className="text-xs font-bold uppercase tracking-wide text-[#EF4444]">{checkoutError}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
