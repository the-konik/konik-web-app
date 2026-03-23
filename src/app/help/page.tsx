import type { Metadata } from "next";
import Link from "next/link";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import {
  Mail,
  MessageCircle,
  Phone,
  Clock,
  ChevronDown,
  Package,
  CreditCard,
  Truck,
  RefreshCw,
  Shield,
  HelpCircle,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Help & Contact | KONIK",
  description: "Get help with your KONIK orders, returns, and account.",
};

const FAQS = [
  {
    q: "How long does shipping take?",
    a: "Standard shipping takes 5–7 business days within Sri Lanka. International orders take 10–15 business days. Express shipping is available at checkout for faster delivery.",
  },
  {
    q: "What is your return policy?",
    a: "We accept returns within 30 days of delivery for unworn, unwashed items with original tags attached. Digital tools and subscription purchases are non-refundable.",
  },
  {
    q: "How do I track my order?",
    a: "Once your order ships, you'll receive a tracking email. You can also view your order status in your Dashboard under Orders.",
  },
  {
    q: "Can I cancel or modify my order?",
    a: "Orders can be cancelled within 2 hours of placement. After that, the order enters processing and cannot be modified. Contact us immediately if you need changes.",
  },
  {
    q: "How do digital tool subscriptions work?",
    a: "Digital tools are accessible immediately after purchase. Subscription-based tools remain active as long as your plan is current. One-time purchases give lifetime access.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit and debit cards (Visa, Mastercard, Amex), Apple Pay, Google Pay, and various local payment methods through Stripe.",
  },
];

const TOPICS = [
  { icon: Package, label: "Orders & Shipping", href: "/shipping" },
  { icon: RefreshCw, label: "Returns & Exchanges", href: "/returns" },
  { icon: CreditCard, label: "Payments & Billing", href: "/dashboard/dashboard/payment" },
  { icon: Shield, label: "Account & Security", href: "/dashboard/dashboard/profile" },
];

export default function HelpPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <PublicHeader />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-[#121212] px-6 sm:px-8 lg:px-12 py-20 pt-32 sm:pt-36 lg:pt-40">
          <div className="max-w-[1920px] mx-auto text-center">
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-4 block">
              Support
            </span>
            <h1 className="font-atmospheric text-4xl sm:text-5xl lg:text-6xl text-[#FFFFFF] tracking-tight leading-[1.05] mb-6">
              HOW CAN WE HELP?
            </h1>
            <p className="text-[#FFFFFF]/60 text-base sm:text-lg font-light leading-relaxed max-w-xl mx-auto">
              We&apos;re here to support your journey. Find answers below or
              reach out directly.
            </p>
          </div>
        </section>

        {/* Quick topics */}
        <section className="px-6 sm:px-8 lg:px-12 py-12 border-b border-[#E5E7EB]">
          <div className="max-w-[1920px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4">
            {TOPICS.map((topic) => {
              const Icon = topic.icon;
              return (
                <Link
                  key={topic.label}
                  href={topic.href}
                  className="flex flex-col items-center gap-3 p-6 rounded-xl border border-[#E5E7EB] bg-[#F8F8F8] hover:border-[#B8860B] transition-colors group"
                >
                  <Icon className="w-6 h-6 text-[#4B5563] group-hover:text-[#B8860B] transition-colors" />
                  <span className="text-xs font-bold text-[#121212] text-center uppercase tracking-wide">
                    {topic.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* FAQs */}
        <section className="px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="max-w-[1920px] mx-auto">
            <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B8860B] mb-4 block">
              Frequently Asked Questions
            </span>
            <h2 className="font-atmospheric text-2xl sm:text-3xl text-[#121212] tracking-tight mb-10">
              COMMON QUESTIONS
            </h2>
            <div className="divide-y divide-[#E5E7EB]">
              {FAQS.map((faq, i) => (
                <details key={i} className="group py-5">
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="text-sm font-semibold text-[#121212] pr-4">
                      {faq.q}
                    </span>
                    <ChevronDown className="w-5 h-5 text-[#4B5563] flex-shrink-0 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-sm text-[#4B5563] leading-relaxed">
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="bg-[#F8F8F8] border-t border-[#E5E7EB] px-6 sm:px-8 lg:px-12 py-16 sm:py-20">
          <div className="max-w-[1920px] mx-auto">
            <div className="text-center mb-12">
              <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#B8860B] mb-4 block">
                Get In Touch
              </span>
              <h2 className="font-atmospheric text-2xl sm:text-3xl text-[#121212] tracking-tight">
                STILL NEED HELP?
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] p-6 text-center">
                <Mail className="w-6 h-6 text-[#B8860B] mx-auto mb-3" />
                <h3 className="text-sm font-bold text-[#121212] mb-1">Email</h3>
                <p className="text-xs text-[#4B5563] mb-3">
                  We reply within 24 hours.
                </p>
                <a
                  href="mailto:support@konik.com"
                  className="text-xs font-bold text-[#B8860B] hover:underline uppercase tracking-wide"
                >
                  support@konik.com
                </a>
              </div>
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] p-6 text-center">
                <MessageCircle className="w-6 h-6 text-[#B8860B] mx-auto mb-3" />
                <h3 className="text-sm font-bold text-[#121212] mb-1">
                  Live Chat
                </h3>
                <p className="text-xs text-[#4B5563] mb-3">
                  Available Mon–Fri, 9AM–6PM.
                </p>
                <span className="text-xs font-bold text-[#4B5563] uppercase tracking-wide">
                  Coming Soon
                </span>
              </div>
              <div className="bg-[#FFFFFF] rounded-xl border border-[#E5E7EB] p-6 text-center">
                <Clock className="w-6 h-6 text-[#B8860B] mx-auto mb-3" />
                <h3 className="text-sm font-bold text-[#121212] mb-1">
                  Business Hours
                </h3>
                <p className="text-xs text-[#4B5563]">
                  Monday — Friday
                  <br />
                  9:00 AM — 6:00 PM (IST)
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
