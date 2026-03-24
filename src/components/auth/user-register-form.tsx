"use client";

import { useState, useEffect } from "react";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { DEFAULT_USER_HOME } from "@/lib/auth/auth-redirect";

export function UserRegisterForm() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthIds, setOauthIds] = useState<string[]>([]);

  useEffect(() => {
    getProviders().then((p) => {
      if (!p) return;
      setOauthIds(Object.keys(p).filter((id) => id !== "credentials"));
    });
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/auth/login");
        return;
      }

      router.push(DEFAULT_USER_HOME);
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2 bg-[#FFFFFF] text-[#121212] font-sans">
      {/* Brand Panel (Left) */}
      <div className="hidden lg:flex flex-col justify-center items-center p-12 lg:p-20 bg-[#121212] text-[#FFFFFF] relative overflow-hidden text-center">
        <div className="absolute top-30 left-1/2 -translate-x-1/2">
          <Link href="/">
            <Image
              src="/logos/konik-logo-white.png"
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
            JOIN THE <span className="text-[#B8860B]">ELITE.</span>
          </h1>
          <p className="text-[#F8F8F8] text-lg font-light leading-relaxed max-w-2xl mx-auto">
            Gain exclusive access to premium drops, private tools, and a community of high-achievers.
          </p>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-[#4B5563] uppercase tracking-widest whitespace-nowrap">
          © {new Date().getFullYear()} KONIK. The Legacy Continues.
        </div>
      </div>

      {/* Form Panel (Right) */}
      <div className="flex w-full flex-col justify-center px-6 py-12 sm:px-12 lg:px-20 relative">
        {/* Back Button */}
        <Link 
          href="/" 
          className="absolute top-6 right-6 sm:top-8 sm:right-8 text-[#4B5563] hover:text-[#121212] transition-colors p-2 z-20"
          aria-label="Back to home"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6" />
        </Link>
        <div className="w-full max-w-md mx-auto">
          <div className="lg:hidden mb-10 flex justify-center">
            <Link href="/">
              <Image
                src="/logos/konik-logo-black.png"
                alt="KONIK Logo"
                width={80}
                height={80}
                className="object-contain"
                priority
              />
            </Link>
          </div>
          
          <div className="mb-8 text-center px-4 sm:px-0">
            <h2 className="font-atmospheric text-xl sm:text-2xl tracking-wide text-[#121212] mb-3 uppercase">
              Become a Member
            </h2>
            <p className="text-sm text-[#4B5563] font-normal leading-relaxed">
              Create your profile to start building your legacy.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label htmlFor="name" className="sr-only">Full Name</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="block w-full border border-gray-300 bg-[#FFFFFF] text-[#121212] px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition-colors outline-none"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">Email Address</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full border border-gray-300 bg-[#FFFFFF] text-[#121212] px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition-colors outline-none"
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
                  className="block w-full border border-gray-300 bg-[#FFFFFF] text-[#121212] px-4 py-3 text-sm placeholder:text-gray-400 focus:border-[#121212] focus:ring-1 focus:ring-[#121212] transition-colors outline-none"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#121212] py-3 text-sm font-bold uppercase tracking-wider text-[#FFFFFF] transition-opacity hover:opacity-90 disabled:opacity-70"
              >
                {loading ? "Creating..." : "Join Now"}
              </button>
            </div>
          </form>

          {oauthIds.length > 0 && (
            <div className="mt-8">
              <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-[10px] uppercase tracking-widest font-semibold">
                  <span className="bg-[#FFFFFF] px-4 text-[#4B5563]">
                    Or connect with
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {oauthIds.includes("google") && (
                  <button
                    type="button"
                    onClick={() => signIn("google", { callbackUrl: DEFAULT_USER_HOME })}
                    className="flex items-center justify-center gap-2 w-full border border-gray-300 bg-[#FFFFFF] py-3 text-xs font-semibold uppercase tracking-wider text-[#121212] hover:bg-[#F8F8F8] transition-colors"
                  >
                     <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continue with Google
                  </button>
                )}
                {oauthIds.includes("github") && (
                  <button
                    type="button"
                    onClick={() => signIn("github", { callbackUrl: DEFAULT_USER_HOME })}
                    className="flex items-center justify-center gap-2 w-full border border-gray-300 bg-[#FFFFFF] py-3 text-xs font-semibold uppercase tracking-wider text-[#121212] hover:bg-[#F8F8F8] transition-colors"
                  >
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    Continue with GitHub
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-[#4B5563]">
            Already a member?{" "}
            <Link href="/auth/login" className="font-semibold text-[#121212] hover:text-[#B8860B] transition-colors underline underline-offset-2 decoration-2 decoration-transparent hover:decoration-[#B8860B]">
              SIGN IN
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
