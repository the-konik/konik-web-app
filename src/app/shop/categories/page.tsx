import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Shop Categories | KONIK",
  description:
    "Browse KONIK clothing categories — T-Shirts, Hoodies, Jackets, Pants, and Accessories.",
};

const CATEGORIES = [
  {
    slug: "T_SHIRT",
    label: "T-Shirts",
    tagline: "The daily uniform of discipline.",
    image: "/images/products/discipline-uniform.png",
  },
  {
    slug: "HOODIE",
    label: "Hoodies",
    tagline: "Built for the cold mornings and late nights.",
    image: "/images/hero/hero-legacy.png",
  },
  {
    slug: "JACKET",
    label: "Jackets",
    tagline: "Armor for the man on a mission.",
    image: "/images/hero/hero-mustang.png",
  },
  {
    slug: "PANTS",
    label: "Pants",
    tagline: "Move without limits. Look without compromise.",
    image: "/images/hero/hero-training.png",
  },
  {
    slug: "ACCESSORIES",
    label: "Accessories",
    tagline: "Details that separate the intentional.",
    image: "/images/hero/hero-tools.png",
  },
] as const;

export default function CategoriesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#121212] px-6 sm:px-8 lg:px-12 py-20 pt-32 sm:pt-36 lg:pt-40">
          <div className="max-w-[1920px] mx-auto">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-4 block">
              The Collections
            </span>
            <h1 className="font-atmospheric text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF] tracking-tight leading-[1.05] mb-6">
              FIND YOUR
              <br />
              <span className="text-[#B8860B]">UNIFORM.</span>
            </h1>
            <p className="text-[#FFFFFF]/60 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              Every piece is engineered for the man building a deliberate life.
              Choose your category and gear up.
            </p>
          </div>
        </section>

        {/* Category grid */}
        <section className="px-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={`relative group overflow-hidden min-h-[400px] sm:min-h-[500px] flex items-end ${
                  i === 0 ? "md:col-span-2 lg:col-span-2" : ""
                }`}
              >
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-[#121212]/20 to-transparent group-hover:from-[#121212]/90 transition-colors duration-500" />
                <div className="relative z-10 p-8 sm:p-10 w-full">
                  <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#B8860B] mb-2 block">
                    {cat.tagline}
                  </span>
                  <h2 className="font-atmospheric text-2xl sm:text-3xl text-[#FFFFFF] tracking-tight mb-4">
                    {cat.label}
                  </h2>
                  <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.15em] text-[#FFFFFF] group-hover:text-[#B8860B] transition-colors">
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-[#F8F8F8] py-20 sm:py-24 px-6 sm:px-8 lg:px-12 text-center">
          <div className="max-w-2xl mx-auto">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-4 block">
              Can&apos;t Decide?
            </span>
            <h2 className="font-atmospheric text-3xl sm:text-4xl text-[#121212] tracking-tight leading-[1.1] mb-6">
              VIEW ALL PRODUCTS
            </h2>
            <Link
              href="/shop"
              className="inline-flex items-center gap-3 bg-[#121212] text-[#FFFFFF] px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#121212]/90 transition-colors"
            >
              Shop All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
