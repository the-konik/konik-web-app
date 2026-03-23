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
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const needSize = sizes.length > 0;
  const needColor = colors.length > 0;

  function add() {
    setErrorMsg(null);
    if (needSize && !size) {
      setErrorMsg("Please select a size.");
      return;
    }
    if (needColor && !color) {
      setErrorMsg("Please select a color.");
      return;
    }
    
    setLoading(true);
    
    const line: CartLine = {
      type: "PRODUCT",
      productId,
      quantity: qty,
      ...(size ? { size } : {}),
      ...(color ? { color } : {}),
    };
    
    const prev = loadCartFromStorage();
    saveCartToStorage(mergeCartLine(prev, line));
    
    setTimeout(() => {
      setLoading(false);
      openCartDrawer();
    }, 400);
  }

  if (stock <= 0) {
    return (
      <button
        type="button"
        disabled
        className="mt-10 w-full cursor-not-allowed bg-[#E5E7EB] py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#4B5563]"
      >
        Sold Out
      </button>
    );
  }

  return (
    <div className="mt-10 space-y-8">
      <div className="flex flex-wrap gap-10">
        {sizes.length > 0 && (
          <div className="flex flex-col gap-3 min-w-[120px]">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#121212]">Select Size</span>
            <div className="flex flex-wrap gap-2">
               {sizes.map(s => (
                 <button
                   key={s}
                   type="button"
                   onClick={() => setSize(s)}
                   className={`px-4 py-2 text-xs font-bold transition-all border ${
                     size === s 
                      ? "border-[#121212] bg-[#121212] text-[#FFFFFF]" 
                      : "border-[#E5E7EB] bg-transparent text-[#121212] hover:border-[#121212]"
                   }`}
                 >
                   {s}
                 </button>
               ))}
            </div>
          </div>
        )}
        
        {colors.length > 0 && (
          <div className="flex flex-col gap-3 min-w-[120px]">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#121212]">Select Color</span>
            <select
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="w-full rounded-none border-b border-[#E5E7EB] bg-transparent pb-1.5 text-sm font-medium text-[#121212] focus:border-[#B8860B] focus:outline-none focus:ring-0 appearance-none cursor-pointer"
            >
              <option value="">Choose color</option>
              {colors.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#121212]">Quantity</span>
          <div className="flex items-center gap-4 border border-[#E5E7EB] bg-[#FFFFFF] px-3 py-1.5 w-max">
             <button 
               type="button" 
               onClick={() => setQty(Math.max(1, qty - 1))}
               className="text-[#4B5563] hover:text-[#121212] transition-colors"
             >
               —
             </button>
             <span className="text-sm font-bold text-[#121212] min-w-[20px] text-center">{qty}</span>
             <button 
               type="button" 
               onClick={() => setQty(Math.min(stock, qty + 1))}
               className="text-[#4B5563] hover:text-[#121212] transition-colors"
             >
               +
             </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          disabled={loading}
          onClick={add}
          className="w-full bg-[#121212] py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] shadow-xl hover:bg-[#B8860B] transition-all duration-300 active:scale-[0.98]"
        >
          {loading ? "Syncing..." : "Add to Cart"}
        </button>
        
        {errorMsg && (
          <p className="text-center text-[10px] font-bold uppercase tracking-widest text-[#EF4444] animate-bounce">
            {errorMsg}
          </p>
        )}
        
        <p className="text-center text-[9px] font-bold tracking-[0.2em] text-[#4B5563] uppercase opacity-50">
          Secure Personal Purchase
        </p>
      </div>
    </div>
  );
}
