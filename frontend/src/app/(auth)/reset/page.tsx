"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    router.push("/login");
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
        <div className="w-full max-w-[480px] bg-white/80 glass-panel rounded-[32px] p-8 md:p-12 shadow-xl border border-white/40 z-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-primary text-3xl">lock</span>
            </div>
            <h1 className="font-display text-3xl font-bold text-on-surface mb-3">Reset Password</h1>
            <p className="font-sans text-sm text-on-surface-variant max-w-[340px]">
              Choose a strong and secure password to protect your account.
            </p>
          </div>

          <form className="space-y-6 text-left" onSubmit={handleSubmit}>
            <div className="space-y-1.5 text-left">
              <Label className="font-sans text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-wider" htmlFor="password">New Password</Label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl z-10">lock</span>
                <Input
                  id="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-6 rounded-xl border border-border bg-surface text-on-surface placeholder:text-outline/70 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none text-sm"
                  placeholder="••••••••"
                  type={showPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer z-10"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-1.5 text-left">
              <Label className="font-sans text-xs font-semibold text-on-surface-variant ml-1 uppercase tracking-wider" htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl z-10">lock</span>
                <Input
                  id="confirmPassword"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-6 rounded-xl border border-border bg-surface text-on-surface placeholder:text-outline/70 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none text-sm"
                  placeholder="••••••••"
                  type={showConfirmPassword ? "text" : "password"}
                />
                <button
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface cursor-pointer z-10"
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <span className="material-symbols-outlined text-xl">
                    {showConfirmPassword ? "visibility_off" : "visibility"}
                  </span>
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full py-6 bg-primary text-on-primary rounded-full font-sans text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer mt-4"
            >
              Reset Password
              <span className="material-symbols-outlined text-lg">check_circle</span>
            </Button>
          </form>

          <div className="mt-8 text-center">
            <Link
              href="/login"
              className="text-primary font-bold hover:underline cursor-pointer"
            >
              Back to Sign In
            </Link>
          </div>
        </div>

        {/* Contextual Branding Image */}
        <div className="w-full max-w-[480px] mt-8 opacity-45 hover:opacity-100 transition-opacity duration-1000 mx-auto z-10">
          <div className="w-full h-[180px] rounded-[24px] overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-md">
            <img
              className="w-full h-full object-cover"
              alt="Sunrise infinity pool"
              src="/images/pool-sunrise.jpg"
            />
          </div>
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
