"use client";

import { useState } from "react";
import { getSession, signIn, signOut } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { STAFF_ADMIN_HOME, sessionUserHasStaffAccess } from "@/lib/auth-redirect";

export function StaffLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || STAFF_ADMIN_HOME;
  const authError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(
    authError ? decodeURIComponent(authError.replace(/\+/g, " ")) : ""
  );
  const [loading, setLoading] = useState(false);

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
      setError("Invalid credentials. Access denied.");
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

    if (!isStaff) {
      await signOut({ redirect: false });
      setError("This account does not have staff privileges.");
      return;
    }

    const nextUrl = callbackUrl.startsWith("/admin") ? callbackUrl : STAFF_ADMIN_HOME;
    router.push(nextUrl);
    router.refresh();
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-[#121212] text-[#FFFFFF] font-sans">
      {/* Brand Panel (Left) - Inverted to White for Staff */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 lg:p-20 bg-[#FFFFFF] text-[#121212] relative overflow-hidden text-center">
        <div className="absolute top-30 left-1/2 -translate-x-1/2">
          <Link href="/">
            <Image
              src="/KONIK%20NEW%20-%20BLACK.png"
              alt="KONIK Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </Link>
        </div>
        
        <div className="w-full space-y-6">
          <h1 className="font-atmospheric text-3xl lg:text-4xl leading-none tracking-wide whitespace-nowrap">
            INTERNAL <span className="text-[#B8860B]">SYSTEMS.</span>
          </h1>
          <p className="text-[#4B5563] text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Authorized personnel only. Secure access required to enter the staff portal.
          </p>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#4B5563] uppercase tracking-widest whitespace-nowrap">
          © {new Date().getFullYear()} KONIK. Internal network.
        </div>
      </div>

      {/* Form Panel (Right) - Inverted to Black for Staff */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 relative">
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-10 flex flex-col items-center">
            <Link href="/">
              <Image
                src="/KONIK%20NEW%20-%20WHITE.png"
                alt="KONIK Logo"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </Link>
            <div className="mt-4 text-[11px] font-bold tracking-[0.3em] uppercase text-[#B8860B] text-center whitespace-nowrap">
              Internal Systems
            </div>
          </div>
          
          <div className="mb-8 text-center">
            <h2 className="font-atmospheric text-2xl tracking-wide text-[#FFFFFF] mb-2 uppercase whitespace-nowrap">
              Staff Portal
            </h2>
            <p className="text-sm text-[#4B5563] font-normal whitespace-nowrap">
              Enter your credentials to establish a secure connection.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-red-900/50 bg-red-900/20 p-3 text-sm font-medium text-red-500">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full border border-gray-800 bg-[#121212] text-[#FFFFFF] px-4 py-3 text-sm placeholder:text-gray-500 focus:border-[#FFFFFF] focus:ring-1 focus:ring-[#FFFFFF] transition-colors outline-none"
                  placeholder="Email Address"
                />
              </div>

              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full border border-gray-800 bg-[#121212] text-[#FFFFFF] px-4 py-3 text-sm placeholder:text-gray-500 focus:border-[#FFFFFF] focus:ring-1 focus:ring-[#FFFFFF] transition-colors outline-none"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FFFFFF] py-3 text-sm font-bold uppercase tracking-wider text-[#121212] transition-opacity hover:opacity-90 disabled:opacity-70"
              >
                {loading ? "Authenticating..." : "Login"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-[#4B5563]">
            Not authorized?{" "}
            <Link href="/auth/login" className="font-semibold text-[#FFFFFF] hover:text-[#B8860B] transition-colors underline underline-offset-2 decoration-2 decoration-transparent hover:decoration-[#B8860B]">
              CUSTOMER PORTAL
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
