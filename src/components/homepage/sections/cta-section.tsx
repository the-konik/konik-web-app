"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * CTA Section — tight dark banner.
 * IMAGE (optional): 1920×822 (21:9) with heavy overlay
 * FONT: Atmospheric atm-h2 mobile → atm-h1 desktop
 */
export function CTASection({ data, media }: SectionProps) {
  const title = (data.title as string) || "Join The Legacy";
  const button = (data.button as string) || "Get Started";
  const href = (data.href as string) || "/auth/register";

  return (
    <section className="relative overflow-hidden bg-[#0A0A0A]">
      {media && (
        <div className="absolute inset-0">
          <Image src={media} alt="" fill className="object-cover opacity-15" sizes="100vw" loading="lazy" />
          <div className="absolute inset-0 bg-[#0A0A0A]/70" />
        </div>
      )}

      <div className="relative max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-10 sm:py-12">
        <div className="flex flex-col items-center text-center gap-5 sm:gap-6">
          <h2
            className="font-atmospheric text-[#FFFFFF] tracking-[0.08em] uppercase"
            style={{ fontSize: "var(--atm-h2)" }}
          >
            <span className="sm:hidden">{title}</span>
            <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>{title}</span>
          </h2>
          <Link
            href={href}
            className="bg-[#FFFFFF] text-[#121212] px-8 sm:px-10 py-3 sm:py-3.5 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
            style={{ fontSize: "var(--text-xs)" }}
          >
            {button}
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
    </section>
  );
}
