"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";
import type { SectionProps } from "@/types/section";

/**
 * User Systems — active tool cards with progress + "Continue" CTA.
 * FONT: Poppins --text-sm for names, --text-2xs for CTA
 */
export function UserSystemsSection({ data }: SectionProps) {
  const tools = (data.tools as Array<{
    name: string;
    progress: number;
    href?: string;
  }>) || [];

  if (tools.length === 0) {
    return (
      <section className="bg-[#FFFFFF]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-6 sm:py-8 text-center">
          <p className="text-[#4B5563] font-poppins" style={{ fontSize: "var(--text-sm)" }}>No active systems yet.</p>
          <Link href="/tools" className="inline-block mt-3 font-bold uppercase tracking-[0.12em] text-[#B8860B] border-b border-[#B8860B]/30 pb-0.5 font-poppins hover:border-[#B8860B] transition-colors" style={{ fontSize: "var(--text-xs)" }}>
            Explore Systems
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-6 sm:py-8">
        <h2
          className="font-atmospheric text-[#121212] tracking-[0.06em] uppercase mb-4 sm:mb-5"
          style={{ fontSize: "var(--atm-h2)" }}
        >
          <span className="sm:hidden">Your Systems</span>
          <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>Your Systems</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((tool, i) => (
            <Link
              key={i}
              href={tool.href || "/dashboard"}
              className="group flex items-center gap-4 bg-[#F8F8F8] hover:bg-[#121212] p-4 rounded-lg transition-colors duration-200"
            >
              <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#B8860B]/20">
                <Wrench className="w-5 h-5 text-[#B8860B]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-[#121212] group-hover:text-[#FFFFFF] font-poppins tracking-tight truncate transition-colors" style={{ fontSize: "var(--text-sm)" }}>
                  {tool.name}
                </h3>
                <div className="mt-1.5 h-1 bg-[#E5E7EB] group-hover:bg-[#FFFFFF]/10 rounded-full overflow-hidden transition-colors">
                  <div
                    className="h-full bg-[#B8860B] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, tool.progress))}%` }}
                  />
                </div>
              </div>
              <span className="font-bold uppercase tracking-wider text-[#B8860B] font-poppins flex-shrink-0" style={{ fontSize: "var(--text-2xs)" }}>
                Continue
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
