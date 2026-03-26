"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * New Updates — latest news/updates for tools.
 * Horizontal card list showing recent tool updates.
 */
export function NewUpdatesSection({ data }: SectionProps) {
  const title = (data.title as string) || "New Updates";
  const updates = (data.updates as Array<{
    title: string;
    date: string;
    image?: string;
    href: string;
    category?: string;
  }>) || [];

  if (updates.length === 0) return null;

  return (
    <section className="bg-[#FFFFFF]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-10">
        <h2
          className="font-atmospheric text-[#121212] tracking-[0.06em] uppercase mb-5 sm:mb-6"
          style={{ fontSize: "var(--atm-h2)" }}
        >
          <span className="sm:hidden">{title}</span>
          <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>{title}</span>
        </h2>

        <div className="flex lg:grid lg:grid-cols-3 gap-3 snap-scroll-x lg:overflow-visible -mx-4 px-4 lg:mx-0 lg:px-0">
          {updates.map((update, i) => (
            <Link
              key={i}
              href={update.href || "/tools"}
              className="group block min-w-[75vw] sm:min-w-[45vw] lg:min-w-0 snap-start bg-[#F8F8F8] rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              {update.image && (
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image
                    src={update.image}
                    alt={update.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width:640px) 75vw, (max-width:1024px) 45vw, 33vw"
                    loading="lazy"
                  />
                </div>
              )}

              <div className="p-4 sm:p-5">
                {update.category && (
                  <span
                    className="font-bold uppercase tracking-[0.12em] text-[#B8860B] font-poppins mb-1.5 block"
                    style={{ fontSize: "var(--text-2xs)" }}
                  >
                    {update.category}
                  </span>
                )}
                <h3
                  className="font-bold text-[#121212] font-poppins tracking-tight mb-1"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {update.title}
                </h3>
                <span
                  className="text-[#4B5563]/60 font-poppins"
                  style={{ fontSize: "var(--text-2xs)" }}
                >
                  {update.date}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
