"use client";

import Link from "next/link";
import Image from "next/image";
import type { SectionProps } from "@/types/section";

/**
 * Lifestyle Grid — asymmetric 4-image magazine layout.
 * Nike-aligned: taller grid, minimal gap
 */
export function LifestyleGridSection({ data }: SectionProps) {
  const images = (data.images as Array<{
    src: string;
    alt: string;
    href?: string;
  }>) || [
    { src: "/images/homepage/lifestyle-large.png", alt: "Urban discipline", href: "/shop" },
    { src: "/images/homepage/lifestyle-tall.png", alt: "The vision", href: "/shop" },
    { src: "/images/homepage/lifestyle-wide.png", alt: "Train harder", href: "/tools" },
    { src: "/images/homepage/lifestyle-square.png", alt: "Plan the legacy", href: "/tools" },
  ];

  return (
    <section className="bg-[#121212] py-1">
      {/* Mobile: 2-col simple grid */}
      <div className="block lg:hidden">
        <div className="grid grid-cols-2 gap-[2px]">
          {images.map((img, i) => {
            const Wrapper = img.href ? Link : "div";
            const wrapperProps = img.href ? { href: img.href } : {};
            return (
              <Wrapper
                key={i}
                {...(wrapperProps as any)}
                className={`group relative overflow-hidden ${
                  i === 0 ? "col-span-2 aspect-[16/10]" : "aspect-square"
                }`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes={i === 0 ? "100vw" : "50vw"}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#000000]/20 group-hover:bg-[#000000]/10 transition-colors duration-300" />
              </Wrapper>
            );
          })}
        </div>
      </div>

      {/* Desktop: Asymmetric magazine grid — Nike-aligned taller */}
      <div className="hidden lg:block">
        <div className="grid grid-cols-3 grid-rows-2 gap-[2px]" style={{ height: "90vh" }}>
          {/* Position 1: Large — spans col 1, rows 1-2 */}
          {images[0] && (
            <Link
              href={images[0].href || "/shop"}
              className="group relative row-span-2 overflow-hidden"
            >
              <Image
                src={images[0].src}
                alt={images[0].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#000000]/15 group-hover:bg-[#000000]/5 transition-colors duration-300" />
            </Link>
          )}

          {/* Position 2: Tall portrait — col 2, row 1 */}
          {images[1] && (
            <Link
              href={images[1].href || "/shop"}
              className="group relative overflow-hidden"
            >
              <Image
                src={images[1].src}
                alt={images[1].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#000000]/15 group-hover:bg-[#000000]/5 transition-colors duration-300" />
            </Link>
          )}

          {/* Position 3: Wide landscape — col 3, row 1 */}
          {images[2] && (
            <Link
              href={images[2].href || "/tools"}
              className="group relative overflow-hidden"
            >
              <Image
                src={images[2].src}
                alt={images[2].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="33vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#000000]/15 group-hover:bg-[#000000]/5 transition-colors duration-300" />
            </Link>
          )}

          {/* Position 4: fills remaining space — col 2-3, row 2 */}
          {images[3] && (
            <Link
              href={images[3].href || "/tools"}
              className="group relative col-span-2 overflow-hidden"
            >
              <Image
                src={images[3].src}
                alt={images[3].alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="66vw"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-[#000000]/15 group-hover:bg-[#000000]/5 transition-colors duration-300" />
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
