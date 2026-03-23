"use client";

import Link from "next/link";
import Image from "next/image";
import { Mail, ArrowRight, Loader2, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const COL_1 = [
  { href: "/shop?category=APPAREL", label: "Apparel" },
  { href: "/shop?category=FOOTWEAR", label: "Footwear" },
  { href: "/shop?category=ACCESSORIES", label: "Accessories" },
  { href: "/tools", label: "Systems" },
  { href: "/plans", label: "Membership" },
  { href: "/company", label: "Our Story" },
] as const;

const COL_2 = [
  { href: "/dashboard/dashboard", label: "Command Center" },
  { href: "/dashboard/dashboard/orders", label: "My Orders" },
  { href: "/dashboard/dashboard/tools", label: "My Tools" },
  { href: "/dashboard/dashboard/subscription", label: "Membership" },
  { href: "/dashboard/dashboard/profile", label: "Profile Settings" },
] as const;

const COL_3 = [
  { href: "/help", label: "Help Center" },
  { href: "/feedback", label: "Feedback" },
  { href: "/shipping", label: "Shipping & Returns" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
] as const;

export function SiteFooter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === "loading") return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Something went wrong");

      setStatus("success");
      setMessage(data.message || "Welcome to the inner circle.");
      setEmail("");
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setStatus("idle");
        setMessage("");
      }, 5000);
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Subscription failed.");
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <footer className="bg-[#0A0A0A] text-[#FFFFFF] border-t border-[#FFFFFF]/5">
      <div className="mx-auto max-w-[1920px] px-6 lg:px-12 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Brand Block */}
          <div className="lg:col-span-3">
            <div className="flex items-center gap-4 mb-6 group cursor-pointer">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <Image
                  src="/KONIK%20NEW%20-%20WHITE.png"
                  alt="KONIK Logo"
                  fill
                  className="object-contain transition-transform group-hover:scale-110 duration-500"
                />
              </div>
              <span className="font-atmospheric text-2xl tracking-[0.15em]">KONIK</span>
            </div>
            <p className="text-[#FFFFFF]/50 text-[13px] leading-relaxed max-w-[240px] mb-8 font-poppins">
              Clothing & digital tools for men building a deliberate life. 
              Built for the relentless.
            </p>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[#B8860B] font-bold font-poppins">
              The Legacy Continues
            </div>
          </div>

          {/* Nav Categories */}
          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] mb-6 font-poppins">
              Explore
            </h4>
            <nav className="flex flex-col gap-3.5">
              {COL_1.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[13px] text-[#FFFFFF]/40 hover:text-[#B8860B] transition-colors font-poppins"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] mb-6 font-poppins">
              Account
            </h4>
            <nav className="flex flex-col gap-3.5">
              {COL_2.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[13px] text-[#FFFFFF]/40 hover:text-[#B8860B] transition-colors font-poppins"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] mb-6 font-poppins">
              Support
            </h4>
            <nav className="flex flex-col gap-3.5">
              {COL_3.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="text-[13px] text-[#FFFFFF]/40 hover:text-[#B8860B] transition-colors font-poppins"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Newsletter Block */}
          <div className="lg:col-span-3">
            <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#FFFFFF] mb-6 font-poppins">
              Stay in the Loop
            </h4>
            <p className="text-[#FFFFFF]/40 text-[13px] mb-6 font-poppins max-w-[280px]">
              Receive situational updates on new gear and framework deployments.
            </p>
            <form className="relative group max-w-[300px]" onSubmit={handleSubmit}>
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none z-10">
                <Mail className={cn(
                  "w-4 h-4 transition-colors",
                  status === "success" ? "text-green-500" : "text-[#FFFFFF]/20 group-focus-within:text-[#B8860B]"
                )} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={status === "success" ? "" : "Enter email address"}
                disabled={status === "loading" || status === "success"}
                className={cn(
                  "w-full bg-[#0A0A0A] border rounded-sm py-3 pl-11 pr-12 text-[13px] text-white placeholder:text-white/20 focus:outline-none transition-all font-poppins",
                  "border-white/10 focus:border-[#B8860B]/50",
                  "disabled:opacity-50",
                  "autofill:shadow-[0_0_0_1000px_#0A0A0A_inset] [selectionColor:white]",
                  status === "success" && "border-green-500/50"
                )}
                style={{ WebkitTextFillColor: "white" } as React.CSSProperties}
              />
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className={cn(
                  "absolute right-2 top-1.5 bottom-1.5 aspect-square flex items-center justify-center rounded-sm transition-all",
                  status === "success" 
                    ? "bg-green-500 text-white" 
                    : "bg-white/5 hover:bg-[#B8860B] text-white cursor-pointer"
                )}
                title="Subscribe"
              >
                {status === "loading" ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : status === "success" ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <ArrowRight className="w-4 h-4" />
                )}
              </button>
            </form>

            <div className="h-4 mt-2">
              {message && (
                <p className={cn(
                  "text-[11px] font-poppins transition-all duration-300",
                  status === "success" ? "text-green-500" : "text-red-400"
                )}>
                  {message}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="mt-20 pt-8 border-t border-[#FFFFFF]/5 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <span className="text-[11px] text-[#FFFFFF]/20 font-poppins tracking-wider">
              © {new Date().getFullYear()} KONIK. All rights reserved.
            </span>
            <div className="hidden md:flex items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-[#FFFFFF]/10">
              <span>Standard Shipping</span>
              <span className="w-1 h-1 rounded-full bg-white/5" />
              <span>Free Returns</span>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[10px] uppercase tracking-[0.3em] font-bold text-[#FFFFFF]/20 font-poppins">
              Average Is A Choice
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
