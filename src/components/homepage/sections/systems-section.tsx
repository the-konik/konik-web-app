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
 * WARM stage: labelled "Usage" for familiar users.
 * Shows current tools with engagement stats.
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
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12">
        <h2
          className="font-atmospheric text-[#121212] tracking-[0.06em] uppercase mb-5 sm:mb-6"
          style={{ fontSize: "var(--atm-h2)" }}
        >
          <span className="sm:hidden">{title}</span>
          <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>{title}</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {systems.map((system, i) => {
            const Icon = ICON_MAP[system.icon || "wrench"] || Wrench;
            return (
              <Link
                key={i}
                href={system.href || "/tools"}
                className="group bg-[#121212] p-5 sm:p-6 rounded-lg hover:bg-[#1a1a1a] transition-colors duration-200"
              >
                {/* Header: icon + name */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#B8860B]" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-bold text-[#FFFFFF] font-poppins tracking-tight" style={{ fontSize: "var(--text-sm)" }}>
                    {system.name}
                  </h3>
                </div>

                {/* Benefit */}
                <p
                  className="text-[#FFFFFF]/40 font-poppins leading-relaxed mb-3"
                  style={{ fontSize: "var(--text-xs)" }}
                >
                  {system.benefit}
                </p>

                {/* User count */}
                {system.userCount && (
                  <div className="flex items-center gap-1.5 pt-3 border-t border-[#FFFFFF]/5">
                    <Users className="w-3.5 h-3.5 text-[#B8860B]/60" strokeWidth={1.5} />
                    <span
                      className="text-[#FFFFFF]/25 font-poppins font-bold"
                      style={{ fontSize: "var(--text-2xs)" }}
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
