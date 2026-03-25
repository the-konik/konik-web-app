/**
 * Seed script for HomepageSection table.
 *
 * Run:  npx tsx prisma/seed-homepage.ts
 */

import { PrismaClient } from "../src/generated/prisma";

const db = new PrismaClient();

async function main() {
  console.log("🌱 Seeding HomepageSection table...\n");

  // Clear existing sections
  await db.homepageSection.deleteMany();

  // ─── COLD Stage (Discovery Engine) ───────────────────────────────
  const coldSections = [
    {
      stage: "COLD" as const,
      sectionType: "HERO_CAROUSEL",
      content: {},
      sortOrder: 1,
    },
    {
      stage: "COLD" as const,
      sectionType: "LEGACY_TRANSITION",
      content: {},
      sortOrder: 2,
    },
    {
      stage: "COLD" as const,
      sectionType: "IDENTITY",
      content: {
        title: "This is not fashion.",
        subtitle: "This is your operating system.",
        points: [
          "No discipline → No progress",
          "No system → No consistency",
          "No identity → No legacy",
        ],
        cta: "Fix It Now",
        ctaHref: "/tools",
      },
      sortOrder: 3,
    },
    {
      stage: "COLD" as const,
      sectionType: "LIFESTYLE",
      content: {
        title: "The Lifestyle",
        subtitle: "Engineered for the modern man.",
        images: [
          { src: "/images/hero/hero-legacy.png", label: "Legacy Life", href: "/shop" },
          { src: "/images/hero/hero-training.png", label: "Training Edge", href: "/shop?category=APPAREL" },
          { src: "/images/hero/hero-footwear.png", label: "Daily Rotation", href: "/shop?category=FOOTWEAR" },
        ],
        cta: "Explore The World",
        ctaHref: "/shop",
      },
      sortOrder: 4,
    },
    {
      stage: "COLD" as const,
      sectionType: "CATEGORY_PREVIEW",
      content: {
        title: "Shop by Category",
        categories: [
          { name: "Apparel", image: "/images/hero/hero-legacy.png", href: "/shop?category=APPAREL" },
          { name: "Footwear", image: "/images/hero/hero-footwear.png", href: "/shop?category=FOOTWEAR" },
          { name: "Accessories", image: "/images/hero/hero-accessories.png", href: "/shop?category=ACCESSORIES" },
          { name: "Systems", image: "/images/sections/system-legacy.png", href: "/tools" },
        ],
      },
      sortOrder: 5,
    },
    {
      stage: "COLD" as const,
      sectionType: "PRODUCT_GRID",
      content: {
        title: "The Collection",
        subtitle: "Curated for the disciplined",
        ctaLabel: "Shop All",
        ctaHref: "/shop",
        products: [],
      },
      sortOrder: 6,
    },
    {
      stage: "COLD" as const,
      sectionType: "CTA",
      content: {
        title: "Your life won't change by itself.",
        subtitle: "Join the men who chose discipline over comfort.",
        button: "Start Your Legacy",
        href: "/auth/register",
      },
      sortOrder: 7,
    },
  ];

  // ─── WARM Stage (Decision Engine) ────────────────────────────────
  const warmSections = [
    {
      stage: "WARM" as const,
      sectionType: "HERO_CAROUSEL",
      content: {},
      sortOrder: 1,
    },
    {
      stage: "WARM" as const,
      sectionType: "PRODUCT_GRID",
      content: {
        title: "Best Sellers",
        subtitle: "What disciplined men are wearing",
        ctaLabel: "View All",
        ctaHref: "/shop",
        products: [],
      },
      sortOrder: 2,
    },
    {
      stage: "WARM" as const,
      sectionType: "SOCIAL_PROOF",
      content: {
        stats: [
          { value: "10K+", label: "Men Building Legacy" },
          { value: "98%", label: "Satisfaction Rate" },
          { value: "50+", label: "Countries Worldwide" },
        ],
        testimonials: [
          { quote: "KONIK changed how I think about getting dressed. It's not fashion — it's armor.", name: "Ravindu M.", role: "Entrepreneur" },
          { quote: "The systems alone are worth more than any course I've paid for.", name: "Kasun D.", role: "Software Engineer" },
          { quote: "Finally a brand that matches my mindset. No fluff, just results.", name: "Ashan P.", role: "Fitness Coach" },
        ],
      },
      sortOrder: 3,
    },
    {
      stage: "WARM" as const,
      sectionType: "COMPARISON",
      content: {
        title: "KONIK vs The Rest",
        subtitle: "See why disciplined men choose us.",
        rows: [
          { feature: "Premium Quality Fabrics", konik: true, others: false },
          { feature: "Life Systems & Tools", konik: true, others: false },
          { feature: "Identity-Driven Design", konik: true, others: false },
          { feature: "Discipline Community", konik: true, others: false },
          { feature: "Generic Hype Marketing", konik: false, others: true },
        ],
      },
      sortOrder: 4,
    },
    {
      stage: "WARM" as const,
      sectionType: "BUNDLES",
      content: {
        title: "Bundle & Save",
        subtitle: "Curated sets for maximum impact.",
        bundles: [],
      },
      sortOrder: 5,
    },
    {
      stage: "WARM" as const,
      sectionType: "SYSTEMS",
      content: {
        title: "The Systems",
        subtitle: "Tools engineered for disciplined men.",
        tools: [
          { name: "Legacy Life Builder", description: "Map your goals, build habits, and architect your legacy.", icon: "target", href: "/tools" },
          { name: "Budget Planner", description: "Take control of every dollar. Build wealth systematically.", icon: "chart", href: "/tools" },
          { name: "Habit Architect", description: "Design daily routines that compound into greatness.", icon: "cpu", href: "/tools" },
          { name: "Focus Sessions", description: "Deep work timer with discipline tracking.", icon: "zap", href: "/tools" },
        ],
      },
      sortOrder: 6,
    },
    {
      stage: "WARM" as const,
      sectionType: "CTA",
      content: {
        title: "Ready to commit?",
        subtitle: "First purchase = 40% off. No excuses.",
        button: "Claim Your Discount",
        href: "/shop",
      },
      sortOrder: 7,
    },
  ];

  // ─── HOT Stage (Retention Engine) ────────────────────────────────
  const hotSections = [
    {
      stage: "HOT" as const,
      sectionType: "HERO_CAROUSEL",
      content: {},
      sortOrder: 1,
    },
    {
      stage: "HOT" as const,
      sectionType: "QUICK_ACTIONS",
      content: {
        actions: [
          { label: "Shop", href: "/shop", icon: "shop", description: "Browse the collection" },
          { label: "My Tools", href: "/dashboard", icon: "tools", description: "Access your systems" },
          { label: "Orders", href: "/dashboard/orders", icon: "orders", description: "Track your orders" },
          { label: "Wishlist", href: "/wishlist", icon: "wishlist", description: "Saved items" },
        ],
      },
      sortOrder: 2,
    },
    {
      stage: "HOT" as const,
      sectionType: "PRODUCT_GRID",
      content: {
        title: "New Drops",
        subtitle: "Fresh gear for your rotation",
        ctaLabel: "Shop New",
        ctaHref: "/shop",
        products: [],
      },
      sortOrder: 3,
    },
    {
      stage: "HOT" as const,
      sectionType: "USER_SYSTEMS",
      content: {
        title: "Your Systems",
        subtitle: "Continue where you left off.",
      },
      sortOrder: 4,
    },
    {
      stage: "HOT" as const,
      sectionType: "RECOMMENDATIONS",
      content: {
        title: "Picked for You",
        subtitle: "Based on your style and purchases.",
        ctaLabel: "View All Recommendations",
        ctaHref: "/shop",
      },
      sortOrder: 5,
    },
    {
      stage: "HOT" as const,
      sectionType: "LOYALTY_STATUS",
      content: {
        title: "Your Legacy Status",
      },
      sortOrder: 6,
    },
    {
      stage: "HOT" as const,
      sectionType: "CTA",
      content: {
        title: "Level up your membership.",
        subtitle: "Unlock exclusive tools, early access, and more.",
        button: "Upgrade Now",
        href: "/plans",
      },
      sortOrder: 7,
    },
  ];

  const allSections = [...coldSections, ...warmSections, ...hotSections];

  for (const section of allSections) {
    await db.homepageSection.create({ data: section });
  }

  console.log(`✅ Created ${allSections.length} homepage sections:`);
  console.log(`   COLD: ${coldSections.length} sections`);
  console.log(`   WARM: ${warmSections.length} sections`);
  console.log(`   HOT:  ${hotSections.length} sections`);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
