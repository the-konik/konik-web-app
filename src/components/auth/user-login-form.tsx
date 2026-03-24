"use client";

import { useState, useEffect } from "react";
import { getProviders, getSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X, Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import {
  DEFAULT_USER_HOME,
  postAuthRedirectUrl,
  sessionUserHasStaffAccess,
} from "@/lib/auth/auth-redirect";

export function UserLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || DEFAULT_USER_HOME;
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(
    authError ? decodeURIComponent(authError.replace(/\+/g, " ")) : ""
  );
  const [loading, setLoading] = useState(false);
  const [oauthIds, setOauthIds] = useState<string[]>([]);

  useEffect(() => {
    getProviders().then((p) => {
      if (!p) return;
      setOauthIds(Object.keys(p).filter((id) => id !== "credentials"));
    });
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("konik_remember_email");
    if (saved) { setEmail(saved); setRememberMe(true); }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (rememberMe) localStorage.setItem("konik_remember_email", email);
    else localStorage.removeItem("konik_remember_email");

    const result = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (result?.error || !result?.ok) {
      setError("Invalid email or password");
      return;
    }

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

    router.push(postAuthRedirectUrl(isStaff, callbackUrl));
    router.refresh();
  }

  const inputCls =
    "w-full border border-[#D1D5DB] bg-white text-[#121212] rounded-md px-4 py-3 text-sm placeholder:text-[#9CA3AF] focus:border-[#121212] focus:ring-0 outline-none transition-colors";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => router.push("/")} />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-[400px] bg-white rounded-xl shadow-2xl"
      >
        <button
          onClick={() => router.push("/")}
          className="absolute top-3.5 right-3.5 p-1.5 text-[#9CA3AF] hover:text-[#121212] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="px-7 pt-8 pb-7 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex justify-center mb-7">
            <Image src="/logos/konik-logo-black.png" alt="KONIK" width={32} height={32} priority />
          </Link>

          <h2 className="font-atmospheric text-lg tracking-wide text-[#121212] uppercase text-center mb-1">
            Sign In
          </h2>
          <p className="text-xs text-[#6B7280] text-center mb-6">
            Access your account and exclusive drops.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2.5 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className={inputCls}
              placeholder="Email address"
            />

            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className={`${inputCls} pr-10`}
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#121212] transition-colors"
                aria-label={showPassword ? "Hide" : "Show"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-[#D1D5DB] text-[#121212] focus:ring-0 accent-[#121212]"
                />
                <span className="text-xs text-[#6B7280]">Remember me</span>
              </label>
              <Link href="/auth/forgot-password" className="text-xs text-[#6B7280] hover:text-[#121212] transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#121212] py-3 rounded-md text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#2a2a2a] disabled:opacity-50 transition-colors mt-1"
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* OAuth */}
          {oauthIds.length > 0 && (
            <>
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-[#E5E7EB]" />
                <span className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-semibold">or</span>
                <div className="flex-1 h-px bg-[#E5E7EB]" />
              </div>
              <div className="space-y-2.5">
                {oauthIds.includes("google") && (
                  <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl })}
                    className="flex items-center justify-center gap-2.5 w-full border border-[#E5E7EB] py-2.5 rounded-md text-xs font-semibold text-[#121212] hover:bg-[#F9FAFB] transition-colors"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                )}
              </div>
            </>
          )}

          <p className="text-xs text-[#6B7280] text-center mt-6 pt-5 border-t border-[#F3F4F6]">
            Not a member?{" "}
            <Link href="/auth/register" className="font-semibold text-[#121212] hover:text-[#B8860B] transition-colors">
              Join KONIK
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
