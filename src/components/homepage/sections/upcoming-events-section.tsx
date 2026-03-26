"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Upcoming Events — timeline/card list of upcoming releases.
 * Can be tools, clothes, shoes, jewelry, gatherings, competitions.
 */
export function UpcomingEventsSection({ data }: SectionProps) {
  const title = (data.title as string) || "Coming Soon";
  const events = (data.events as Array<{
    title: string;
    date: string;
    type: string;
    image?: string;
    href?: string;
  }>) || [];

  if (events.length === 0) return null;

  const typeColors: Record<string, string> = {
    apparel: "bg-[#FFFFFF]/10 text-[#FFFFFF]/70",
    footwear: "bg-[#FFFFFF]/10 text-[#FFFFFF]/70",
    accessories: "bg-[#FFFFFF]/10 text-[#FFFFFF]/70",
    tool: "bg-[#B8860B]/20 text-[#B8860B]",
    event: "bg-[#4B5563]/20 text-[#FFFFFF]/50",
  };

  return (
    <section className="bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-10 lg:px-16 py-8 sm:py-10">
        <h2
          className="font-atmospheric text-[#FFFFFF] tracking-[0.06em] uppercase mb-5 sm:mb-6"
          style={{ fontSize: "var(--atm-h2)" }}
        >
          <span className="sm:hidden">{title}</span>
          <span className="hidden sm:inline" style={{ fontSize: "var(--atm-h1)" }}>{title}</span>
        </h2>

        <div className="space-y-2">
          {events.map((event, i) => {
            const colorClass = typeColors[event.type?.toLowerCase()] || typeColors.event;
            const Wrapper = event.href ? Link : "div";
            const wrapperProps = event.href ? { href: event.href } : {};

            return (
              <Wrapper
                key={i}
                {...(wrapperProps as any)}
                className="group flex items-center gap-4 bg-[#FFFFFF]/[0.03] hover:bg-[#FFFFFF]/[0.06] p-4 sm:p-5 rounded-lg transition-colors duration-200"
              >
                {/* Image preview */}
                {event.image && (
                  <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-lg overflow-hidden flex-shrink-0 bg-[#FFFFFF]/5">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="64px"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`px-2 py-0.5 rounded-sm uppercase tracking-[0.1em] font-bold font-poppins ${colorClass}`} style={{ fontSize: "9px" }}>
                      {event.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-[#FFFFFF] font-poppins tracking-tight truncate" style={{ fontSize: "var(--text-sm)" }}>
                    {event.title}
                  </h3>
                </div>

                {/* Date */}
                <span
                  className="text-[#FFFFFF]/25 font-poppins font-bold flex-shrink-0"
                  style={{ fontSize: "var(--text-2xs)" }}
                >
                  {event.date}
                </span>
              </Wrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
