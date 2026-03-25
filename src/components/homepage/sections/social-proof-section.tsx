"use client";

import { motion } from "framer-motion";
import type { SectionProps } from "@/types/section";

/**
 * Social Proof Section — stats bar + testimonial quotes.
 *
 * Data: { stats: [{ value, label }], testimonials?: [{ quote, name, role? }] }
 */
export function SocialProofSection({ data }: SectionProps) {
  const stats = (data.stats as Array<{ value: string; label: string }>) || [
    { value: "10K+", label: "Men Building Legacy" },
    { value: "98%", label: "Satisfaction Rate" },
    { value: "50+", label: "Countries" },
  ];
  const testimonials = (data.testimonials as Array<{ quote: string; name: string; role?: string }>) || [];

  return (
    <section className="bg-[#FAFAFA] border-y border-[#E5E7EB]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-16 sm:py-24">
        {/* Stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-8 sm:gap-12 mb-16 sm:mb-20">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <span className="block font-atmospheric text-2xl sm:text-4xl lg:text-5xl text-[#121212] tracking-tight mb-2">
                {stat.value}
              </span>
              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.15em] text-[#4B5563] font-poppins">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        {testimonials.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="bg-[#FFFFFF] border border-[#E5E7EB] rounded-lg p-6 sm:p-8"
              >
                <p className="text-[13px] text-[#121212] font-poppins leading-relaxed mb-5 italic">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-[11px] font-bold text-[#121212] font-poppins tracking-tight">
                    {t.name}
                  </p>
                  {t.role && (
                    <p className="text-[10px] text-[#4B5563] font-poppins mt-0.5">{t.role}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
