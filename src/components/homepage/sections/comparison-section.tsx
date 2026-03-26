"use client";

import { Check, X } from "lucide-react";
import type { SectionProps } from "@/types/section";

/**
 * Comparison Section — clean KONIK vs others table.
 * FONT: Atmospheric atm-h2 for title, Poppins for table text
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
    if (typeof val === "string") return <span className="font-poppins" style={{ fontSize: "var(--text-2xs)" }}>{val}</span>;
    return val ? (
      <Check className="w-4 h-4 text-[#B8860B]" strokeWidth={2.5} />
    ) : (
      <X className="w-4 h-4 text-[#FFFFFF]/15" strokeWidth={2} />
    );
  }

  return (
    <section className="bg-[#121212]">
      <div className="max-w-[900px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-12">
        <h2
          className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] uppercase text-center mb-5 sm:mb-6"
          style={{ fontSize: "var(--atm-h2)" }}
        >
          <span className="sm:hidden">Why Konik</span>
          <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>Why Konik</span>
        </h2>

        <div className="overflow-hidden rounded-lg border border-[#FFFFFF]/10">
          <div className="grid grid-cols-3 bg-[#FFFFFF]/5">
            <div className="px-4 py-3 font-bold uppercase tracking-[0.12em] text-[#FFFFFF]/40 font-poppins" style={{ fontSize: "var(--text-2xs)" }}>Feature</div>
            <div className="px-4 py-3 text-center font-bold uppercase tracking-[0.12em] text-[#B8860B] font-poppins" style={{ fontSize: "var(--text-2xs)" }}>Konik</div>
            <div className="px-4 py-3 text-center font-bold uppercase tracking-[0.12em] text-[#FFFFFF]/40 font-poppins" style={{ fontSize: "var(--text-2xs)" }}>Others</div>
          </div>

          {rows.map((row, i) => (
            <div key={i} className={`grid grid-cols-3 border-t border-[#FFFFFF]/5 ${i % 2 !== 0 ? "bg-[#FFFFFF]/[0.02]" : ""}`}>
              <div className="px-4 py-3 text-[#FFFFFF]/70 font-poppins" style={{ fontSize: "var(--text-xs)" }}>{row.feature}</div>
              <div className="px-4 py-3 flex items-center justify-center">{renderCell(row.konik)}</div>
              <div className="px-4 py-3 flex items-center justify-center">{renderCell(row.others)}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
