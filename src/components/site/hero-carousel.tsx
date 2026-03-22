"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { Pause, Play, ChevronLeft, ChevronRight } from "lucide-react";

const HERO_SLIDES = [
  {
    image: "/hero-legacy.png",
    headline: "BUILD YOUR LEGACY.",
    subtext:
      "Average is a choice. Greatness is a system. Equip yourself with the uniform and the architecture of a disciplined life.",
    cta1: { label: "Shop The Collection", href: "/shop" },
    cta2: { label: "Start Your System", href: "/tools" },
  },
  {
    image: "/discipline-uniform.png",
    headline: "WEAR THE DISCIPLINE.",
    subtext:
      "Every rep. Every set. Every early morning. Your armor should match your ambition.",
    cta1: { label: "Shop Now", href: "/shop" },
    cta2: { label: "Explore The Drop", href: "/shop" },
  },
  {
    image: "/hero-mustang.png",
    headline: "ENGINEER YOUR LIFE.",
    subtext:
      "Systems beat motivation. Build the habits, track the progress, and never look back.",
    cta1: { label: "The Systems", href: "/tools" },
    cta2: { label: "Choose Your Path", href: "/plans" },
  },
];

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
  }),
  center: {
    x: 0,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  }),
};

export function HeroCarousel() {
  const [[current, direction], setPage] = useState([0, 0]);
  const [isPaused, setIsPaused] = useState(false);

  const goNext = useCallback(() => {
    setPage(([prev]) => [(prev + 1) % HERO_SLIDES.length, 1]);
  }, []);

  const goPrev = useCallback(() => {
    setPage(([prev]) => [(prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, -1]);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(goNext, 5000);
    return () => clearInterval(timer);
  }, [isPaused, goNext]);

  const slide = HERO_SLIDES[current];

  return (
    <section className="relative min-h-screen flex items-end overflow-hidden bg-[#121212]">
      {/* Full-bleed background with sliding animation */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 z-0"
        >
          <Image
            src={slide.image}
            alt={slide.headline}
            fill
            className="object-cover"
            priority
            quality={100}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/90 via-[#121212]/40 to-[#121212]/30" />
        </motion.div>
      </AnimatePresence>

      {/* Bottom-left aligned content (Carnage style) */}
      <div className="relative z-10 w-full px-6 sm:px-10 lg:px-16 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-[1440px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            >
              <h1 className="font-atmospheric text-4xl sm:text-5xl md:text-6xl lg:text-[72px] text-[#FFFFFF] tracking-tighter leading-[0.95] mb-4">
                {slide.headline}
              </h1>
              <p className="max-w-lg text-sm sm:text-base text-[#FFFFFF]/75 font-light leading-relaxed mb-8">
                {slide.subtext}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <Link
                  href={slide.cta1.href}
                  className="bg-[#FFFFFF] text-[#121212] px-7 sm:px-9 py-3 sm:py-3.5 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-[#F8F8F8] transition-colors"
                >
                  {slide.cta1.label}
                </Link>
                <Link
                  href={slide.cta2.href}
                  className="border-2 border-[#FFFFFF] text-[#FFFFFF] px-7 sm:px-9 py-3 sm:py-3.5 text-[12px] sm:text-[13px] font-bold uppercase tracking-[0.15em] hover:bg-[#FFFFFF]/10 transition-colors"
                >
                  {slide.cta2.label}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Nike-style controls — bottom right */}
      <div className="absolute bottom-6 sm:bottom-8 right-6 sm:right-10 lg:right-16 z-20 flex items-center gap-2">
        {/* Pause / Play */}
        <button
          onClick={() => setIsPaused((p) => !p)}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition-all"
          aria-label={isPaused ? "Play" : "Pause"}
        >
          {isPaused ? (
            <Play className="w-4 h-4 sm:w-5 sm:h-5 ml-0.5" fill="#FFFFFF" />
          ) : (
            <Pause className="w-4 h-4 sm:w-5 sm:h-5" fill="#FFFFFF" />
          )}
        </button>

        {/* Prev */}
        <button
          onClick={goPrev}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition-all"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>

        {/* Next */}
        <button
          onClick={goNext}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[#FFFFFF]/40 flex items-center justify-center text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition-all"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Slide indicator dots */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > current ? 1 : -1])}
            className={`h-[3px] rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-[#FFFFFF]" : "w-4 bg-[#FFFFFF]/40 hover:bg-[#FFFFFF]/60"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
