"use client";

import { useState, useEffect } from "react";
import type { SectionProps } from "@/types/section";

/**
 * Social Proof Bar — stats + rotating customer feedback.
 * Nike-aligned: bigger stats, larger text, more padding
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
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 lg:py-16">
        {/* Stats row — Nike-style bigger numbers */}
        <div className="grid grid-cols-3 gap-6 sm:gap-10 mb-8 sm:mb-10">
          {stats.map((stat, i) => (
            <div key={i} className="text-center">
              <span
                className="block font-atmospheric text-[#FFFFFF] tracking-tight"
                style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)" }}
              >
                {stat.value}
              </span>
              <span
                className="font-medium uppercase tracking-[0.1em] text-[#FFFFFF]/40 font-poppins mt-1.5 block"
                style={{ fontSize: "12px" }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>

        {/* Testimonial rotation */}
        {testimonials.length > 0 && (
          <div className="border-t border-[#FFFFFF]/5 pt-8 sm:pt-10">
            <div className="max-w-2xl mx-auto text-center relative min-h-[90px]">
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
                    className="text-[#FFFFFF]/60 font-poppins italic leading-relaxed mb-3.5"
                    style={{ fontSize: "16px" }}
                  >
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <p className="font-poppins" style={{ fontSize: "13px" }}>
                    <span className="font-medium text-[#FFFFFF]/80">{t.name}</span>
                    {t.role && (
                      <span className="text-[#FFFFFF]/30 ml-2">{t.role}</span>
                    )}
                  </p>
                </div>
              ))}
            </div>

            {/* Dots */}
            {testimonials.length > 1 && (
              <div className="flex justify-center gap-2 mt-5">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIdx(i)}
                    className={`h-[3px] rounded-full transition-all duration-300 ${
                      i === activeIdx ? "w-7 bg-[#B8860B]" : "w-3.5 bg-[#FFFFFF]/15"
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
