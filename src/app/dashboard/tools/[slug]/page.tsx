import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/db/prisma";
import { hasToolAccess } from "@/services/tools/access";

type Props = { params: Promise<{ slug: string }> };

export default async function DashboardToolAppPage({ params }: Props) {
  const session = await auth();
  if (!session?.user) return null;

  const { slug } = await params;
  const tool = await db.tool.findUnique({ where: { slug } });
  if (!tool) notFound();

  const allowed = await hasToolAccess(session.user.id, tool.id);
  if (!allowed) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link
            href="/dashboard/tools"
            className="text-sm text-accent hover:underline"
          >
            ← Back to Tools
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-primary">{tool.name}</h1>
        </div>
        {tool.appPath?.startsWith("http") ? (
          <a
            href={tool.appPath}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-accent-foreground hover:bg-accent/90"
          >
            Open Tool (external)
          </a>
        ) : null}
      </div>

      <div className="rounded-xl border border-border bg-white p-4">
        {tool.appPath && !tool.appPath.startsWith("http") ? (
          <iframe
            title={tool.name}
            src={tool.appPath}
            className="min-h-[70vh] w-full rounded-lg border border-border bg-muted"
          />
        ) : tool.appPath?.startsWith("http") ? (
          <p className="text-sm text-muted-foreground">
            This tool opens in a new window. If it didn&apos;t open, use the
            button above.
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            No app URL configured for this tool yet. Contact support or check
            back later.
          </p>
        )}
      </div>
    </div>
  );
}
