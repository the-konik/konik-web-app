import { Suspense } from "react";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CheckoutSuccessInner } from "./success-inner";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F8F8F8]">
      <PublicHeader />
      <Suspense
        fallback={
          <p className="py-20 pt-32 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#B8860B] animate-pulse">Loading…</p>
        }
      >
        <CheckoutSuccessInner />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
