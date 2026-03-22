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
            SECTION 2: THE UNIFORM OF DISCIPLINE (Transformation Grid)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#FFFFFF] py-20 sm:py-28 lg:py-10 px-6 sm:px-8 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            {/* Section header */}
            <div className="mb-16 sm:mb-20">
              <h2 className="font-atmospheric text-xl sm:text-xl lg:text-2xl text-[#121212] tracking-tight leading-[1.05] mb-6">
                Buy Legacy.
              </h2>
            </div>

            {/* Nike-style Split Banner Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Large feature card */}
              <div className="relative group overflow-hidden bg-[#F8F8F8] aspect-[4/5] sm:aspect-[3/4] lg:aspect-auto lg:row-span-2">
                <Image
                  src="/discipline-uniform.png"
                  alt="Konik Heavyweight Armor"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-10">
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B8860B] mb-2 block">
                    New Drop
                  </span>
                  <h3 className="font-atmospheric text-2xl sm:text-3xl text-[#FFFFFF] tracking-tight mb-2">
                    KONIK HEAVYWEIGHT ARMOR
                  </h3>
                  <p className="text-[#FFFFFF]/70 text-sm mb-6 max-w-sm">
                    For the early mornings. For the grind that never stops.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-[#FFFFFF] text-xs font-bold uppercase tracking-[0.2em] hover:gap-4 transition-all"
                  >
                    Shop Now <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Two smaller cards */}
              <div className="relative group overflow-hidden bg-[#F8F8F8] aspect-[16/9] sm:aspect-[2/1]">
                <div className="absolute inset-0 bg-[#121212]" />
                <div className="relative z-10 flex flex-col justify-center h-full p-6 sm:p-10">
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B8860B] mb-2 block">
                    Essentials
                  </span>
                  <h3 className="font-atmospheric text-xl sm:text-2xl text-[#FFFFFF] tracking-tight mb-2">
                    THE DISCIPLINE TEE
                  </h3>
                  <p className="text-[#FFFFFF]/60 text-sm mb-4 max-w-xs">
                    Clean. Minimal. The foundation of every outfit.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-[#FFFFFF] text-xs font-bold uppercase tracking-[0.2em] hover:gap-4 transition-all"
                  >
                    Explore <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              <div className="relative group overflow-hidden bg-[#F8F8F8] aspect-[16/9] sm:aspect-[2/1]">
                <div className="absolute inset-0 bg-[#F8F8F8]" />
                <div className="relative z-10 flex flex-col justify-center h-full p-6 sm:p-10">
                  <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#B8860B] mb-2 block">
                    Limited Edition
                  </span>
                  <h3 className="font-atmospheric text-xl sm:text-2xl text-[#121212] tracking-tight mb-2">
                    LEGACY COLLECTION
                  </h3>
                  <p className="text-[#4B5563] text-sm mb-4 max-w-xs">
                    Built for the few. Designed for those who refuse to be forgotten.
                  </p>
                  <Link
                    href="/shop"
                    className="inline-flex items-center gap-2 text-[#121212] text-xs font-bold uppercase tracking-[0.2em] hover:gap-4 transition-all"
                  >
                    View Collection <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════════════
            SECTION 3: MASTER YOUR ARCHITECTURE (Systems / Tools)
        ═══════════════════════════════════════════════════════════════════ */}
        <section className="bg-[#121212] py-20 sm:py-28 lg:py-36 px-6 sm:px-8 lg:px-12">
          <div className="max-w-[1440px] mx-auto">
            {/* Section header */}
            <div className="mb-16 sm:mb-20 text-center">
              <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-4 block">
                The Blueprint
              </span>
              <h2 className="font-atmospheric text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF] tracking-tight leading-[1.05] mb-6">
                MASTER YOUR<br />ARCHITECTURE.
              </h2>
              <p className="max-w-2xl mx-auto text-[#FFFFFF]/60 text-base sm:text-lg font-light leading-relaxed">
                A powerful life isn&apos;t an accident; it&apos;s engineered.
                Access the digital systems designed to track your habits, focus
                your mind, and build your empire.
              </p>
            </div>

            {/* Tool Modules Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "HABIT ENGINE",
                  desc: "Track, build, and never break the chain. 30-day streak systems.",
                  locked: false,
                },
                {
                  icon: <Target className="w-6 h-6" />,
                  title: "GOAL ARCHITECT",
                  desc: "Set targets. Reverse-engineer your path. Execute with precision.",
                  locked: false,
                },
                {
                  icon: <BarChart3 className="w-6 h-6" />,
                  title: "LEGACY PLANNER",
                  desc: "Weekly systems for productivity, discipline, and deep focus sessions.",
                  locked: true,
                },
                {
                  icon: <Lock className="w-6 h-6" />,
                  title: "MIND FORGE",
                  desc: "Journaling, reflection, and mental architecture for peak clarity.",
                  locked: true,
                },
              ].map((tool) => (
                <div
                  key={tool.title}
                  className={`relative border p-8 sm:p-10 flex flex-col transition-all group ${
                    tool.locked
                      ? "border-[#FFFFFF]/10 hover:border-[#B8860B]/30"
                      : "border-[#FFFFFF]/20 hover:border-[#B8860B]/60"
                  }`}
                >
                  {tool.locked && (
                    <div className="absolute top-4 right-4">
                      <span className="bg-[#B8860B]/20 text-[#B8860B] text-[10px] font-bold uppercase tracking-[0.2em] px-3 py-1">
                        VIP
                      </span>
                    </div>
                  )}
                  <div className={`mb-6 ${tool.locked ? "text-[#FFFFFF]/30" : "text-[#B8860B]"}`}>
                    {tool.icon}
                  </div>
                  <h3 className={`font-atmospheric text-lg tracking-tight mb-3 ${
                    tool.locked ? "text-[#FFFFFF]/40" : "text-[#FFFFFF]"
                  }`}>
                    {tool.title}
                  </h3>
                  <p className={`text-sm leading-relaxed mb-8 flex-1 ${
                    tool.locked ? "text-[#FFFFFF]/20" : "text-[#FFFFFF]/50"
                  }`}>
                    {tool.desc}
                  </p>
                  <Link
                    href={tool.locked ? "/plans" : "/tools"}
                    className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] transition-all hover:gap-4 ${
                      tool.locked
                        ? "text-[#B8860B]/60 hover:text-[#B8860B]"
                        : "text-[#FFFFFF] hover:text-[#B8860B]"
                    }`}
                  >
                    {tool.locked ? "Unlock System" : "Own The System"} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
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
                <h2 className="font-atmospheric text-4xl sm:text-5xl lg:text-6xl text-[#121212] tracking-tight leading-[1.05] mb-8">
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
