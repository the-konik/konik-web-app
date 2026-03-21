"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import {
  PRODUCT_CATEGORY_LABELS,
  PRODUCT_CATEGORIES,
  COMMON_SIZES,
} from "@/lib/products/constants";
type Props = {
  /** Max price among current catalog (for range max). */
  priceCeiling: number;
};

export function ShopFilters({ priceCeiling }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  const setParam = useCallback(
    (key: string, value: string | null) => {
      const next = new URLSearchParams(searchParams.toString());
      if (value === null || value === "" || value === "all") {
        next.delete(key);
      } else {
        next.set(key, value);
      }
      startTransition(() => {
        router.push(`/shop?${next.toString()}`);
      });
    },
    [router, searchParams]
  );

  const category = searchParams.get("category") ?? "all";
  const size = searchParams.get("size") ?? "all";
  const minPrice = searchParams.get("minPrice") ?? "";
  const maxPrice = searchParams.get("maxPrice") ?? "";

  return (
    <div className="space-y-4 rounded-xl border border-border bg-white p-4">
      <h2 className="text-sm font-semibold text-primary">Filters</h2>

      <div>
        <label className="text-xs font-medium text-muted-foreground">
          Category
        </label>
        <select
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={category}
          disabled={pending}
          onChange={(e) => setParam("category", e.target.value)}
        >
          <option value="all">All</option>
          {PRODUCT_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {PRODUCT_CATEGORY_LABELS[c]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-xs font-medium text-muted-foreground">
          Size
        </label>
        <select
          className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
          value={size}
          disabled={pending}
          onChange={(e) => setParam("size", e.target.value)}
        >
          <option value="all">Any</option>
          {COMMON_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Min price
          </label>
          <input
            type="number"
            min={0}
            step={1}
            placeholder="0"
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={minPrice}
            disabled={pending}
            onChange={(e) => setParam("minPrice", e.target.value || null)}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-muted-foreground">
            Max price
          </label>
          <input
            type="number"
            min={0}
            step={1}
            placeholder={String(Math.ceil(priceCeiling))}
            className="mt-1 w-full rounded-lg border border-border px-3 py-2 text-sm"
            value={maxPrice}
            disabled={pending}
            onChange={(e) => setParam("maxPrice", e.target.value || null)}
          />
        </div>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => router.push("/shop"))}
        className="w-full rounded-lg border border-border py-2 text-sm text-muted-foreground hover:bg-muted"
      >
        Clear filters
      </button>
    </div>
  );
}
