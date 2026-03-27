"use client";

import Link from "next/link";
import Image from "next/image";
import { Crown, Star, Zap } from "lucide-react";
import type { SectionProps } from "@/types/section";

const TIER_ICONS: Record<string, typeof Crown> = {
  builder: Zap,
  legacy: Star,
  elite: Crown,
};

/**
 * Loyalty & About KONIK — brand story + tier progression.
 * Nike-aligned: bigger padding, larger text, more spacing
 */
export function LoyaltyAboutSection({ data, media }: SectionProps) {
  const headline = (data.headline as string) || "The Legacy Program";
  const description = (data.description as string) || "Earn points with every purchase. Unlock higher tiers for exclusive discounts and early access.";
  const image = media || (data.image as string) || "/images/sections/generated-bg-1.png";
  const tiers = (data.tiers as Array<{
    name: string;
    discount: string;
    perks: string;
  }>) || [
    { name: "Builder", discount: "5%", perks: "Free shipping over $100" },
    { name: "Legacy", discount: "10%", perks: "Early access to drops" },
    { name: "Elite", discount: "15%", perks: "Exclusive members-only items" },
  ];

  return (
    <section className="bg-[#121212]">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[55vh]">
        {/* Image */}
        <div className="relative aspect-[16/10] lg:aspect-auto overflow-hidden">
          <Image
            src={image}
            alt={headline}
            fill
            className="object-cover brightness-[0.5]"
            sizes="(max-width:1024px) 100vw, 50vw"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <h2
              className="font-atmospheric text-[#FFFFFF] tracking-[0.08em] text-center uppercase px-6"
              style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
            >
              {headline}
            </h2>
          </div>
        </div>

        {/* Tiers — Nike-aligned bigger padding */}
        <div className="flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10 sm:py-12 lg:py-0">
          <p
            className="text-[#FFFFFF]/40 font-poppins leading-relaxed mb-8 sm:mb-10 max-w-md"
            style={{ fontSize: "15px" }}
          >
            {description}
          </p>

          <div className="space-y-3.5">
            {tiers.map((tier, i) => {
              const TierIcon = TIER_ICONS[tier.name.toLowerCase()] || Star;
              return (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-[#FFFFFF]/[0.03] p-5 rounded-lg border border-[#FFFFFF]/5"
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    i === 0 ? "bg-[#FFFFFF]/10" : i === 1 ? "bg-[#B8860B]/15" : "bg-[#B8860B]/25"
                  }`}>
                    <TierIcon className={`w-5 h-5 ${i === 0 ? "text-[#FFFFFF]/50" : "text-[#B8860B]"}`} strokeWidth={1.5} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5">
                      <h3 className="font-medium text-[#FFFFFF] font-poppins" style={{ fontSize: "16px" }}>
                        {tier.name}
                      </h3>
                      <span className="font-semibold text-[#B8860B] font-poppins" style={{ fontSize: "14px" }}>
                        {tier.discount} off
                      </span>
                    </div>
                    <p className="text-[#FFFFFF]/30 font-poppins truncate mt-0.5" style={{ fontSize: "13px" }}>
                      {tier.perks}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <Link
            href="/auth/register"
            className="inline-block w-fit mt-8 bg-[#B8860B] text-[#FFFFFF] px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-medium uppercase tracking-[0.1em] hover:bg-[#9a7209] transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] font-poppins"
            style={{ fontSize: "15px" }}
          >
            Join Now
          </Link>
        </div>
      </div>
    </section>
  );
}
