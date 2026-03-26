"use client";

import Link from "next/link";
import Image from "next/image";

/**
 * Legacy Transition — cinematic strip with CSS Ken Burns.
 * IMAGE: 1920×822 desktop (21:9), subject centred
 * FONT: Atmospheric hero mobile, display desktop
 */
export function LegacyTransitionSection() {
  return (
    <section className="relative h-[50vh] sm:h-[55vh] lg:h-[60vh] w-full overflow-hidden bg-[#121212]">
      <div className="absolute inset-0">
        <Image
          src="/images/sections/generated-bg-3.png"
          alt="The Legacy Path"
          fill
          className="object-cover animate-slow-zoom brightness-[0.5]"
          sizes="100vw"
          loading="lazy"
        />
      </div>

      <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 sm:gap-8 px-5">
        <h2
          className="font-atmospheric text-white tracking-[0.15em] text-center leading-tight drop-shadow-[0_0_20px_rgba(0,0,0,0.5)]"
          style={{ fontSize: "var(--atm-h1)" }}
        >
          <span className="sm:hidden">AVERAGE IS<br />A CHOICE</span>
          <span className="hidden sm:inline lg:hidden" style={{ fontSize: "var(--atm-hero)" }}>AVERAGE IS A CHOICE</span>
          <span className="hidden lg:inline" style={{ fontSize: "var(--atm-display)" }}>AVERAGE IS A CHOICE</span>
        </h2>

        <Link
          href="/tools"
          className="bg-white text-[#121212] px-7 sm:px-9 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
          style={{ fontSize: "var(--text-xs)" }}
        >
          Explore Systems
        </Link>
      </div>

      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#121212]/50 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#121212]/60 to-transparent" />
    </section>
  );
}
