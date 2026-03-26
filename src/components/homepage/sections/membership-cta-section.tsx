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
 * COLD only. Admin-editable benefits.
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
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-12 sm:py-16">
        <div className="flex flex-col items-center text-center">
          {/* Headline */}
          <h2
            className="font-atmospheric text-[#FFFFFF] tracking-[0.08em] uppercase mb-8 sm:mb-10"
            style={{ fontSize: "var(--atm-h1)" }}
          >
            <span className="sm:hidden" style={{ fontSize: "var(--atm-h2)" }}>{headline}</span>
            <span className="hidden sm:inline">{headline}</span>
          </h2>

          {/* Benefits grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-10 sm:mb-12 w-full max-w-3xl">
            {benefits.map((benefit, i) => {
              const Icon = ICON_MAP[benefit.icon || "star"] || Star;
              return (
                <div key={i} className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#B8860B]/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-[#B8860B]" strokeWidth={1.5} />
                  </div>
                  <p
                    className="text-[#FFFFFF]/60 font-poppins text-center leading-snug max-w-[140px]"
                    style={{ fontSize: "var(--text-xs)" }}
                  >
                    {benefit.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* CTA */}
          <Link
            href={ctaHref}
            className="bg-[#FFFFFF] text-[#121212] px-10 sm:px-12 py-3.5 sm:py-4 rounded-full font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
            style={{ fontSize: "var(--text-xs)" }}
          >
            {cta}
          </Link>
        </div>
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-[#B8860B]/20 to-transparent" />
    </section>
  );
}
