import Image from "next/image";
import Link from "next/link";
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

export function ProductCard({ product }: { product: ShopProductCard }) {
  const img = product.images[0];
  const outOfStock = product.stock <= 0;

  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition hover:border-accent hover:shadow-md"
    >
      <div className="relative aspect-[4/5] bg-muted">
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
          <span className="absolute bottom-2 left-2 rounded bg-primary/90 px-2 py-0.5 text-xs text-primary-foreground">
            Out of stock
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {PRODUCT_CATEGORY_LABELS[product.category]}
        </p>
        <h3 className="mt-1 font-semibold text-primary group-hover:text-accent transition line-clamp-2">
          {product.name}
        </h3>
        <p className="mt-2 text-lg font-bold text-primary">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}
