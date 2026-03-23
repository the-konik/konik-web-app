import Link from "next/link";
import Image from "next/image";

const COL_1 = [
  { href: "/shop?category=APPAREL", label: "Apparel" },
  { href: "/shop?category=FOOTWEAR", label: "Footwear" },
  { href: "/shop?category=ACCESSORIES", label: "Accessories" },
  { href: "/tools", label: "Systems" },
  { href: "/plans", label: "Membership" },
  { href: "/company", label: "Our Story" },
] as const;

const COL_2 = [
  { href: "/dashboard/dashboard", label: "Command Center" },
  { href: "/dashboard/dashboard/orders", label: "My Orders" },
  { href: "/dashboard/dashboard/tools", label: "My Tools" },
  { href: "/dashboard/dashboard/subscription", label: "Membership" },
  { href: "/dashboard/dashboard/profile", label: "Profile Settings" },
] as const;

const COL_3 = [
  { href: "/help", label: "Help Center" },
  { href: "/shipping", label: "Shipping & Returns" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;

export function SiteFooter() {
  return (
    <footer className="bg-[#121212] text-[#FFFFFF]">
      <div className="mx-auto max-w-[1920px] px-6 sm:px-8 lg:px-12 py-16 sm:py-20 lg:py-24">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand block */}
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <Image
                src="/KONIK%20NEW%20-%20WHITE.png"
                alt="KONIK Logo"
                width={32}
                height={32}
                className="object-contain"
              />
              <span className="font-atmospheric text-lg tracking-wider">KONIK</span>
            </div>
            <p className="text-[#FFFFFF]/50 text-sm leading-relaxed max-w-sm mb-8">
              Clothing &amp; digital tools for men building a deliberate life.
              We provide the uniform and the systems. You provide the discipline.
            </p>
            <p className="text-[10px] uppercase tracking-[0.3em] text-[#FFFFFF]/30 font-bold">
              The Legacy Continues.
            </p>
          </div>

          {/* Nav col 1 */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8860B] mb-6">
              Explore
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Footer explore">
              {COL_1.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Nav col 2 */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8860B] mb-6">
              Account
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Footer account">
              {COL_2.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Nav col 3 */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#B8860B] mb-6">
              Support
            </h4>
            <nav className="flex flex-col gap-3" aria-label="Footer support">
              {COL_3.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-sm text-[#FFFFFF]/60 hover:text-[#FFFFFF] transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-[#FFFFFF]/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#FFFFFF]/30">
          <span>© {new Date().getFullYear()} KONIK. All rights reserved.</span>
          <span className="uppercase tracking-[0.2em] font-bold">
            Average Is A Choice.
          </span>
        </div>
      </div>
    </footer>
  );
}
