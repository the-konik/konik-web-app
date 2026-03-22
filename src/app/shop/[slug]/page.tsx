import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
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
    <div className="flex min-h-screen flex-col bg-muted">
      <PublicHeader />

      <div className="mx-auto w-full max-w-5xl flex-1 px-4 py-6 pt-32 sm:px-6 sm:py-10 sm:pt-36">
        <Link
          href="/shop"
          className="mb-6 inline-block text-sm font-medium text-accent hover:underline"
        >
          ← Back to shop
        </Link>
        <div className="grid gap-10 md:grid-cols-2">
          <div className="space-y-3">
            {product.images.length > 0 ? (
              product.images.map((src, i) => (
                <div
                  key={src}
                  className="relative aspect-square overflow-hidden rounded-xl border border-border bg-white"
                >
                  <Image
                    src={src}
                    alt={`${product.name} ${i + 1}`}
                    fill
                    className="object-cover"
                    priority={i === 0}
                    sizes="(max-width:768px) 100vw, 50vw"
                  />
                </div>
              ))
            ) : (
              <div className="flex aspect-square items-center justify-center rounded-xl border border-border bg-white text-muted-foreground">
                No images
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              {PRODUCT_CATEGORY_LABELS[product.category]}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-primary">
              {product.name}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-accent">
              {formatPrice(product.price.toString())}
            </p>

            <div className="mt-6 space-y-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-primary">Stock: </span>
                {product.stock > 0 ? (
                  <span>{product.stock} available</span>
                ) : (
                  <span className="text-destructive">Out of stock</span>
                )}
              </div>
              {product.sizes.length > 0 && (
                <div>
                  <span className="font-medium text-primary">Sizes: </span>
                  {product.sizes.join(", ")}
                </div>
              )}
              {product.colors.length > 0 && (
                <div>
                  <span className="font-medium text-primary">Colors: </span>
                  {product.colors.join(", ")}
                </div>
              )}
            </div>

            <div className="mt-8 whitespace-pre-wrap text-primary/90">
              {product.description}
            </div>

            <AddToCartProduct
              productId={product.id}
              stock={product.stock}
              sizes={product.sizes}
              colors={product.colors}
            />
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
