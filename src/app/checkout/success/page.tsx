import { Suspense } from "react";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";
import { CheckoutSuccessInner } from "./success-inner";

export default function CheckoutSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <PublicHeader />
      <Suspense
        fallback={
          <p className="py-20 pt-32 text-center text-muted-foreground">Loading…</p>
        }
      >
        <CheckoutSuccessInner />
      </Suspense>
      <SiteFooter />
    </div>
  );
}
