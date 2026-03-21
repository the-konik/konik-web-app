import type { StaffRole, UserRole } from "@prisma/client";
import type { NextAuthConfig } from "next-auth";

/**
 * Edge-safe auth config (no Prisma, no bcrypt).
 * JWT/session must stay in sync with `src/lib/auth.ts` module augmentation.
 */
export const authConfig = {
  trustHost: true,
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        const u = user as {
          staffRole?: StaffRole | null;
        };
        token.staffRole = u.staffRole ?? null;
        if (user.role === "ADMIN" && !token.staffRole) {
          token.staffRole = "SUPER_ADMIN" as StaffRole;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        const su = session.user as typeof session.user & {
          staffRole: StaffRole | null;
        };
        su.staffRole = (token.staffRole as StaffRole | null | undefined) ?? null;
      }
      return session;
    },
  },
  providers: [],
} satisfies NextAuthConfig;
