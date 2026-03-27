"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Upcoming Events — timeline/card list of upcoming releases.
 * Nike-aligned: bigger cards, larger text, more padding
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
      <div className="max-w-[1440px] mx-auto px-6 sm:px-10 lg:px-12 py-10 sm:py-12 lg:py-14">
        <h2
          className="font-atmospheric text-[#FFFFFF] tracking-[0.04em] uppercase mb-6 sm:mb-8 leading-[1.1]"
          style={{ fontSize: "clamp(1.375rem, 2.5vw, 1.75rem)" }}
        >
          {title}
        </h2>

        <div className="space-y-3">
          {events.map((event, i) => {
            const colorClass = typeColors[event.type?.toLowerCase()] || typeColors.event;
            const Wrapper = event.href ? Link : "div";
            const wrapperProps = event.href ? { href: event.href } : {};

            return (
              <Wrapper
                key={i}
                {...(wrapperProps as any)}
                className="group flex items-center gap-5 bg-[#FFFFFF]/[0.03] hover:bg-[#FFFFFF]/[0.06] p-5 sm:p-6 rounded-lg transition-colors duration-200"
              >
                {/* Image preview */}
                {event.image && (
                  <div className="relative w-16 h-16 sm:w-[72px] sm:h-[72px] rounded-lg overflow-hidden flex-shrink-0 bg-[#FFFFFF]/5">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="72px"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <span className={`px-2.5 py-0.5 rounded-sm uppercase tracking-[0.08em] font-semibold font-poppins ${colorClass}`} style={{ fontSize: "10px" }}>
                      {event.type}
                    </span>
                  </div>
                  <h3 className="font-medium text-[#FFFFFF] font-poppins tracking-normal truncate" style={{ fontSize: "16px" }}>
                    {event.title}
                  </h3>
                </div>

                {/* Date */}
                <span
                  className="text-[#FFFFFF]/25 font-poppins font-medium flex-shrink-0"
                  style={{ fontSize: "13px" }}
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
