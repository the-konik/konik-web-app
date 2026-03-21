import type { MixedCartInput } from "@/lib/validators/checkout";

export const CART_STORAGE_KEY = "konik_cart_v1";

export type CartLine = MixedCartInput["items"][number];

export function loadCartFromStorage(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw) as unknown;
    if (!Array.isArray(data)) return [];
    return data as CartLine[];
  } catch {
    return [];
  }
}

export function saveCartToStorage(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(lines));
}

export function cartLineKey(line: CartLine): string {
  if (line.type === "PRODUCT") {
    return `P:${line.productId}:${line.size ?? ""}:${line.color ?? ""}`;
  }
  return `T:${line.toolId}`;
}

/** Merge a new line into the cart (same variant increments quantity). */
export function mergeCartLine(lines: CartLine[], incoming: CartLine): CartLine[] {
  const key = cartLineKey(incoming);
  const next = [...lines];
  const idx = next.findIndex((l) => cartLineKey(l) === key);
  if (idx === -1) {
    next.push({ ...incoming });
    return next;
  }
  const cur = next[idx];
  const q = cur.quantity + incoming.quantity;
  next[idx] = { ...cur, quantity: Math.min(99, q) };
  return next;
}
