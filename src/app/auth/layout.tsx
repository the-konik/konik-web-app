import { PublicHeader } from "@/components/site/public-header";
import { HeroCarousel } from "@/components/site/hero-carousel";

export default function AuthLayout({
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
