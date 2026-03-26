import { PublicHeader } from "@/components/site/public-header";
import { HeroCarousel } from "@/components/site/hero-carousel";

/**
 * Customer auth layout — shows homepage hero carousel as blurred background.
 * Applies to /auth/login and /auth/register only.
 */
export default function CustomerAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Homepage content as blurred background */}
      <div className="pointer-events-none select-none" aria-hidden="true">
        <PublicHeader />
        <main>
          <HeroCarousel />
        </main>
      </div>

      {/* Auth modal overlay */}
      {children}
    </div>
  );
}
