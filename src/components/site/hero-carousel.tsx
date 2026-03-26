"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Hero Carousel — full-viewport, cinematic, 4 auto-rotating slides.
 * Slide 1-3: Product categories (Apparel, Footwear, Accessories)
 * Slide 4: Digital Systems (tool)
 * IMAGE: 1920×1080 desktop (16:9), 1080×1920 mobile (9:16)
 * Content differs per stage (COLD/WARM/HOT) via admin.
 */
const HERO_SLIDES = [
  {
    image: "/images/homepage/hero-apparel.png",
    headline: "BUILD YOUR LEGACY.",
    subtitle: "Apparel",
    cta: { label: "Shop Apparel", href: "/shop?category=APPAREL" },
  },
  {
    image: "/images/homepage/hero-footwear.png",
    headline: "STEP INTO DISCIPLINE.",
    subtitle: "Footwear",
    cta: { label: "Shop Footwear", href: "/shop?category=FOOTWEAR" },
  },
  {
    image: "/images/homepage/hero-accessories.png",
    headline: "COMPLETE THE UNIFORM.",
    subtitle: "Accessories",
    cta: { label: "Shop Accessories", href: "/shop?category=ACCESSORIES" },
  },
  {
    image: "/images/homepage/hero-tools.png",
    headline: "ENGINEER YOUR LIFE.",
    subtitle: "Digital Systems",
    cta: { label: "Explore Systems", href: "/tools" },
  },
];

const variants: Variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 0.6,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 0.6,
    transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
  }),
};

export function HeroCarousel() {
  const [[current, direction], setPage] = useState([0, 0]);

  const goNext = useCallback(() => {
    setPage(([prev]) => [(prev + 1) % HERO_SLIDES.length, 1]);
  }, []);

  const goPrev = useCallback(() => {
    setPage(([prev]) => [(prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length, -1]);
  }, []);

  useEffect(() => {
    const timer = setInterval(goNext, 6000);
    return () => clearInterval(timer);
  }, [goNext]);

  const slide = HERO_SLIDES[current];
  const isTool = current === 3;

  return (
    <section className="relative h-screen flex items-end overflow-hidden bg-[#121212]">
      {/* Full-bleed 16:9 background */}
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
            className="object-cover object-right sm:object-center"
            priority
            quality={85}
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#121212] via-[#121212]/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Headline + subtitle + 1 CTA */}
      <div className="relative z-10 w-full px-5 sm:px-10 lg:px-16 pb-12 sm:pb-16 lg:pb-20">
        <div className="max-w-[1440px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="max-w-xl"
            >
              {/* Category tag */}
              <span
                className={`inline-block px-2.5 py-0.5 rounded-sm uppercase tracking-[0.15em] font-bold font-poppins mb-3 ${
                  isTool ? "bg-[#B8860B]/80 text-[#FFFFFF]" : "bg-[#FFFFFF]/10 text-[#FFFFFF]"
                }`}
                style={{ fontSize: "var(--text-2xs)" }}
              >
                {slide.subtitle}
              </span>

              <h1
                className="font-atmospheric text-[#FFFFFF] tracking-[0.08em] leading-tight mb-5 sm:mb-6"
                style={{ fontSize: "var(--atm-hero)" }}
              >
                <span className="sm:hidden">{slide.headline}</span>
                <span className="hidden sm:inline lg:hidden" style={{ fontSize: "var(--atm-display)" }}>{slide.headline}</span>
                <span className="hidden lg:inline" style={{ fontSize: "var(--atm-mega)" }}>{slide.headline}</span>
              </h1>

              <Link
                href={slide.cta.href}
                className="inline-block bg-[#FFFFFF] text-[#121212] px-7 sm:px-9 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
                style={{ fontSize: "var(--text-xs)" }}
              >
                {slide.cta.label}
              </Link>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Slide indicators — 4 dots */}
      <div className="absolute bottom-5 sm:bottom-7 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {HERO_SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setPage([i, i > current ? 1 : -1])}
            className={`h-[2px] rounded-full transition-all duration-300 ${
              i === current ? "w-8 bg-[#FFFFFF]" : "w-4 bg-[#FFFFFF]/30"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Nav arrows — desktop only */}
      <div className="absolute bottom-6 right-10 lg:right-16 z-20 hidden md:flex items-center gap-2">
        <button
          onClick={goPrev}
          className="w-10 h-10 rounded-full border border-[#FFFFFF]/30 flex items-center justify-center text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition-all duration-200"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={goNext}
          className="w-10 h-10 rounded-full border border-[#FFFFFF]/30 flex items-center justify-center text-[#FFFFFF] hover:border-[#FFFFFF] hover:bg-[#FFFFFF]/10 transition-all duration-200"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
