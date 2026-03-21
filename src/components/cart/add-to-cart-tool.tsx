"use client";

import { useState } from "react";
import {
  CART_STORAGE_KEY,
  loadCartFromStorage,
  mergeCartLine,
  saveCartToStorage,
  type CartLine,
} from "@/lib/cart-storage";

type Props = { toolId: string };

export function AddToCartTool({ toolId }: Props) {
  const [msg, setMsg] = useState<string | null>(null);

  function add() {
    const line: CartLine = { type: "TOOL", toolId, quantity: 1 };
    const prev = loadCartFromStorage();
    saveCartToStorage(mergeCartLine(prev, line));
    setMsg("Added to cart.");
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={add}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
      >
        Add to cart
      </button>
      {msg && <p className="text-sm text-muted-foreground">{msg}</p>}
      <p className="text-xs text-muted-foreground">
        Saved locally ({CART_STORAGE_KEY})
      </p>
    </div>
  );
}
