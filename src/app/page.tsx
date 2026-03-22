import Link from "next/link";
import Image from "next/image";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { HeroCarousel } from "@/components/site/hero-carousel";
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
            SECTION 2: BUY LEGACY (Full-Bleed Transformation Grid)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#FFFFFF] pb-0 lg:pb-0">

          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-0">
            {/* Left side: Cloth Product */}
            <div className="relative group overflow-hidden bg-[#121212] min-h-[500px] sm:min-h-[600px] lg:min-h-[800px] w-full flex items-end">
              <Image
                src="/discipline-uniform.png"
                alt="Konik Heavyweight Armor"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/20 to-transparent" />
              <div className="relative z-10 p-8 sm:p-12 lg:p-16 w-full">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#B8860B] mb-3 block">
                  New Drop
                </span>
                <h3 className="font-atmospheric text-lg sm:text-xl lg:text-[20px] text-[#FFFFFF] tracking-tighter mb-4 leading-[0.95]">
                  KONIK HEAVYWEIGHT ARMOR
                </h3>
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center bg-[#FFFFFF] text-[#121212] px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-colors"
                >
                  Shop
                </Link>
              </div>
            </div>

            {/* Right side: System */}
            <div className="relative group overflow-hidden bg-[#121212] min-h-[500px] sm:min-h-[600px] lg:min-h-[800px] w-full flex items-end">
              <Image
                src="/hero-tools.png"
                alt="Legacy Life Builder"
                fill
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/20 to-transparent" />
              <div className="relative z-10 p-8 sm:p-12 lg:p-16 w-full">
                <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#B8860B] mb-3 block">
                  Best Planner
                </span>
                <h3 className="font-atmospheric text-lg sm:text-xl lg:text-[20px] text-[#FFFFFF] tracking-tighter mb-4 leading-[0.95]">
                  LEGACY LIFE BUILDER
                </h3>
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center bg-[#FFFFFF] text-[#121212] px-8 sm:px-10 py-3.5 sm:py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-colors"
                >
                  Shop
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 4: THE LEGACY STORY
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#FFFFFF] py-20 sm:py-28 lg:py-36 px-6 sm:px-8 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              {/* Image */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden order-2 lg:order-1">
                <Image
                  src="/hero-levelup.png"
                  alt="Build a legacy that lasts"
                  fill
                  className="object-cover grayscale"
                  quality={85}
                />
              </div>

              {/* Copy */}
              <div className="order-1 lg:order-2">
                <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-4 block">
                  The KONIK Story
                </span>
                <h2 className="font-atmospheric text-3xl sm:text-4xl lg:text-5xl text-[#121212] tracking-tight leading-[1.05] mb-8">
                  NOT JUST<br />CLOTHING.<br />
                  <span className="text-[#B8860B]">A TRANSFORMATION.</span>
                </h2>
                <p className="text-[#4B5563] text-base sm:text-lg font-light leading-relaxed mb-6">
                  KONIK exists for the man who refuses to be forgotten. We
                  provide the tools and the threads. You provide the discipline.
                </p>
                <p className="text-[#121212] text-base sm:text-lg font-medium leading-relaxed mb-10">
                  Together, we build a legacy that lasts.
                </p>
                <Link
                  href="/company"
                  className="inline-flex items-center gap-3 bg-[#121212] text-[#FFFFFF] px-10 py-4 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#121212]/90 transition-colors"
                >
                  Our Story <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 5: FINAL CTA — JOIN THE LEGACY
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#121212] py-24 sm:py-32 lg:py-40 px-6 sm:px-8 lg:px-12 text-center">
          <div className="max-w-3xl mx-auto">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-6 block">
              Legacy Membership
            </span>
            <h2 className="font-atmospheric text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF] tracking-tight leading-[1.05] mb-8">
              YOUR MOVE.
            </h2>
            <p className="text-[#FFFFFF]/60 text-base sm:text-lg font-light leading-relaxed mb-12 max-w-xl mx-auto">
              Join thousands who have already started engineering their legacy.
              Get exclusive access to drops, premium tools, and a community of
              relentless achievers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/register"
                className="bg-[#FFFFFF] text-[#121212] px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-colors"
              >
                Join The Legacy
              </Link>
              <Link
                href="/plans"
                className="border-2 border-[#FFFFFF]/30 text-[#FFFFFF] px-10 py-4 text-sm font-bold uppercase tracking-[0.2em] hover:border-[#FFFFFF] transition-colors"
              >
                View The Path
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
