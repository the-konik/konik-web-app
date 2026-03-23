import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { LockedToolUpsell } from "@/components/dashboard/locked-tool-upsell";
import { getUserTools } from "@/services/tool-access";
import Link from "next/link";

export default async function MyToolsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const [userTools, allTools] = await Promise.all([
    getUserTools(session.user.id),
    db.tool.findMany({ where: { published: true } }),
  ]);

  const unlockedIds = new Set(userTools.map((ut) => ut.tool.id));
  const lockedTools = allTools.filter((t) => !unlockedIds.has(t.id));

  return (
    <div className="space-y-16">
      <div>
        <h1 className="font-atmospheric text-3xl text-[#121212] tracking-tight mb-2">DIGITAL TOOLS</h1>
        <p className="text-sm text-[#4B5563] font-medium leading-relaxed max-w-xl">
          Functional assets authorized for your professional workflow. Unlock additional 
          capabilities through membership expansion or individual acquisition.
        </p>
      </div>

      <section>
        <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-6">UNLOCKED ASSETS</h2>
        {userTools.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#E5E7EB] bg-[#FFFFFF] p-12 text-center">
            <p className="text-sm text-[#4B5563] font-medium mb-6">
              Your digital arsenal is currently empty. Explore our specialized tools or subscribe 
               to a membership plan to initialize your access.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                href="/tools" 
                className="bg-[#121212] text-[#FFFFFF] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#B8860B] transition-all"
              >
                Browse Tools
              </Link>
              <Link 
                href="/plans" 
                className="border border-[#121212] text-[#121212] px-8 py-3 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#F8F8F8] transition-all"
              >
                Subscribe
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {userTools.map(({ tool, source }) => (
              <div
                key={tool.id}
                className="flex flex-col rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF] p-8 shadow-sm transition-all duration-500 hover:border-[#B8860B]/30 group"
              >
                <div className="flex items-center gap-3 mb-4">
                   <div className="w-1.5 h-1.5 bg-[#B8860B] rounded-full" />
                   <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#121212]">{tool.name}</h3>
                </div>
                <p className="text-sm text-[#4B5563] font-medium leading-relaxed mb-6 flex-1 line-clamp-3">
                  {tool.description}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[#F8F8F8]">
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[#B8860B] py-1">
                    {source === "subscription"
                      ? "Membership Perk"
                      : source === "manual"
                        ? "Authorized"
                        : source === "trial"
                          ? "Evaluation"
                          : "Primary Asset"}
                  </span>
                  <Link
                    href={`/dashboard/dashboard/tools/${tool.slug}`}
                    className="bg-[#121212] text-[#FFFFFF] px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.15em] hover:bg-[#B8860B] transition-all"
                  >
                    Launch
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#121212] mb-1">
              AVAILABLE EXTENSIONS
            </h2>
            <p className="text-[10px] text-[#4B5563] font-bold uppercase tracking-widest opacity-40">
              Locked — require authorization to initialize
            </p>
          </div>
        </div>
        
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {lockedTools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-2xl border border-[#E5E7EB] bg-[#FFFFFF]/50 p-8 shadow-sm grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-700 relative overflow-hidden group"
            >
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-1.5 h-1.5 bg-[#4B5563]/20 rounded-full" />
                 <h3 className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#121212]">{tool.name}</h3>
              </div>
              <p className="text-sm text-[#4B5563] font-medium leading-relaxed mb-6 line-clamp-2">
                {tool.description}
              </p>
              <div className="mt-auto">
                <LockedToolUpsell tool={tool} role={session.user.role} />
              </div>
            </div>
          ))}
        </div>
        
        {lockedTools.length === 0 && (
          <div className="bg-[#121212] p-8 rounded-2xl text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#B8860B]">
              FULL ECOSYSTEM UNLOCKED
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
