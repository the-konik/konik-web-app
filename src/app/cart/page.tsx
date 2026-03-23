import { CartPageClient } from "@/components/cart/cart-page-client";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";

export const dynamic = "force-dynamic";

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <PublicHeader />
      <div className="flex-1 pt-28 sm:pt-32">
        <CartPageClient />
      </div>
      <SiteFooter />
    </div>
  );
}
