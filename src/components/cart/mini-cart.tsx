"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { X, ShoppingBag, Minus, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  loadCartFromStorage,
  saveCartToStorage,
  cartLineKey,
  type CartLine,
} from "@/lib/cart-storage";

export function MiniCart({ 
  isTransparent, 
  iconColor = "#121212" 
}: { 
  isTransparent?: boolean; 
  iconColor?: string;
}) {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);

  const refresh = useCallback(() => setLines(loadCartFromStorage()), []);

  /* Sync on mount + listen for add-to-cart events */
  useEffect(() => {
    refresh();
    const onOpen = () => {
      refresh();
      setOpen(true);
    };
    const onUpdate = () => refresh();
    window.addEventListener("cart:open", onOpen);
    window.addEventListener("cart:updated", onUpdate);
    /* re-sync when tab comes back */
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("cart:open", onOpen);
      window.removeEventListener("cart:updated", onUpdate);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  /* Lock scroll when open */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const totalQty = lines.reduce((s, l) => s + l.quantity, 0);

  function removeLine(line: CartLine) {
    const key = cartLineKey(line);
    const next = lines.filter((l) => cartLineKey(l) !== key);
    saveCartToStorage(next);
    setLines(next);
  }

  function setQuantity(line: CartLine, qty: number) {
    const key = cartLineKey(line);
    const next = lines.map((l) =>
      cartLineKey(l) === key ? { ...l, quantity: Math.max(1, Math.min(99, qty)) } : l,
    );
    saveCartToStorage(next);
    setLines(next);
  }

  return (
    <>
      {/* Trigger button (replaces old bag icon in header) */}
      <button
        onClick={() => { refresh(); setOpen(true); }}
        className={`p-2 rounded-full flex items-center justify-center transition-colors relative ${
          isTransparent ? "hover:bg-white/10" : "hover:bg-[#F8F8F8]"
        }`}
        aria-label="Open cart"
      >
        <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7" color={iconColor} strokeWidth={1.5} />
        {totalQty > 0 && (
          <span className="absolute -top-1 -right-1 bg-[#B8860B] text-[#FFFFFF] text-[10px] w-[20px] h-[20px] rounded-full flex items-center justify-center font-bold">
            {totalQty > 9 ? "9+" : totalQty}
          </span>
        )}
      </button>

      {/* Backdrop */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] bg-[#121212]/50"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[71] w-full max-w-[420px] bg-[#FFFFFF] shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#121212]" strokeWidth={1.5} />
            <h2 className="text-sm font-bold uppercase tracking-[0.15em] text-[#121212]">
              Your Cart ({totalQty})
            </h2>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-2 hover:bg-[#F8F8F8] rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-[#121212]" strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-[#E5E7EB] mb-4" strokeWidth={1} />
              <p className="text-sm font-medium text-[#121212] mb-1">
                Your cart is empty
              </p>
              <p className="text-xs text-[#4B5563] mb-6">
                Discover the collection and build your legacy.
              </p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="bg-[#121212] text-[#FFFFFF] px-8 py-3 rounded-full text-xs font-bold uppercase tracking-[0.15em] hover:bg-[#121212]/90 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {lines.map((line) => {
                const name =
                  line.type === "PRODUCT"
                    ? `Product · ${line.productId?.slice(-6) ?? "—"}`
                    : `Tool · ${line.toolId?.slice(-6) ?? "—"}`;
                
                const sub = line.type === "PRODUCT" 
                  ? [line.size, line.color].filter(Boolean).join(" / ")
                  : "";
                return (
                  <div
                    key={cartLineKey(line)}
                    className="flex gap-4 py-3 border-b border-[#E5E7EB] last:border-0"
                  >
                    {/* Placeholder thumb */}
                    <div className="w-16 h-16 rounded-lg bg-[#F8F8F8] flex items-center justify-center flex-shrink-0">
                      <ShoppingBag className="w-5 h-5 text-[#E5E7EB]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-medium text-[#121212] truncate">
                        {name}
                      </h3>
                      {sub && (
                        <p className="text-[11px] text-[#4B5563] mt-0.5">{sub}</p>
                      )}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 border border-[#E5E7EB] rounded">
                          <button
                            onClick={() => setQuantity(line, line.quantity - 1)}
                            className="p-1 hover:bg-[#F8F8F8] transition-colors"
                            disabled={line.quantity <= 1}
                          >
                            <Minus className="w-3 h-3 text-[#4B5563]" />
                          </button>
                          <span className="px-2 text-xs font-medium text-[#121212] min-w-[20px] text-center">
                            {line.quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(line, line.quantity + 1)}
                            className="p-1 hover:bg-[#F8F8F8] transition-colors"
                          >
                            <Plus className="w-3 h-3 text-[#4B5563]" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeLine(line)}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors group"
                        >
                          <Trash2 className="w-3.5 h-3.5 text-[#4B5563] group-hover:text-red-500 transition-colors" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {lines.length > 0 && (
          <div className="border-t border-[#E5E7EB] px-6 py-5 space-y-3">
            <p className="text-[11px] text-[#4B5563]">
              Shipping and taxes calculated at checkout.
            </p>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="block w-full bg-[#121212] text-[#FFFFFF] py-4 rounded-full text-center text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#121212]/90 transition-all duration-300"
            >
              View Cart &amp; Checkout
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="block w-full border-2 border-[#121212] text-[#121212] py-4 rounded-full text-center text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-all duration-300"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
