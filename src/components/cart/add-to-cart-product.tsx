"use client";

import { useState } from "react";
import {
  CART_STORAGE_KEY,
  loadCartFromStorage,
  mergeCartLine,
  saveCartToStorage,
  type CartLine,
} from "@/lib/cart-storage";

type Props = {
  productId: string;
  stock: number;
  sizes: string[];
  colors: string[];
};

export function AddToCartProduct({ productId, stock, sizes, colors }: Props) {
  const [size, setSize] = useState(sizes[0] ?? "");
  const [color, setColor] = useState(colors[0] ?? "");
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState<string | null>(null);

  const needSize = sizes.length > 0;
  const needColor = colors.length > 0;

  function add() {
    setMsg(null);
    if (needSize && !size) {
      setMsg("Choose a size.");
      return;
    }
    if (needColor && !color) {
      setMsg("Choose a color.");
      return;
    }
    const line: CartLine = {
      type: "PRODUCT",
      productId,
      quantity: qty,
      ...(size ? { size } : {}),
      ...(color ? { color } : {}),
    };
    const prev = loadCartFromStorage();
    saveCartToStorage(mergeCartLine(prev, line));
    setMsg("Added to cart.");
  }

  if (stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="mt-10 w-full cursor-not-allowed rounded-lg bg-muted py-3 font-medium text-muted-foreground opacity-70"
      >
        Unavailable
      </button>
    );
  }

  return (
    <div className="mt-10 space-y-4">
      <div className="flex flex-wrap gap-4">
        {sizes.length > 0 && (
          <label className="flex flex-col text-sm">
            <span className="font-medium text-primary">Size</span>
            <select
              value={size}
              onChange={(e) => setSize(e.target.value)}
              className="mt-1 rounded-lg border border-border bg-white px-3 py-2 text-primary"
            >
              <option value="">Select…</option>
              {sizes.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>
        )}
        {colors.length > 0 && (
          <label className="flex flex-col text-sm">
            <span className="font-medium text-primary">Color</span>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="mt-1 rounded-lg border border-border bg-white px-3 py-2 text-primary"
            >
              <option value="">Select…</option>
              {colors.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="flex flex-col text-sm">
          <span className="font-medium text-primary">Qty</span>
          <input
            type="number"
            min={1}
            max={Math.min(99, stock)}
            value={qty}
            onChange={(e) =>
              setQty(
                Math.max(
                  1,
                  Math.min(Math.min(99, stock), Number(e.target.value) || 1)
                )
              )
            }
            className="mt-1 w-24 rounded-lg border border-border bg-white px-3 py-2 text-primary"
          />
        </label>
      </div>
      <button
        type="button"
        onClick={add}
        className="w-full rounded-lg bg-accent py-3 font-medium text-accent-foreground hover:bg-accent/90"
      >
        Add to cart
      </button>
      {msg && (
        <p className="text-center text-sm text-muted-foreground">{msg}</p>
      )}
      <p className="text-center text-xs text-muted-foreground">
        Cart is stored on this device (
        <code className="rounded bg-muted px-1">{CART_STORAGE_KEY}</code>
        ).
      </p>
    </div>
  );
}
