"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { useSession } from "next-auth/react";
import { formatPrice } from "@/lib/utils";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/products/constants";
import type { ProductCategory } from "@prisma/client";

export type ShopProductCard = {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: ProductCategory;
  images: string[];
  sizes: string[];
  stock: number;
};

export function ProductCard({ product, initialWishlisted = false }: { product: ShopProductCard, initialWishlisted?: boolean }) {
  const { data: session } = useSession();
  const [isWishlisted, setIsWishlisted] = useState(initialWishlisted);
  const [loading, setLoading] = useState(false);

  const img = product.images[0];
  const outOfStock = product.stock <= 0;

  async function toggleWishlist(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      window.location.href = `/auth/login?callbackUrl=${window.location.pathname}`;
      return;
    }

    setLoading(true);
    try {
      if (isWishlisted) {
        await fetch("/api/wishlist", {
          method: "DELETE",
          body: JSON.stringify({ productId: product.id }),
        });
        setIsWishlisted(false);
      } else {
        await fetch("/api/wishlist", {
          method: "POST",
          body: JSON.stringify({ productId: product.id }),
        });
        setIsWishlisted(true);
      }
    } catch (err) {
      console.error("Wishlist error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative group">
      <Link
        href={`/shop/${product.slug}`}
        className="flex flex-col h-full overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:border-accent hover:shadow-md"
      >
        <div className="relative aspect-[4/5] bg-muted overflow-hidden">
          {img ? (
            <Image
              src={img}
              alt={product.name}
              fill
              className="object-cover transition group-hover:scale-[1.02]"
              sizes="(max-width:768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
              No image
            </div>
          )}
          
          {outOfStock && (
            <span className="absolute bottom-2 left-2 rounded bg-primary/90 px-2 py-0.5 text-xs text-primary-foreground font-poppins">
              Out of stock
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#B8860B] font-poppins">
            {PRODUCT_CATEGORY_LABELS[product.category]}
          </p>
          <h3 className="mt-1 font-bold text-[#121212] group-hover:text-[#B8860B] transition line-clamp-2 font-poppins text-sm leading-tight">
            {product.name}
          </h3>
          <p className="mt-auto pt-3 text-base font-bold text-[#121212] font-poppins">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      <button
        onClick={toggleWishlist}
        disabled={loading}
        className={`absolute top-3 right-3 p-2.5 rounded-full transition-all duration-300 z-10 ${
          isWishlisted 
            ? "bg-[#121212] text-white" 
            : "bg-white/80 backdrop-blur-sm text-[#121212] hover:bg-white hover:scale-110 shadow-sm"
        }`}
      >
        <Heart 
          className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} 
          strokeWidth={2}
        />
      </button>
    </div>
  );
}
