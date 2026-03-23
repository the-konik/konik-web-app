import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { RefreshCw, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Returns & Exchanges | KONIK",
  description: "KONIK return policy — easy 30-day returns for unworn items.",
};

const STEPS = [
  {
    step: "01",
    title: "Initiate Your Return",
    detail:
      "Log in to your account, go to Orders, and select the item you want to return. You can also email support@konik.com with your order number.",
  },
  {
    step: "02",
    title: "Ship It Back",
    detail:
      "Pack the item in its original packaging with tags attached. We'll email you a prepaid shipping label for domestic orders.",
  },
  {
    step: "03",
    title: "Get Your Refund",
    detail:
      "Once we receive and inspect the item, your refund will be processed within 5–7 business days to your original payment method.",
  },
];

export default function ReturnsPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#121212] px-6 sm:px-8 lg:px-12 py-20 pt-32 sm:pt-36 lg:pt-40">
          <div className="max-w-3xl mx-auto">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-4 block">
              Returns
            </span>
            <h1 className="font-atmospheric text-4xl sm:text-5xl text-[#FFFFFF] tracking-tight leading-[1.05] mb-6">
              EASY RETURNS.
              <br />
              <span className="text-[#B8860B]">NO FRICTION.</span>
            </h1>
            <p className="text-[#FFFFFF]/60 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              30-day hassle-free returns on all unworn clothing with original
              tags. We stand behind everything we make.
            </p>
          </div>
        </section>

        {/* Steps */}
        <section className="px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#121212] mb-10">
              How It Works
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {STEPS.map((s) => (
                <div key={s.step} className="relative">
                  <span className="text-5xl font-atmospheric text-[#E5E7EB] leading-none">
                    {s.step}
                  </span>
                  <h3 className="text-base font-semibold text-[#121212] mt-4 mb-2">
                    {s.title}
                  </h3>
                  <p className="text-sm text-[#4B5563] leading-relaxed">
                    {s.detail}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Policy details */}
        <section className="bg-[#F8F8F8] border-t border-[#E5E7EB] px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="max-w-3xl mx-auto space-y-10">
            <div>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                Eligible Items
              </h2>
              <ul className="space-y-2 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-1.5 flex-shrink-0" />
                  Unworn, unwashed clothing with original tags and packaging
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-1.5 flex-shrink-0" />
                  Items returned within 30 days of delivery
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#B8860B] mt-1.5 flex-shrink-0" />
                  Items must be in resalable condition
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                Non-Returnable Items
              </h2>
              <ul className="space-y-2 text-sm text-[#4B5563]">
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 flex-shrink-0" />
                  Digital tools and software subscriptions
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 flex-shrink-0" />
                  Items marked as final sale
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#EF4444] mt-1.5 flex-shrink-0" />
                  Items with visible wear, stains, or missing tags
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-base font-semibold text-[#121212] mb-3">
                Exchanges
              </h2>
              <p className="text-sm text-[#4B5563] leading-relaxed">
                We currently handle exchanges as a return + new order. Return
                your item for a refund and place a new order for the correct
                size/color. This ensures you get the fastest service.
              </p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="px-6 sm:px-8 lg:px-12 py-16 text-center">
          <p className="text-sm text-[#4B5563] mb-4">
            Need to start a return?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/dashboard/dashboard/orders"
              className="inline-flex items-center justify-center gap-2 bg-[#121212] text-[#FFFFFF] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#121212]/90 transition-colors"
            >
              My Orders <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/help"
              className="inline-flex items-center justify-center gap-2 border-2 border-[#121212] text-[#121212] px-8 py-3.5 text-xs font-bold uppercase tracking-[0.2em] hover:bg-[#F8F8F8] transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
