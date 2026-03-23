import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroCarousel } from "@/components/site/hero-carousel";
import { LegacyTransitionSection } from "@/components/site/legacy-transition-section";
import { ArrowRight, Lock, Zap, Target, BarChart3 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <PublicHeader />

      <main className="flex-1">
        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1: HERO — THE CALL TO GREATNESS
        ═══════════════════════════════════════════════════════════════════ */}
        <HeroCarousel />

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 1B: LEGACY TRANSITION — THE MINDSET
        ═══════════════════════════════════════════════════════════════════ */}
        <LegacyTransitionSection />
      </main>

      <SiteFooter />
    </div>
  );
}
