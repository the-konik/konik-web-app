"use client";

import { useState } from "react";
import {
  CART_STORAGE_KEY,
  loadCartFromStorage,
  mergeCartLine,
  saveCartToStorage,
  openCartDrawer,
  type CartLine,
} from "@/lib/cart-storage";

type Props = { toolId: string };

export function AddToCartTool({ toolId }: Props) {
  const [loading, setLoading] = useState(false);

  function add() {
    setLoading(true);
    const line: CartLine = { type: "TOOL", toolId, quantity: 1 };
    const prev = loadCartFromStorage();
    saveCartToStorage(mergeCartLine(prev, line));
    
    // Smooth transition
    setTimeout(() => {
      setLoading(false);
      openCartDrawer();
    }, 400);
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        disabled={loading}
        onClick={add}
        className="bg-[#121212] px-8 py-3 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] shadow-lg hover:bg-[#121212]/90 disabled:opacity-50 transition-all active:scale-95"
      >
        {loading ? "Adding..." : "Add to Cart"}
      </button>
      <p className="text-[10px] text-[#4B5563] font-medium tracking-wide uppercase opacity-60">
        Digital Activation
      </p>
    </div>
  );
}
