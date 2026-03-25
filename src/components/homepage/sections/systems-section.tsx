"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Cpu, Target, BarChart3, Zap } from "lucide-react";
import type { SectionProps } from "@/types/section";

const ICON_MAP: Record<string, typeof Cpu> = {
  cpu: Cpu,
  target: Target,
  chart: BarChart3,
  zap: Zap,
};

/**
 * Systems Section — showcases digital tools with icons and descriptions.
 *
 * Data: { title, subtitle?, tools: [{ name, description, icon?, href }] }
 */
export function SystemsSection({ data }: SectionProps) {
  const title = (data.title as string) || "The Systems";
  const subtitle = (data.subtitle as string) || "Tools engineered for disciplined men.";
  const tools = (data.tools as Array<{ name: string; description: string; icon?: string; href: string }>) || [];

  if (tools.length === 0) {
    return (
      <section className="bg-[#0A0A0A]">
        <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 text-center">
          <h2 className="font-atmospheric text-xl sm:text-3xl text-[#FFFFFF] tracking-[0.08em] uppercase mb-4">
            {title}
          </h2>
          <p className="text-[#FFFFFF]/40 text-sm font-poppins mb-8">{subtitle}</p>
          <Link
            href="/tools"
            className="inline-block bg-[#B8860B] text-[#FFFFFF] px-8 py-3.5 rounded-full text-[9px] font-bold uppercase tracking-[0.2em] hover:bg-[#D4A017] transition-all font-poppins"
          >
            Explore Systems
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#0A0A0A]">
      <div className="max-w-[1440px] mx-auto px-5 sm:px-10 lg:px-16 py-20 sm:py-28 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="font-atmospheric text-xl sm:text-3xl lg:text-4xl text-[#FFFFFF] tracking-[0.08em] uppercase mb-3">
            {title}
          </h2>
          <p className="text-[#FFFFFF]/40 text-xs sm:text-sm font-poppins">{subtitle}</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {tools.map((tool, i) => {
            const Icon = ICON_MAP[tool.icon || ""] || Zap;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  href={tool.href || "/tools"}
                  className="group block bg-[#FFFFFF]/[0.03] border border-[#FFFFFF]/10 rounded-xl p-6 sm:p-8 hover:border-[#B8860B]/30 hover:bg-[#FFFFFF]/[0.05] transition-all duration-300"
                >
                  <div className="w-10 h-10 rounded-lg bg-[#B8860B]/10 flex items-center justify-center mb-5">
                    <Icon className="w-5 h-5 text-[#B8860B]" />
                  </div>
                  <h3 className="text-sm font-bold text-[#FFFFFF] font-poppins tracking-tight mb-2">
                    {tool.name}
                  </h3>
                  <p className="text-[11px] text-[#FFFFFF]/40 font-poppins leading-relaxed">
                    {tool.description}
                  </p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
