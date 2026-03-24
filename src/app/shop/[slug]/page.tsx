import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db/prisma";
import { formatPrice } from "@/lib/utils/cn";
import { PRODUCT_CATEGORY_LABELS } from "@/lib/products/constants";
import { AddToCartProduct } from "@/components/cart/add-to-cart-product";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";

type Props = { params: Promise<{ slug: string }> };

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await db.product.findUnique({
    where: { slug },
  });

  if (!product || !product.published || product.archived) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <PublicHeader />

      <div className="mx-auto w-full max-w-[1920px] flex-1 px-6 sm:px-8 lg:px-12 py-10 pt-32 sm:pt-36">
        <Link
          href="/shop"
          className="mb-8 inline-block text-[11px] font-bold tracking-[0.2em] uppercase text-[#B8860B] hover:underline"
        >
          ← Back to shop
        </Link>
        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            {product.images.length > 0 ? (
              product.images.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] shadow-sm group"
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority={i === 0}
                    sizes="(max-width:1024px) 100vw, 50vw"
                  />
                </div>
              ))
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-xl border border-[#E5E7EB] bg-[#FFFFFF] text-[#4B5563] text-sm font-medium">
                No images available
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#4B5563] mb-3">
                {PRODUCT_CATEGORY_LABELS[product.category]}
              </p>
              <h1 className="font-atmospheric text-4xl sm:text-5xl text-[#121212] tracking-tight leading-tight">
                {product.name.toUpperCase()}
              </h1>
              <p className="mt-6 text-3xl font-bold text-[#B8860B] tracking-tight">
                {formatPrice(product.price.toString())}
              </p>
            </div>

            <div className="space-y-6 border-y border-[#E5E7EB] py-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] font-bold tracking-widest uppercase text-[#121212] min-w-[100px]">Stock Status</span>
                {product.stock > 0 ? (
                  <span className="text-sm font-medium text-[#059669] bg-[#E1F5FE]/0 px-0">In Stock — {product.stock} available</span>
                ) : (
                  <span className="text-sm font-bold uppercase tracking-widest text-[#EF4444]">Out of stock</span>
                )}
              </div>
              {product.sizes.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#121212] min-w-[100px]">Available Sizes</span>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <span key={s} className="px-3 py-1 bg-[#FFFFFF] border border-[#E5E7EB] text-xs font-bold text-[#121212]">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {product.colors.length > 0 && (
                <div className="flex items-center gap-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#121212] min-w-[100px]">Colors</span>
                  <span className="text-sm text-[#4B5563] font-medium">{product.colors.join(", ")}</span>
                </div>
              )}
            </div>

            <div className="whitespace-pre-wrap text-sm text-[#4B5563] leading-relaxed max-w-xl pb-4">
              {product.description}
            </div>

            <AddToCartProduct
              productId={product.id}
              stock={product.stock}
              sizes={product.sizes}
              colors={product.colors}
            />
            
            <div className="pt-10 border-t border-[#E5E7EB] grid grid-cols-2 gap-8">
              <div>
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#121212] mb-3">Shipping</h3>
                <p className="text-xs text-[#4B5563] leading-snug">Orders are processed within 24-48 business hours.</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#121212] mb-3">Returns</h3>
                <p className="text-xs text-[#4B5563] leading-snug">30-day return policy for unused products in original packaging.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
