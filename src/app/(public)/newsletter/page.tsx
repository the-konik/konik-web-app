import type { Metadata } from "next";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { Mail, CheckCircle, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Join the Inner Circle | KONIK",
  description: "Subscribe to KONIK communications for exclusive drops and content.",
};

export default function NewsletterPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#121212]">
      <PublicHeader />

      <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-20 px-6 sm:px-8">
        <div className="w-full max-w-lg bg-[#FFFFFF] p-8 sm:p-12 rounded-xl border border-[#E5E7EB] shadow-2xl relative overflow-hidden">
          {/* Decorative accents */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#121212] via-[#B8860B] to-[#121212]" />
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#B8860B]/5 rounded-full blur-3xl" />

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-[#F8F8F8] rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-[#B8860B]" />
            </div>

            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] mb-2 block">
              The Inner Circle
            </span>
            <h1 className="font-atmospheric text-3xl text-[#121212] tracking-tight mb-4">
              STAY SHARP.
            </h1>
            <p className="text-sm text-[#4B5563] mb-8 leading-relaxed">
              We don&apos;t spam. We send high-signal dispatch regarding new tools,
              exclusive apparel drops, and mindset shifts. Drop your email to get
              on the list.
            </p>

            <form
              className="space-y-4"
              action={async (formData) => {
                "use server";
                // Server action placeholder
                // In a real app we'd save to DB or MailChimp/Resend
                console.log("Newsletter sign up:", formData.get("email"));
              }}
            >
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="name@example.com"
                  className="w-full h-14 pl-5 pr-12 rounded-none border border-[#E5E7EB] bg-[#F8F8F8] text-sm font-medium text-[#121212] placeholder:text-[#4B5563]/50 focus:outline-none focus:border-[#B8860B] focus:ring-1 focus:ring-[#B8860B] transition-all"
                />
                <div className="absolute right-0 top-0 bottom-0 flex items-center pr-4 text-[#4B5563]">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-14 bg-[#121212] flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#FFFFFF] hover:bg-[#121212]/90 transition-colors"
              >
                Join the List
              </button>
            </form>

            <ul className="mt-8 space-y-3 text-left">
              <li className="flex items-center gap-3 text-xs text-[#4B5563]">
                <CheckCircle className="w-4 h-4 text-[#B8860B] flex-shrink-0" />
                Early access to clothing drops
              </li>
              <li className="flex items-center gap-3 text-xs text-[#4B5563]">
                <CheckCircle className="w-4 h-4 text-[#B8860B] flex-shrink-0" />
                Exclusive beta testing for new digital tools
              </li>
              <li className="flex items-center gap-3 text-xs text-[#4B5563]">
                <CheckCircle className="w-4 h-4 text-[#B8860B] flex-shrink-0" />
                Unsubscribe anytime, zero friction
              </li>
            </ul>

            <p className="mt-8 text-[11px] text-[#4B5563]/60 max-w-[280px] mx-auto leading-relaxed">
              By subscribing, you agree to our{" "}
              <a href="/terms" className="underline hover:text-[#121212]">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="/privacy" className="underline hover:text-[#121212]">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </main>

      {/* We use a simplified footer here or standard site footer, standard is fine */}
      <SiteFooter />
    </div>
  );
}
