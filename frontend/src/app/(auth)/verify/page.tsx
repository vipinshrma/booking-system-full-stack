"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function VerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "alex@athereal.com";

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(59);
  const otpRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Countdown timer for 2FA resend
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    alert(`Account verified successfully with code: ${code}`);
    router.push("/");
  };

  const handleOtpChange = (val: string, index: number) => {
    if (isNaN(Number(val))) return;
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Focus next input if value is entered
    if (val !== "" && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs[index - 1].current?.focus();
    }
  };

  const handleResendCode = () => {
    setTimer(59);
    alert("Verification code has been resent to your email.");
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-white/70 backdrop-blur-md shadow-[0_10px_40px_rgba(31,41,55,0.05)] border-none">
        <div className="flex justify-between items-center h-20 px-6 md:px-12 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <span
              className="material-symbols-outlined text-primary text-3xl transition-transform group-hover:rotate-12 duration-300"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              flight_takeoff
            </span>
            <span className="font-display text-2xl font-bold tracking-tight text-on-surface">
              LuxeStay
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-on-surface-variant hover:text-primary font-sans text-sm font-semibold transition-all"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow flex flex-col items-center justify-center pt-24 pb-16 px-6 relative z-10 bg-background">
        <div className="w-full max-w-[480px] bg-white/80 glass-panel rounded-[32px] p-8 md:p-12 shadow-xl border border-white/40 z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
              mark_email_unread
            </span>
          </div>
          <h1 className="font-display text-3xl font-bold text-on-surface mb-3">Verify Your Email</h1>
          <p className="font-sans text-sm text-on-surface-variant mb-10 max-w-[340px]">
            We've sent a 4-digit verification code to <span className="font-semibold text-on-surface">{email}</span>. Please enter it below.
          </p>

          <form className="space-y-8 w-full" onSubmit={handleSubmit}>
            <div className="flex justify-center gap-4" id="otp-container">
              {otp.map((digit, idx) => (
                <Input
                  key={idx}
                  ref={otpRefs[idx]}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, idx)}
                  onKeyDown={(e) => handleOtpKeyDown(e, idx)}
                  maxLength={1}
                  className="w-16 h-20 text-center font-display text-2xl font-bold border border-outline-variant rounded-2xl bg-white hover:border-outline focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all duration-200 outline-none shadow-sm"
                  type="text"
                  pattern="[0-9]*"
                  inputMode="numeric"
                  autoFocus={idx === 0}
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={otp.some((d) => d === "")}
              className="w-full py-6 bg-primary text-on-primary rounded-full font-sans text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              Verify Account
            </Button>

            <div className="flex flex-col items-center gap-2 pt-2">
              <p className="font-sans text-xs text-on-surface-variant uppercase tracking-widest">Didn't receive the code?</p>
              <Button
                type="button"
                variant="ghost"
                onClick={handleResendCode}
                disabled={timer > 0}
                className="text-primary font-semibold text-sm hover:underline disabled:opacity-50 disabled:no-underline transition-all cursor-pointer bg-transparent hover:bg-transparent"
              >
                {timer > 0 ? `Resend Code in ${timer}s` : "Resend Code Now"}
              </Button>
            </div>
          </form>

          <div className="mt-8">
            <Link
              href="/login"
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Decoration Pool Image bottom right */}
        <div className="hidden lg:block fixed bottom-0 right-0 w-1/4 h-1/2 -z-10 overflow-hidden rounded-tl-[100px] shadow-2xl">
          <img
            className="w-full h-full object-cover"
            alt="Sunrise pool view"
            src="/images/pool-sunrise-desktop.jpg"
          />
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-surface-container-lowest border-t border-outline-variant z-40 relative">
        <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <span className="text-on-surface-variant font-sans text-xs">
            © {new Date().getFullYear()} LuxeStay Athereal Travel. All rights reserved.
          </span>
          <div className="flex gap-8">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="#">Terms of Service</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="#">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-background">Loading verification...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
