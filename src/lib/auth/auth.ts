import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db/prisma";
import { authConfig } from "@/lib/auth/auth.config";
import type { StaffRole, UserRole } from "@prisma/client";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: UserRole;
      staffRole: StaffRole | null;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }

  interface User {
    role: UserRole;
    staffRole?: StaffRole | null;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    staffRole?: StaffRole | null;
  }
}

const googleProvider =
  process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET
    ? Google({
        clientId: process.env.AUTH_GOOGLE_ID,
        clientSecret: process.env.AUTH_GOOGLE_SECRET,
      })
    : null;

const githubProvider =
  process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET
    ? GitHub({
        clientId: process.env.AUTH_GITHUB_ID,
        clientSecret: process.env.AUTH_GITHUB_SECRET,
      })
    : null;

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  providers: [
    ...(googleProvider ? [googleProvider] : []),
    ...(githubProvider ? [githubProvider] : []),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = String(credentials.email).trim().toLowerCase();

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          staffRole: user.staffRole,
        };
      },
    }),
  ],
});
