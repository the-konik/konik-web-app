"use client";

import { useState, useEffect } from "react";
import type { SectionProps } from "@/types/section";

/**
 * Social Proof Bar — stats + rotating customer feedback.
 * Auto-rotates testimonials every 5s.
 */
export function SocialProofSection({ data }: SectionProps) {
  const stats = (data.stats as Array<{ value: string; label: string }>) || [
    { value: "10K+", label: "Men Building Legacy" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "50+", label: "Countries" },
  ];

  const testimonials = (data.testimonials as Array<{ quote: string; name: string; role?: string }>) || [
    { quote: "Changed how I approach everything - from training to business.", name: "D.K.", role: "Colombo" },
    { quote: "Finally a brand that gets what discipline actually means.", name: "R.S.", role: "Kandy" },
    { quote: "The tools alone are worth more than any subscription I've paid.", name: "M.P.", role: "Galle" },
  ];

  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    if (testimonials.length <= 1) return;
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  return (
    <section className="bg-[#121212] border-y border-[#FFFFFF]/5">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-8 sm:py-10">
        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-6 sm:mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <span
                className="block font-atmospheric text-[#FFFFFF] tracking-tight"
                style={{ fontSize: "var(--atm-h2)" }}
              >
                <span className="sm:hidden">{stat.value}</span>
                <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>{stat.value}</span>
              </span>
              <span
                className="font-bold uppercase tracking-[0.12em] text-[#FFFFFF]/40 font-poppins mt-1 block"
                style={{ fontSize: "var(--text-2xs)" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonial rotation */}
        {testimonials.length > 0 && (
          <div className="border-t border-[#FFFFFF]/5 pt-6 sm:pt-8">
            <div className="max-w-2xl mx-auto text-center relative min-h-[80px]">
              {testimonials.map((t, i) => (
                <div
                  key={i}
                  className={`transition-all duration-500 ${
                    i === activeIdx
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-2 absolute inset-0"
                  }`}
                >
                  <p
                    className="text-[#FFFFFF]/60 font-poppins italic leading-relaxed mb-3"
                    style={{ fontSize: "var(--text-sm)" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="font-poppins" style={{ fontSize: "var(--text-2xs)" }}>
                    <span className="font-bold text-[#FFFFFF]/80">{t.name}</span>
                    {t.role && (
                      <span className="text-[#FFFFFF]/30 ml-2">{t.role}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Dots */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-1.5 mt-4">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`h-[2px] rounded-full transition-all duration-300 ${
                      i === activeIdx ? "w-6 bg-[#B8860B]" : "w-3 bg-[#FFFFFF]/15"
                    }`}
                    aria-label={`View testimonial ${i + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
