import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { LegacyTransitionSection } from "@/components/site/legacy-transition-section";
import { SectionRenderer } from "@/components/homepage/section-renderer";
import { EngagementTracker } from "@/components/homepage/engagement-tracker";
import { getUserScore } from "@/lib/engagement/score";
import { getStage } from "@/lib/engagement/stage";
import { db } from "@/lib/db/prisma";

export default async function HomePage() {
  // 1. Detect engagement
  const score = await getUserScore();
  const stage = getStage(score);

  // 2. Fetch sections from DB
  const sections = await db.homepageSection.findMany({
    where: { stage, isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  // 3. Fallback: if DB has no sections, render the original hardcoded layout
  const hasSections = sections.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <EngagementTracker />
      <PublicHeader />
     
      <main className="flex-1">
        {hasSections ? (
          <SectionRenderer sections={sections} />
        ) : (
          <>
            {/* Graceful fallback — original layout */}
            <HeroCarousel />
            <LegacyTransitionSection />
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
