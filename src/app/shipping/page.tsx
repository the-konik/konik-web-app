import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Truck, Clock, Globe, Package } from "lucide-react";

export const metadata: Metadata = {
  title: "Shipping Information | KONIK",
  description:
    "KONIK shipping rates, delivery times, and international shipping info.",
};

const SHIPPING_OPTIONS = [
  {
    icon: Package,
    name: "Standard Shipping",
    time: "5–7 business days",
    price: "Free over $100 · $7.99 under",
    note: "Within Sri Lanka",
  },
  {
    icon: Truck,
    name: "Express Shipping",
    time: "2–3 business days",
    price: "$14.99",
    note: "Within Sri Lanka",
  },
  {
    icon: Globe,
    name: "International Standard",
    time: "10–15 business days",
    price: "$19.99",
    note: "Available to 50+ countries",
  },
  {
    icon: Clock,
    name: "International Express",
    time: "5–7 business days",
    price: "$34.99",
    note: "Available to select countries",
  },
];

export default function ShippingInfoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#121212] px-6 sm:px-8 lg:px-12 py-20 pt-32 sm:pt-36 lg:pt-40">
          <div className="max-w-3xl mx-auto">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-4 block">
              Shipping
            </span>
            <h1 className="font-atmospheric text-4xl sm:text-5xl text-[#FFFFFF] tracking-tight leading-[1.05] mb-6">
              FAST. RELIABLE.
              <br />
              <span className="text-[#B8860B]">WORLDWIDE.</span>
            </h1>
            <p className="text-[#FFFFFF]/60 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              Free standard shipping on orders over $100. We ship to 50+
              countries worldwide.
            </p>
          </div>
        </section>

        {/* Shipping options */}
        <section className="px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212] mb-8">
              Shipping Options
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {SHIPPING_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                return (
                  <div
                    key={opt.name}
                    className="rounded-xl border border-[#E5E7EB] bg-[#F8F8F8] p-6 hover:border-[#B8860B] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#B8860B]/10 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-5 h-5 text-[#B8860B]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-[#121212]">
                          {opt.name}
                        </h3>
                        <p className="text-sm text-[#4B5563] mt-1">
                          {opt.time}
                        </p>
                        <p className="text-sm font-semibold text-[#B8860B] mt-2">
                          {opt.price}
                        </p>
                        <p className="text-[11px] text-[#4B5563]/60 mt-1">
                          {opt.note}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Additional info */}
        <section className="bg-[#F8F8F8] border-t border-[#E5E7EB] px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto space-y-10">
            <div>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                Order Processing
              </h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Orders are processed within 1–2 business days. You&apos;ll
                receive a confirmation email with tracking information once your
                order ships. Orders placed on weekends or holidays will be
                processed the next business day.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                Digital Products
              </h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                Digital tools and subscriptions are delivered instantly — no
                shipping required. Access your tools immediately through your
                Dashboard after purchase.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                Customs & Duties
              </h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                International orders may be subject to customs duties and import
                taxes. These fees are the responsibility of the recipient and are
                not included in our shipping charges. Please check with your
                local customs office for import regulations.
              </p>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                Lost or Damaged Packages
              </h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                If your package arrives damaged or doesn&apos;t arrive within
                the expected timeframe, please{" "}
                <Link
                  href="/help"
                  className="text-[#B8860B] font-medium hover:underline"
                >
                  contact our support team
                </Link>{" "}
                and we&apos;ll resolve it promptly.
              </p>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
