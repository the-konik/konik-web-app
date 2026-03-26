import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { NewArrivalsSection } from "@/components/homepage/sections/new-arrivals-section";
import { ToolTransformationSection } from "@/components/homepage/sections/tool-transformation-section";
import { ProductGridSection } from "@/components/homepage/sections/product-grid-section";
import { SocialProofSection } from "@/components/homepage/sections/social-proof-section";
import { LifestyleGridSection } from "@/components/homepage/sections/lifestyle-grid-section";
import { ShopOutfitSection } from "@/components/homepage/sections/shop-outfit-section";
import { ShopLegacySection } from "@/components/homepage/sections/shop-legacy-section";
import { MembershipCtaSection } from "@/components/homepage/sections/membership-cta-section";
import { SectionRenderer } from "@/components/homepage/section-renderer";
import { EngagementTracker } from "@/components/homepage/engagement-tracker";
import { getUserScore } from "@/lib/engagement/score";
import { getStage } from "@/lib/engagement/stage";
import { db } from "@/lib/db/prisma";

export default async function HomePage() {
  // 1. Detect engagement stage
  const score = await getUserScore();
  const stage = getStage(score);

  // 2. Fetch DB-configured sections for this stage
  const sections = await db.homepageSection.findMany({
    where: { stage, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const hasSections = sections.length > 0;

  // 3. Fetch real products for fallback (best sellers grid)
  const products = await db.product.findMany({
    where: { published: true, archived: false },
    orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
    take: 4,
    select: { id: true, name: true, slug: true, price: true, images: true },
  });

  const bestSellers = products.map((p) => ({
    name: p.name,
    price: `$${Number(p.price).toFixed(0)}`,
    image: p.images[0] || "/images/products/discipline-uniform.png",
    href: `/shop/${p.slug}`,
  }));

  // 4. Fetch new arrivals (most recent 2 products)
  const latestProducts = await db.product.findMany({
    where: { published: true, archived: false },
    orderBy: { createdAt: "desc" },
    take: 2,
    select: { id: true, name: true, slug: true, price: true, images: true },
  });

  const newArrivals = latestProducts.map((p) => ({
    name: p.name,
    image: p.images[0] || "/images/products/discipline-uniform.png",
    price: `$${Number(p.price).toFixed(0)}`,
    href: `/shop/${p.slug}`,
    tag: "New",
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <EngagementTracker />
      <PublicHeader />

      <main className="flex-1">
        {hasSections ? (
          <SectionRenderer sections={sections} />
        ) : (
          <>
            {/* ─── COLD Stage Fallback Layout ─── */}

            {/* 1. Hero Carousel (4 rotating slides: 3 product + 1 tool) */}
            <HeroCarousel />

            {/* 2. New Arrivals (2 cards) */}
            <NewArrivalsSection
              data={newArrivals.length > 0 ? { items: newArrivals } : {}}
            />

            {/* 3. Life Transformation with Tools */}
            <ToolTransformationSection data={{}} />

            {/* 4. Best Sellers (product grid) */}
            <ProductGridSection
              data={{
                title: "Best Sellers",
                products: bestSellers.length > 0 ? bestSellers : [],
                ctaLabel: "Shop All",
                ctaHref: "/shop",
              }}
            />

            {/* 5. Social Proof Bar */}
            <SocialProofSection data={{}} />

            {/* 6. Lifestyle Grid (4 images) */}
            <LifestyleGridSection data={{}} />

            {/* 7. Shop Outfit */}
            <ShopOutfitSection data={{}} />

            {/* 8. Shop Legacy Life */}
            <ShopLegacySection data={{}} />

            {/* 9. Become a Member CTA */}
            <MembershipCtaSection data={{}} />
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
