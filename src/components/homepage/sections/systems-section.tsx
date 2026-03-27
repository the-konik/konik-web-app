"use client";

import Link from "next/link";
import { Wrench, Target, Zap, Users } from "lucide-react";
import type { SectionProps } from "@/types/section";

const ICON_MAP: Record<string, typeof Wrench> = {
  wrench: Wrench,
  target: Target,
  zap: Zap,
};

/**
 * Systems Section — tool cards with name, user count, and transformation benefit.
 * Nike-aligned: bigger cards, larger text, more padding
 */
export function SystemsSection({ data }: SectionProps) {
  const title = (data.title as string) || "Digital Systems";
  const systems = (data.systems as Array<{
    name: string;
    benefit: string;
    userCount?: string;
    icon?: string;
    href?: string;
  }>) || [
    { name: "Habit Tracker", benefit: "Build unbreakable consistency", userCount: "2.4K users", icon: "target", href: "/tools" },
    { name: "Legacy Planner", benefit: "Engineer your next 90 days", userCount: "1.8K users", icon: "wrench", href: "/tools" },
    { name: "Performance Log", benefit: "Track every rep and win", userCount: "3.1K users", icon: "zap", href: "/tools" },
  ];

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14">
        <h2
          className="font-atmospheric text-[#121212] tracking-[0.04em] uppercase mb-6 sm:mb-8 leading-[1.1]"
          style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
        >
          {title}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          {systems.map((system, i) => {
            const Icon = ICON_MAP[system.icon || "wrench"] || Wrench;
            return (
              <Link
                key={i}
                href={system.href || "/tools"}
                className="group bg-[#121212] p-6 sm:p-7 lg:p-8 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200"
              >
                {/* Header: icon + name */}
                <div className="flex items-center gap-3.5 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#B8860B]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-medium text-[#FFFFFF] font-poppins tracking-normal" style={{ fontSize: "16px" }}>
                    {system.name}
                  </h3>
                </div>

                {/* Benefit */}
                <p
                  className="text-[#FFFFFF]/40 font-poppins leading-relaxed mb-4"
                  style={{ fontSize: "14px" }}
                >
                  {system.benefit}
                </p>

                {/* User count */}
                {system.userCount && (
                  <div className="flex items-center gap-2 pt-4 border-t border-[#FFFFFF]/5">
                    <Users className="w-4 h-4 text-[#B8860B]/60" strokeWidth={1.5} />
                    <span
                      className="text-[#FFFFFF]/25 font-poppins font-medium"
                      style={{ fontSize: "12px" }}
                    >
                      {system.userCount}
                    </span>
                  </div>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
