import { auth } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import { db } from "@/lib/db/prisma";

const COOKIE_NAME = "konik_score";

/**
 * Server-side: resolve the current user's engagement score.
 *
 * - Authenticated → read `user.engagementScore` from DB.
 * - Guest         → read `konik_score` cookie (defaults to 0).
 */
export async function getUserScore(): Promise<number> {
  // 1. Check session (NextAuth v5 — uses auth())
  const session = await auth();

  if (session?.user?.email) {
    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { engagementScore: true },
    });
    return user?.engagementScore ?? 0;
  }

  // 2. Guest – read cookie
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAME)?.value;
  return raw ? Math.max(0, parseInt(raw, 10) || 0) : 0;
}
