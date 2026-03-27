"use client";

import Link from "next/link";
import { Gift, Truck, Star, Wrench } from "lucide-react";
import type { SectionProps } from "@/types/section";

const ICON_MAP: Record<string, typeof Gift> = {
  gift: Gift,
  truck: Truck,
  star: Star,
  wrench: Wrench,
};

/**
 * Membership CTA — benefits grid + register CTA.
 * Nike-aligned: bigger padding, larger icons, more spacing
 */
export function MembershipCtaSection({ data }: SectionProps) {
  const headline = (data.headline as string) || "Become a Member";
  const cta = (data.cta as string) || "Join the Legacy";
  const ctaHref = (data.ctaHref as string) || "/auth/register";
  const benefits = (data.benefits as Array<{
    icon?: string;
    text: string;
  }>) || [
    { icon: "gift", text: "Exclusive first purchase discount" },
    { icon: "truck", text: "Reduced delivery fees" },
    { icon: "star", text: "Personalised recommendations" },
    { icon: "wrench", text: "Legacy Life Builder - free access" },
  ];

  return (
    <section className="bg-[#0A0A0A]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-14 sm:py-20 lg:py-24">
        <div className="flex flex-col items-center text-center">
          {/* Headline — Nike-sized */}
          <h2
            className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] uppercase mb-10 sm:mb-12 leading-[1.1]"
            style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
          >
            {headline}
          </h2>

          {/* Benefits grid — Nike-style larger icons + text */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-10 mb-12 sm:mb-14 w-full max-w-3xl">
            {benefits.map((benefit, i) => {
              const Icon = ICON_MAP[benefit.icon || "star"] || Star;
              return (
                <div key={i} className="flex flex-col items-center gap-3.5">
                  <div className="w-14 h-14 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-[#B8860B]" strokeWidth={1.5} />
                  </div>
                  <p
                    className="text-[#FFFFFF]/60 font-poppins text-center leading-snug max-w-[160px]"
                    style={{ fontSize: "14px" }}
                  >
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA — Nike-style pill button */}
          <Link
            href={ctaHref}
            className="bg-[#FFFFFF] text-[#121212] px-10 sm:px-12 py-4 sm:py-[18px] rounded-full font-medium uppercase tracking-[0.1em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
            style={{ fontSize: "15px" }}
          >
            {cta}
          </Link>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
    </section>
  );
}
