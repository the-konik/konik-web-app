"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

export function CheckoutSuccessInner() {
  const sp = useSearchParams();
  const sessionId = sp.get("session_id");

  return (
    <div className="mx-auto max-w-lg px-6 py-32 text-center flex flex-col items-center justify-center flex-1">
      <div className="w-16 h-16 bg-[#F8F8F8] border border-[#E5E7EB] rounded-full flex items-center justify-center mx-auto mb-6">
        <span className="text-xl">✅</span>
      </div>
      <h1 className="font-atmospheric text-3xl sm:text-4xl text-[#121212] tracking-tight">THANK YOU!</h1>
      <p className="mt-4 text-sm text-[#4B5563] leading-relaxed">
        Your payment is processing. When Stripe confirms it, we&apos;ll mark your
        order paid and update fulfillment status. Digital tools unlock under{" "}
        <Link href="/dashboard/dashboard/tools" className="text-[#B8860B] font-bold uppercase tracking-wider hover:underline">
          Dashboard → Tools
        </Link>
        .
      </p>
      {sessionId && (
        <p className="mt-6 font-mono text-[10px] text-[#4B5563]/60 break-all">
          Session ID: {sessionId}
        </p>
      )}
      <div className="mt-10 flex flex-col gap-3 w-full sm:flex-row sm:justify-center">
        <Link
          href="/dashboard/dashboard/orders"
          className="rounded-none bg-[#121212] px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] hover:bg-[#121212]/90 transition-colors"
        >
          View Orders
        </Link>
        <Link
          href="/shop"
          className="rounded-none border border-[#121212] bg-transparent px-8 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] hover:bg-[#F8F8F8] transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
