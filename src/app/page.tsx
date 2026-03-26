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
import { SystemsSection } from "@/components/homepage/sections/systems-section";
import { CTASection } from "@/components/homepage/sections/cta-section";
import { RecommendationsSection } from "@/components/homepage/sections/recommendations-section";
import { SpecialOfferSection } from "@/components/homepage/sections/special-offer-section";
import { NewUpdatesSection } from "@/components/homepage/sections/new-updates-section";
import { UpcomingEventsSection } from "@/components/homepage/sections/upcoming-events-section";
import { LoyaltyAboutSection } from "@/components/homepage/sections/loyalty-about-section";
import { SectionRenderer } from "@/components/homepage/section-renderer";
import { EngagementTracker } from "@/components/homepage/engagement-tracker";
import { getUserScore } from "@/lib/engagement/score";
import { getStage } from "@/lib/engagement/stage";
import { db } from "@/lib/db/prisma";
import { auth } from "@/lib/auth/auth";

export const dynamic = "force-dynamic"; // always re-render based on current score

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

  // 3. Check if user is logged in (for WARM conditional)
  const session = await auth();
  const isLoggedIn = !!session?.user;

  // 4. Fetch real products for grids
  const [products, latestProducts, tools] = await Promise.all([
    db.product.findMany({
      where: { published: true, archived: false },
      orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      take: 4,
      select: { id: true, name: true, slug: true, price: true, images: true },
    }),
    db.product.findMany({
      where: { published: true, archived: false },
      orderBy: { createdAt: "desc" },
      take: 2,
      select: { id: true, name: true, slug: true, price: true, images: true },
    }),
    db.tool.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      take: 3,
      select: { id: true, name: true, slug: true, description: true },
    }),
  ]);

  const bestSellers = products.map((p) => ({
    name: p.name,
    price: `$${Number(p.price).toFixed(0)}`,
    image: p.images[0] || "/images/products/discipline-uniform.png",
    href: `/shop/${p.slug}`,
  }));

  const newArrivals = latestProducts.map((p) => ({
    name: p.name,
    image: p.images[0] || "/images/products/discipline-uniform.png",
    price: `$${Number(p.price).toFixed(0)}`,
    href: `/shop/${p.slug}`,
    tag: "New",
  }));

  const toolCards = tools.map((t) => ({
    name: t.name,
    benefit: t.description?.slice(0, 40) || "Level up your life",
    userCount: `${Math.floor(Math.random() * 3000 + 500)} users`,
    icon: "wrench",
    href: `/tools/${t.slug}`,
  }));

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <EngagementTracker />
      <PublicHeader />

      <main className="flex-1">
        {hasSections ? (
          <SectionRenderer sections={sections} />
        ) : stage === "COLD" ? (
          <>
            {/* ─── COLD: Discovery & Trust ─── */}
            <HeroCarousel />
            <NewArrivalsSection data={newArrivals.length > 0 ? { items: newArrivals } : {}} />
            <ToolTransformationSection data={{}} />
            <ProductGridSection data={{ title: "Best Sellers", products: bestSellers, ctaLabel: "Shop All", ctaHref: "/shop" }} />
            <SocialProofSection data={{}} />
            <LifestyleGridSection data={{}} />
            <ShopOutfitSection data={{}} />
            <ShopLegacySection data={{}} />
            <MembershipCtaSection data={{}} />
          </>
        ) : stage === "WARM" ? (
          <>
            {/* ─── WARM: Engagement & Decision ─── */}
            <HeroCarousel />
            {!isLoggedIn && <ShopLegacySection data={{ headline: "Shop Legacy Life", cta: "Join Now", ctaHref: "/auth/register" }} />}
            <ToolTransformationSection data={{}} />
            <NewArrivalsSection data={newArrivals.length > 0 ? { items: newArrivals } : {}} />
            <LifestyleGridSection data={{}} />
            <ShopOutfitSection data={{}} />
            {toolCards.length > 0 ? (
              <SystemsSection data={{ title: "Usage", systems: toolCards }} />
            ) : (
              <SystemsSection data={{ title: "Usage" }} />
            )}
            <SocialProofSection data={{}} />
            <CTASection data={{ title: "Level Up Life With Tools", button: "Explore Systems", href: "/tools" }} />
          </>
        ) : (
          <>
            {/* ─── HOT: Conversion & Loyalty ─── */}
            <HeroCarousel />
            <RecommendationsSection data={{ products: bestSellers }} />
            <NewArrivalsSection data={newArrivals.length > 0 ? { items: newArrivals } : {}} />
            <SpecialOfferSection data={{}} />
            <NewUpdatesSection data={{ updates: [] }} />
            <UpcomingEventsSection data={{ events: [] }} />
            <LoyaltyAboutSection data={{}} />
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
