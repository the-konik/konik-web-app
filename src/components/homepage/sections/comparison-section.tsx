"use client";

import { Check, X } from "lucide-react";
import type { SectionProps } from "@/types/section";

/**
 * Comparison Section — clean KONIK vs others table.
 * Nike-aligned: bigger padding, larger text, more spacing
 */
export function ComparisonSection({ data }: SectionProps) {
  const rows = (data.rows as Array<{ feature: string; konik: boolean | string; others: boolean | string }>) || [
    { feature: "Premium Quality Fabrics", konik: true, others: false },
    { feature: "Life Systems & Tools", konik: true, others: false },
    { feature: "Identity-Driven Design", konik: true, others: false },
    { feature: "Discipline Community", konik: true, others: false },
    { feature: "Generic Hype Marketing", konik: false, others: true },
  ];

  function renderCell(val: boolean | string) {
    if (typeof val === "string") return <span className="font-poppins" style={{ fontSize: "13px" }}>{val}</span>;
    return val ? (
      <Check className="w-5 h-5 text-[#B8860B]" strokeWidth={2.5} />
    ) : (
      <X className="w-5 h-5 text-[#FFFFFF]/15" strokeWidth={2} />
    );
  }

  return (
    <section className="bg-[#121212]">
      <div className="max-w-[960px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-14 lg:py-16">
        <h2
          className="font-atmospheric text-[#FFFFFF] tracking-[0.04em] uppercase text-center mb-6 sm:mb-8 leading-[1.1]"
          style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
        >
          Why Konik
        </h2>

        <div className="overflow-hidden rounded-lg border border-[#FFFFFF]/10">
          <div className="grid grid-cols-3 bg-[#FFFFFF]/5">
            <div className="px-5 py-4 font-semibold uppercase tracking-[0.1em] text-[#FFFFFF]/40 font-poppins" style={{ fontSize: "12px" }}>Feature</div>
            <div className="px-5 py-4 text-center font-semibold uppercase tracking-[0.1em] text-[#B8860B] font-poppins" style={{ fontSize: "12px" }}>Konik</div>
            <div className="px-5 py-4 text-center font-semibold uppercase tracking-[0.1em] text-[#FFFFFF]/40 font-poppins" style={{ fontSize: "12px" }}>Others</div>
          </div>

          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-t border-[#FFFFFF]/5 ${i % 2 !== 0 ? "bg-[#FFFFFF]/[0.02]" : ""}`}>
              <div className="px-5 py-4 text-[#FFFFFF]/70 font-poppins" style={{ fontSize: "14px" }}>{row.feature}</div>
              <div className="px-5 py-4 flex items-center justify-center">{renderCell(row.konik)}</div>
              <div className="px-5 py-4 flex items-center justify-center">{renderCell(row.others)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
