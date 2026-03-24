import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { MapPin, Plus } from "lucide-react";

export default async function AddressesPage() {
  const session = await auth();
  if (!session?.user) return null;

  /* Derive saved addresses from past orders */
  const orders = await db.order.findMany({
    where: {
      userId: session.user.id,
    },
    select: { shippingAddress: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  // De-duplicate by stringifying the address
  const seen = new Set<string>();
  const addresses: Array<{ addr: Record<string, string>; date: Date }> = [];
  for (const o of orders) {
    if (!o.shippingAddress || typeof o.shippingAddress !== "object") continue;
    const addr = o.shippingAddress as Record<string, string>;
    if (Object.keys(addr).length === 0) continue;
    const key = JSON.stringify(addr);
    if (!seen.has(key)) {
      seen.add(key);
      addresses.push({ addr, date: o.createdAt });
    }
  }

  return (
    <div className="space-y-12">
      <div>
        <h1 className="font-atmospheric text-3xl text-[#121212] tracking-tight mb-2">SAVED ADDRESSES</h1>
        <p className="text-sm text-[#4B5563] font-medium max-w-xl">
          Derived from your transaction history. These records enable rapid fulfillment 
          and precise logistics for your future orders.
        </p>
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#FFFFFF] p-16 text-center">
          <div className="w-16 h-16 bg-[#F8F8F8] border border-[#E5E7EB] rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-6 h-6 text-[#E5E7EB]" />
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-2">
            NO ADDRESSES FOUND
          </p>
          <p className="text-xs text-[#4B5563] font-medium max-w-xs mx-auto">
            Your shipping history is currently empty. Addresses will be archived here automatically 
            after your first successful order.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((item, i) => {
            const a = item.addr;
            return (
              <div
                key={i}
                className={`rounded-2xl border bg-[#FFFFFF] p-8 shadow-sm transition-all duration-500 hover:border-[#B8860B]/30 group ${
                  i === 0
                    ? "border-[#B8860B]/40 ring-1 ring-[#B8860B]/5"
                    : "border-[#E5E7EB]"
                }`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="w-10 h-10 border border-[#E5E7EB] rounded-full flex items-center justify-center text-[10px] font-bold text-[#4B5563] group-hover:border-[#B8860B]/30 group-hover:text-[#B8860B] transition-colors">
                    {i + 1}
                  </div>
                  {i === 0 && (
                    <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#B8860B] bg-[#B8860B]/5 px-3 py-1 rounded-full">
                      Primary Record
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-[#4B5563] space-y-1 font-medium leading-relaxed">
                  {a.name && (
                    <p className="font-bold text-[#121212] uppercase tracking-wider mb-2">{a.name}</p>
                  )}
                  {a.line1 && <p>{a.line1}</p>}
                  {a.line2 && <p className="opacity-70">{a.line2}</p>}
                  {(a.city || a.state || a.postal_code) && (
                    <p>
                      {[a.city, a.state, a.postal_code]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                  {a.country && <p className="uppercase tracking-widest text-[11px] mt-1">{a.country}</p>}
                  {a.phone && (
                    <p className="mt-4 pt-4 border-t border-[#F8F8F8] text-[11px] tracking-wide">
                      <span className="text-[#121212]/30 uppercase font-bold mr-2">Contact:</span> 
                      {a.phone}
                    </p>
                  )}
                </div>
                
                <div className="mt-6 flex items-center gap-2">
                   <div className="w-1.5 h-1.5 bg-[#4B5563]/20 rounded-full" />
                   <p className="text-[10px] text-[#4B5563]/40 font-bold uppercase tracking-widest">
                     Archived {item.date.toLocaleDateString("en-US", {
                       month: "short",
                       day: "numeric",
                       year: "numeric",
                     })}
                   </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
        <div className="w-12 h-12 shrink-0 bg-[#F8F8F8] border border-[#E5E7EB] rounded-xl flex items-center justify-center text-xl">ℹ️</div>
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-1">DATA MANAGEMENT</p>
          <p className="text-xs text-[#4B5563] font-medium leading-relaxed">
            Addresses are automatically synchronized from your checkout sessions. 
            To manage payment methods or default billing details, access the{" "}
            <a
              href="/dashboard/payment"
              className="text-[#B8860B] font-bold border-b border-[#B8860B]/30 hover:border-[#B8860B] transition-all"
            >
              Stripe Billing Portal
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
