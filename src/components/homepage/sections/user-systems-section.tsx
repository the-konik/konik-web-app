"use client";

import Link from "next/link";
import { Wrench } from "lucide-react";
import type { SectionProps } from "@/types/section";

/**
 * User Systems — active tool cards with progress + "Continue" CTA.
 * Nike-aligned: bigger cards, larger text, more padding
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
        <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-10 text-center">
          <p className="text-[#707072] font-poppins" style={{ fontSize: "15px" }}>No active systems yet.</p>
          <Link href="/tools" className="inline-block mt-4 font-medium text-[#B8860B] border-b border-[#B8860B]/30 pb-0.5 font-poppins hover:border-[#B8860B] transition-colors" style={{ fontSize: "15px" }}>
            Explore Systems
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-8 sm:py-10 lg:py-12">
        <h2
          className="font-atmospheric text-[#121212] tracking-[0.04em] uppercase mb-5 sm:mb-7 leading-[1.1]"
          style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
        >
          Your Systems
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {tools.map((tool, i) => (
            <Link
              key={i}
              href={tool.href || "/dashboard"}
              className="group flex items-center gap-4 bg-[#F5F5F5] hover:bg-[#121212] p-5 sm:p-6 rounded-lg transition-colors duration-200"
            >
              <div className="w-12 h-12 rounded-full bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0 group-hover:bg-[#B8860B]/20">
                <Wrench className="w-5 h-5 text-[#B8860B]" strokeWidth={1.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-[#121212] group-hover:text-[#FFFFFF] font-poppins tracking-normal truncate transition-colors" style={{ fontSize: "15px" }}>
                  {tool.name}
                </h3>
                <div className="mt-2 h-1.5 bg-[#E5E7EB] group-hover:bg-[#FFFFFF]/10 rounded-full overflow-hidden transition-colors">
                  <div
                    className="h-full bg-[#B8860B] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(0, tool.progress))}%` }}
                  />
                </div>
              </div>
              <span className="font-medium uppercase tracking-wider text-[#B8860B] font-poppins flex-shrink-0" style={{ fontSize: "12px" }}>
                Continue
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
