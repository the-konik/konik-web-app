"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * New Updates — latest news/updates for tools.
 * Nike-aligned: bigger cards, larger text, more padding
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
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14">
        <h2
          className="font-atmospheric text-[#121212] tracking-[0.04em] uppercase mb-6 sm:mb-8 leading-[1.1]"
          style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
        >
          {title}
        </h2>

        <div className="flex lg:grid lg:grid-cols-3 gap-4 sm:gap-5 snap-scroll-x lg:overflow-visible -mx-6 px-6 lg:mx-0 lg:px-0">
          {updates.map((update, i) => (
            <Link
              key={i}
              href={update.href || "/tools"}
              className="group block min-w-[75vw] sm:min-w-[45vw] lg:min-w-0 snap-start bg-[#F5F5F5] rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
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

              <div className="p-5 sm:p-6">
                {update.category && (
                  <span
                    className="font-semibold uppercase tracking-[0.1em] text-[#B8860B] font-poppins mb-2 block"
                    style={{ fontSize: "12px" }}
                  >
                    {update.category}
                  </span>
                )}
                <h3
                  className="font-medium text-[#121212] font-poppins tracking-normal mb-1.5"
                  style={{ fontSize: "16px" }}
                >
                  {update.title}
                </h3>
                <span
                  className="text-[#707072] font-poppins"
                  style={{ fontSize: "13px" }}
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
