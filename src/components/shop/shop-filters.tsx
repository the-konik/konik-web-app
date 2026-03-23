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
    <div className="space-y-6 rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] p-6 shadow-sm">
      <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212]">Filters</h2>

      <div className="space-y-4">
        <div>
          <label className="text-[10px] font-bold tracking-widest uppercase text-[#4B5563]">
            Category
          </label>
          <select
            className="mt-2 w-full rounded-none border-b border-[#E5E7EB] bg-transparent pb-2 text-sm text-[#121212] focus:border-[#B8860B] focus:outline-none focus:ring-0 appearance-none font-medium"
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
          <label className="text-[10px] font-bold tracking-widest uppercase text-[#4B5563]">
            Size
          </label>
          <select
            className="mt-2 w-full rounded-none border-b border-[#E5E7EB] bg-transparent pb-2 text-sm text-[#121212] focus:border-[#B8860B] focus:outline-none focus:ring-0 appearance-none font-medium"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#4B5563]">
              Min price
            </label>
            <input
              type="number"
              min={0}
              step={1}
              placeholder="0"
              className="mt-2 w-full rounded-none border-b border-[#E5E7EB] bg-transparent pb-2 text-sm text-[#121212] focus:border-[#B8860B] focus:outline-none focus:ring-0 font-medium placeholder:text-[#4B5563]/50"
              value={minPrice}
              disabled={pending}
              onChange={(e) => setParam("minPrice", e.target.value || null)}
            />
          </div>
          <div>
            <label className="text-[10px] font-bold tracking-widest uppercase text-[#4B5563]">
              Max price
            </label>
            <input
              type="number"
              min={0}
              step={1}
              placeholder={String(Math.ceil(priceCeiling))}
              className="mt-2 w-full rounded-none border-b border-[#E5E7EB] bg-transparent pb-2 text-sm text-[#121212] focus:border-[#B8860B] focus:outline-none focus:ring-0 font-medium placeholder:text-[#4B5563]/50"
              value={maxPrice}
              disabled={pending}
              onChange={(e) => setParam("maxPrice", e.target.value || null)}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => router.push("/shop"))}
        className="w-full mt-2 border border-[#E5E7EB] py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-[#121212] hover:bg-[#F8F8F8] transition-colors"
      >
        Clear filters
      </button>
    </div>
  );
}
