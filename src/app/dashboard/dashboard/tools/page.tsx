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
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-bold text-primary">Tools</h1>
        <p className="text-muted-foreground">
          Open tools you own or get through your plan. Below, locked tools show
          how to unlock them based on your tier.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-primary">My tools</h2>
        {userTools.length === 0 ? (
          <div className="rounded-xl border border-border bg-white p-8 text-center text-sm text-muted-foreground">
            Nothing unlocked yet. Purchase from{" "}
            <Link href="/tools" className="text-accent underline">
              Tools
            </Link>{" "}
            or{" "}
            <Link href="/plans" className="text-accent underline">
              subscribe
            </Link>
            .
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {userTools.map(({ tool, source }) => (
              <div
                key={tool.id}
                className="flex flex-col rounded-xl border border-border bg-white p-6 shadow-sm"
              >
                <h3 className="font-semibold text-primary">{tool.name}</h3>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {tool.description}
                </p>
                <span className="mt-3 inline-block w-fit rounded-full bg-accent/10 px-3 py-0.5 text-xs font-medium text-accent">
                  {source === "subscription"
                    ? "Subscription plan"
                    : source === "manual"
                      ? "Granted"
                      : source === "trial"
                        ? "Trial"
                        : "Purchased"}
                </span>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    href={`/dashboard/dashboard/tools/${tool.slug}`}
                    className="inline-flex flex-1 justify-center rounded-lg bg-accent px-4 py-2.5 text-center text-sm font-medium text-accent-foreground hover:bg-accent/90 sm:flex-none"
                  >
                    Open Tool
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-lg font-semibold text-primary">
          Available tools
        </h2>
        <p className="mb-4 text-sm text-muted-foreground">
          Locked — upgrade, subscribe, or buy one-time to unlock.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lockedTools.map((tool) => (
            <div
              key={tool.id}
              className="rounded-xl border border-border bg-white p-6 opacity-95"
            >
              <h3 className="font-semibold text-primary">{tool.name}</h3>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {tool.description}
              </p>
              <LockedToolUpsell tool={tool} role={session.user.role} />
            </div>
          ))}
        </div>
        {lockedTools.length === 0 && (
          <p className="text-sm text-muted-foreground">
            You have access to all published tools.
          </p>
        )}
      </section>
    </div>
  );
}
