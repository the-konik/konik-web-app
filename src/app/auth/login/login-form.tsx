"use client";

import { useState, useEffect } from "react";
import { getProviders, getSession, signIn } from "next-auth/react";
import {
  DEFAULT_USER_HOME,
  STAFF_ADMIN_HOME,
  postAuthRedirectUrl,
  sessionUserHasStaffAccess,
} from "@/lib/auth-redirect";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type LoginVariant = "user" | "staff";

export function LoginForm({ variant = "user" }: { variant?: LoginVariant }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultCallback =
    variant === "staff" ? STAFF_ADMIN_HOME : DEFAULT_USER_HOME;
  const callbackUrl = searchParams.get("callbackUrl") || defaultCallback;
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    authError ? decodeURIComponent(authError.replace(/\+/g, " ")) : ""
  );
  const [loading, setLoading] = useState(false);
  const [oauthIds, setOauthIds] = useState<string[]>([]);

  useEffect(() => {
    getProviders().then((p) => {
      if (!p) return;
      setOauthIds(
        Object.keys(p).filter((id) => id !== "credentials")
      );
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error || !result?.ok) {
      setError("Invalid email or password");
      return;
    }

    // Cookie may not be visible to getSession() immediately; retry briefly.
    let session = await getSession();
    for (let i = 0; i < 3 && !session?.user; i++) {
      await new Promise((r) => setTimeout(r, 75));
      session = await getSession();
    }
    const u = session?.user;
    const isStaff =
      u != null &&
      sessionUserHasStaffAccess({
        role: u.role,
        staffRole: (u as { staffRole?: string | null }).staffRole ?? null,
      });

    if (variant === "staff" && !isStaff) {
      await signOut({ redirect: false });
      setError(
        "This account does not have staff access. Sign in as a customer at the regular login page."
      );
      return;
    }

    let nextUrl: string;
    if (variant === "staff" && isStaff) {
      nextUrl =
        callbackUrl.startsWith("/admin") ? callbackUrl : STAFF_ADMIN_HOME;
    } else {
      nextUrl = postAuthRedirectUrl(isStaff, callbackUrl);
    }

    router.push(nextUrl);
    router.refresh();
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-primary px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="text-3xl font-bold text-primary-foreground">
            KONIK
          </Link>
          {variant === "staff" ? (
            <>
              <p className="mt-2 text-xs font-semibold uppercase tracking-widest text-accent">
                Staff
              </p>
              <p className="mt-1 text-muted-foreground">
                Sign in to the admin panel
              </p>
            </>
          ) : (
            <p className="mt-2 text-muted-foreground">Sign in to your account</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-primary-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-white/5 px-4 py-2.5 text-primary-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-primary-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-border bg-white/5 px-4 py-2.5 text-primary-foreground placeholder:text-muted-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent py-2.5 font-medium text-accent-foreground hover:bg-accent/90 transition disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {variant === "user" && oauthIds.length > 0 && (
          <>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-primary px-4 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {oauthIds.includes("google") && (
                <button
                  type="button"
                  onClick={() => signIn("google", { callbackUrl })}
                  className="w-full rounded-lg border border-border py-2.5 font-medium text-primary-foreground hover:bg-white/5 transition"
                >
                  Continue with Google
                </button>
              )}
              {oauthIds.includes("github") && (
                <button
                  type="button"
                  onClick={() => signIn("github", { callbackUrl })}
                  className="w-full rounded-lg border border-border py-2.5 font-medium text-primary-foreground hover:bg-white/5 transition"
                >
                  Continue with GitHub
                </button>
              )}
            </div>
          </>
        )}

        <p className="text-center text-sm text-muted-foreground">
          {variant === "staff" ? (
            <>
              Customer?{" "}
              <Link href="/auth/login" className="text-accent hover:underline">
                Sign in here
              </Link>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <Link href="/auth/register" className="text-accent hover:underline">
                Create one
              </Link>
              {" · "}
              <Link
                href="/auth/staff/login"
                className="text-accent/80 hover:underline"
              >
                Staff login
              </Link>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
