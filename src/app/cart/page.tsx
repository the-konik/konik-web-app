import { CartPageClient } from "@/components/cart/cart-page-client";
import { PublicHeader } from "@/components/site/public-header";
import { SiteFooter } from "@/components/site/site-footer";

export default function CartPage() {
  return (
    <div className="flex min-h-screen flex-col bg-muted">
      <PublicHeader />
      <div className="flex-1">
        <CartPageClient />
      </div>
      <SiteFooter />
    </div>
  );
}
