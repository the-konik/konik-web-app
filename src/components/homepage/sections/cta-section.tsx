"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * CTA Section — tight dark banner.
 * Nike-aligned: bigger padding, larger text, beefier button
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

      <div className="relative max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-14 sm:py-20 lg:py-24">
        <div className="flex flex-col items-center text-center gap-6 sm:gap-8">
          <h2
            className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] uppercase leading-[1.1]"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            {title}
          </h2>
          <Link
            href={href}
            className="bg-[#FFFFFF] text-[#121212] px-9 sm:px-11 py-3.5 sm:py-4 rounded-full font-medium uppercase tracking-[0.1em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
            style={{ fontSize: "15px" }}
          >
            {button}
          </Link>
        </div>
      </div>

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
    </section>
  );
}
