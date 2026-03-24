"use client";

import { useState, useEffect, useRef } from "react";
import { getProviders, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { X, Eye, EyeOff, ArrowLeft, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_USER_HOME } from "@/lib/auth/auth-redirect";

type Step = "email" | "verify" | "details" | "welcome";

export function UserRegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");

  // Email
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);

  // OTP
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Details
  const [firstName, setFirstName] = useState("");
  const [surname, setSurname] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [detailsError, setDetailsError] = useState("");
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Welcome
  const [discountClaimed, setDiscountClaimed] = useState(false);

  // OAuth
  const [oauthIds, setOauthIds] = useState<string[]>([]);

  useEffect(() => {
    getProviders().then((p) => {
      if (!p) return;
      setOauthIds(Object.keys(p).filter((id) => id !== "credentials"));
    });
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  // ── Handlers ──
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEmailError("");
    setEmailLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) { setEmailError(data.error || "Could not send code"); setEmailLoading(false); return; }
      setStep("verify");
      setResendTimer(60);
    } catch { setEmailError("Network error"); }
    setEmailLoading(false);
  }

  function handleOtpChange(i: number, v: string) {
    if (!/^\d*$/.test(v)) return;
    const next = [...otp]; next[i] = v.slice(-1); setOtp(next);
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  }
  function handleOtpKey(i: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  }
  function handleOtpPaste(e: React.ClipboardEvent) {
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (t.length === 6) { setOtp(t.split("")); otpRefs.current[5]?.focus(); e.preventDefault(); }
  }

  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) { setOtpError("Enter the full 6-digit code"); return; }
    setOtpError(""); setOtpLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
      });
      const data = await res.json();
      if (!res.ok) { setOtpError(data.error || "Invalid code"); setOtpLoading(false); return; }
      setStep("details");
    } catch { setOtpError("Network error"); }
    setOtpLoading(false);
  }

  async function handleResend() {
    if (resendTimer > 0) return;
    setResendTimer(60);
    try {
      await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
    } catch {}
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!agreeTerms || !agreePrivacy) { setDetailsError("Please agree to Terms and Privacy Policy"); return; }
    if (password.length < 8) { setDetailsError("Password must be at least 8 characters"); return; }
    setDetailsError(""); setDetailsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: `${firstName.trim()} ${surname.trim()}`,
          firstName: firstName.trim(),
          surname: surname.trim(),
          email: email.trim().toLowerCase(),
          password,
          dateOfBirth: dob || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setDetailsError(data.error || "Something went wrong"); setDetailsLoading(false); return; }
      const result = await signIn("credentials", { email: email.trim().toLowerCase(), password, redirect: false });
      if (result?.error) { router.push("/auth/login"); return; }
      setStep("welcome");
    } catch { setDetailsError("Something went wrong"); }
    setDetailsLoading(false);
  }

  async function handleClaimDiscount() {
    setDiscountClaimed(true);
    try { await fetch("/api/auth/claim-welcome-discount", { method: "POST" }); } catch {}
  }

  // ── Shared styles ──
  const inputCls =
    "w-full border border-[#D1D5DB] bg-white text-[#121212] rounded-md px-4 py-3 text-sm placeholder:text-[#9CA3AF] focus:border-[#121212] focus:ring-0 outline-none transition-colors";
  const btnCls =
    "w-full bg-[#121212] py-3 rounded-md text-xs font-semibold uppercase tracking-widest text-white hover:bg-[#2a2a2a] disabled:opacity-50 transition-colors";
  const slide = {
    initial: { opacity: 0, x: 16 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -16 },
    transition: { duration: 0.2 },
  };

  const stepIndex = ["email", "verify", "details"].indexOf(step);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => step !== "welcome" && router.push("/")} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="relative z-10 w-full max-w-[420px] bg-white rounded-xl shadow-2xl max-h-[92vh] overflow-y-auto"
      >
        {step !== "welcome" && (
          <button onClick={() => router.push("/")} className="absolute top-3.5 right-3.5 p-1.5 text-[#9CA3AF] hover:text-[#121212] transition-colors z-20" aria-label="Close">
            <X className="w-4 h-4" />
          </button>
        )}

        <div className="px-7 pt-8 pb-7 sm:px-8">
          {/* Logo */}
          <Link href="/" className="flex justify-center mb-5">
            <Image src="/logos/konik-logo-black.png" alt="KONIK" width={32} height={32} priority />
          </Link>

          {/* Steps — minimal dots */}
          {step !== "welcome" && (
            <div className="flex items-center justify-center gap-1.5 mb-6">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    i <= stepIndex ? "bg-[#121212] w-6" : "bg-[#E5E7EB] w-4"
                  }`}
                />
              ))}
            </div>
          )}

          <AnimatePresence mode="wait">
            {/* ── Email ── */}
            {step === "email" && (
              <motion.div key="email" {...slide}>
                <h2 className="font-atmospheric text-lg tracking-wide text-[#121212] uppercase text-center mb-1">
                  Join KONIK
                </h2>
                <p className="text-xs text-[#6B7280] text-center mb-6">
                  Enter your email to get started.
                </p>

                <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                  {emailError && <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2.5 text-xs text-red-600 font-medium">{emailError}</div>}
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className={inputCls} placeholder="Email address" autoFocus />
                  <button type="submit" disabled={emailLoading} className={btnCls}>{emailLoading ? "Sending code…" : "Continue"}</button>
                </form>

                {oauthIds.length > 0 && (
                  <>
                    <div className="flex items-center gap-3 my-5">
                      <div className="flex-1 h-px bg-[#E5E7EB]" />
                      <span className="text-[10px] uppercase tracking-widest text-[#9CA3AF] font-semibold">or</span>
                      <div className="flex-1 h-px bg-[#E5E7EB]" />
                    </div>
                    {oauthIds.includes("google") && (
                      <button type="button" onClick={() => signIn("google", { callbackUrl: DEFAULT_USER_HOME })} className="flex items-center justify-center gap-2.5 w-full border border-[#E5E7EB] py-2.5 rounded-md text-xs font-semibold text-[#121212] hover:bg-[#F9FAFB] transition-colors">
                        <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        Continue with Google
                      </button>
                    )}
                  </>
                )}

                <p className="text-xs text-[#6B7280] text-center mt-5 pt-4 border-t border-[#F3F4F6]">
                  Already a member?{" "}
                  <Link href="/auth/login" className="font-semibold text-[#121212] hover:text-[#B8860B] transition-colors">Sign In</Link>
                </p>
              </motion.div>
            )}

            {/* ── Verify OTP ── */}
            {step === "verify" && (
              <motion.div key="verify" {...slide}>
                <button onClick={() => setStep("email")} className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#121212] transition-colors mb-4">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <h2 className="font-atmospheric text-lg tracking-wide text-[#121212] uppercase text-center mb-1">
                  Verify Email
                </h2>
                <p className="text-xs text-[#6B7280] text-center mb-6">
                  Enter the 6-digit code sent to <span className="font-semibold text-[#121212]">{email}</span>
                </p>

                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  {otpError && <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2.5 text-xs text-red-600 font-medium">{otpError}</div>}

                  <div className="flex justify-center gap-2.5" onPaste={handleOtpPaste}>
                    {otp.map((d, i) => (
                      <input
                        key={i}
                        ref={(el) => { otpRefs.current[i] = el; }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={d}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleOtpKey(i, e)}
                        className="w-11 h-12 text-center text-lg font-semibold border border-[#D1D5DB] rounded-md focus:border-[#121212] focus:ring-0 outline-none transition-colors"
                        autoFocus={i === 0}
                      />
                    ))}
                  </div>

                  <button type="submit" disabled={otpLoading} className={btnCls}>{otpLoading ? "Verifying…" : "Verify"}</button>
                </form>

                <p className="text-xs text-center mt-4 text-[#6B7280]">
                  {resendTimer > 0
                    ? <>Resend in <span className="font-semibold text-[#121212]">{resendTimer}s</span></>
                    : <button onClick={handleResend} className="font-semibold text-[#121212] hover:text-[#B8860B] transition-colors">Resend code</button>
                  }
                </p>
              </motion.div>
            )}

            {/* ── Details ── */}
            {step === "details" && (
              <motion.div key="details" {...slide}>
                <button onClick={() => setStep("verify")} className="flex items-center gap-1 text-xs text-[#6B7280] hover:text-[#121212] transition-colors mb-4">
                  <ArrowLeft className="w-3.5 h-3.5" /> Back
                </button>

                <h2 className="font-atmospheric text-lg tracking-wide text-[#121212] uppercase text-center mb-1">
                  Your Details
                </h2>
                <p className="text-xs text-[#6B7280] text-center mb-5">
                  Almost there — create your account.
                </p>

                <form onSubmit={handleCreate} className="space-y-3">
                  {detailsError && <div className="bg-red-50 border border-red-200 rounded-md px-3 py-2.5 text-xs text-red-600 font-medium">{detailsError}</div>}

                  <div className="grid grid-cols-2 gap-2.5">
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className={inputCls} placeholder="First name" autoFocus />
                    <input type="text" value={surname} onChange={(e) => setSurname(e.target.value)} required className={inputCls} placeholder="Surname" />
                  </div>

                  <div>
                    <div className="flex items-baseline justify-between mb-1">
                      <label className="text-xs text-[#6B7280]">Date of Birth</label>
                      <span className="text-[10px] text-[#B8860B] font-medium">Birthday discount included</span>
                    </div>
                    <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} className={inputCls} max={new Date().toISOString().split("T")[0]} />
                  </div>

                  <div className="relative">
                    <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} autoComplete="new-password" className={`${inputCls} pr-10`} placeholder="Password (min 8 characters)" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#121212] transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Verified email */}
                  <div className="flex items-center gap-2 bg-[#F0FDF4] rounded-md px-3 py-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span className="text-xs text-emerald-700 truncate">{email}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold ml-auto shrink-0">Verified</span>
                  </div>

                  {/* Terms — compact */}
                  <div className="space-y-2 pt-1">
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-3.5 h-3.5 rounded border-[#D1D5DB] text-[#121212] focus:ring-0 accent-[#121212]" />
                      <span className="text-xs text-[#6B7280]">
                        I agree to the <Link href="/terms" target="_blank" className="underline font-medium text-[#121212]">Terms & Conditions</Link>
                      </span>
                    </label>
                    <label className="flex items-center gap-2.5 cursor-pointer select-none">
                      <input type="checkbox" checked={agreePrivacy} onChange={(e) => setAgreePrivacy(e.target.checked)} className="w-3.5 h-3.5 rounded border-[#D1D5DB] text-[#121212] focus:ring-0 accent-[#121212]" />
                      <span className="text-xs text-[#6B7280]">
                        I agree to the <Link href="/privacy" target="_blank" className="underline font-medium text-[#121212]">Privacy Policy</Link>
                      </span>
                    </label>
                  </div>

                  <button type="submit" disabled={detailsLoading || !agreeTerms || !agreePrivacy} className={`${btnCls} mt-1`}>
                    {detailsLoading ? "Creating account…" : "Create Account"}
                  </button>
                </form>
              </motion.div>
            )}

            {/* ── Welcome ── */}
            {step === "welcome" && (
              <motion.div key="welcome" {...slide} className="text-center">
                <h2 className="font-atmospheric text-xl tracking-wide text-[#121212] uppercase mb-1">
                  Welcome, {firstName}
                </h2>
                <p className="text-sm text-[#121212] font-medium mb-0.5">
                  You&apos;re now part of KONIK.
                </p>
                <p className="text-xs text-[#6B7280] mb-6">
                  Let&apos;s start building your legacy.
                </p>

                {/* Discount — clean card */}
                <div className="bg-[#121212] rounded-lg px-5 py-5 text-left mb-5">
                  <p className="text-[10px] text-[#B8860B] font-semibold uppercase tracking-widest mb-1">
                    First Purchase Offer
                  </p>
                  <p className="text-base font-bold text-white mb-2">
                    40% off your first order
                  </p>
                  <p className="text-[11px] text-[#9CA3AF] mb-4">
                    Automatically applied at checkout.
                  </p>

                  {!discountClaimed ? (
                    <button onClick={handleClaimDiscount} className="w-full bg-[#B8860B] hover:bg-[#9A7209] text-white py-2.5 rounded-md text-xs font-semibold uppercase tracking-widest transition-colors">
                      Claim Discount
                    </button>
                  ) : (
                    <div className="w-full bg-emerald-600 text-white py-2.5 rounded-md text-xs font-semibold uppercase tracking-widest text-center flex items-center justify-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> Claimed
                    </div>
                  )}
                </div>

                <button onClick={() => { router.push("/shop"); router.refresh(); }} className={btnCls}>
                  Start Shopping
                </button>

                <button onClick={() => { router.push(DEFAULT_USER_HOME); router.refresh(); }} className="text-xs text-[#6B7280] hover:text-[#121212] transition-colors mt-3 block mx-auto">
                  Go to Dashboard
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
