"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [agree, setAgree] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [error, setError] = useState("");
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (window.innerWidth / 2 - e.pageX) / 60;
      const y = (window.innerHeight / 2 - e.pageY) / 60;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      setError("You must agree to the Terms of Service and Privacy Policy.");
      return;
    }
    setError("");
    setLoadingState(true);

    const res = await signup(name, email, password);
    setLoadingState(false);

    if (res.success) {
      router.push("/verify?email=" + encodeURIComponent(email));
    } else {
      setError(res.message);
    }
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

      {/* Main split-pane content */}
      <main className="min-h-screen flex items-center justify-center pt-20 overflow-hidden relative flex-grow bg-background">
        <div className="absolute inset-0 w-full h-full z-0 flex">
          {/* Left Side (Space for Form) */}
          <div className="w-full lg:w-[45%] bg-surface z-10"></div>
          {/* Right Side (Imagery & Gradient overlay) */}
          <div className="hidden lg:block lg:w-[55%] relative overflow-hidden">
            <div className="absolute inset-0 hero-gradient-split z-20"></div>
            <img
              className="w-full h-full object-cover select-none"
              alt="Maldives Sunset Resort"
              src="/images/maldives.jpg"
            />
          </div>
        </div>

        {/* Content Box */}
        <div className="container max-w-7xl mx-auto px-6 md:px-12 relative z-30">
          <div className="flex flex-col lg:flex-row items-center w-full">
            {/* Form Panel */}
            <div className="w-full lg:w-[420px] py-12">
              <div className="mb-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h1 className="font-display text-3xl md:text-4xl font-bold text-on-surface mb-2">Create Account</h1>
                <p className="text-on-surface-variant font-sans text-sm">Begin your journey across the most exclusive stays.</p>
              </div>

              {/* Social Logins */}
              <div className="flex flex-col gap-4 mb-8">
                <Button
                  type="button"
                  variant="outline"
                  className="flex items-center justify-center gap-3 w-full py-6 rounded-xl border border-outline-variant bg-surface hover:bg-muted transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  <img
                    alt="Google logo"
                    className="w-5 h-5"
                    src="/images/google-icon.png"
                  />
                  <span className="font-sans text-sm font-semibold text-on-surface">Continue with Google</span>
                </Button>
                <Button
                  type="button"
                  className="flex items-center justify-center gap-3 w-full py-6 rounded-xl bg-on-background text-surface hover:opacity-90 transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    apps
                  </span>
                  <span className="font-sans text-sm font-semibold">Continue with Apple</span>
                </Button>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="h-[1px] flex-grow bg-outline-variant"></div>
                <span className="text-on-surface-variant font-sans text-xs font-semibold uppercase tracking-widest">Or email</span>
                <div className="h-[1px] flex-grow bg-outline-variant"></div>
              </div>

              <form className="space-y-6" onSubmit={handleSubmit}>
                {error && (
                  <div className="bg-destructive/10 text-destructive text-sm p-4 rounded-xl border border-destructive/20 font-sans font-medium text-left">
                    {error}
                  </div>
                )}

                <div className="space-y-1.5 text-left">
                  <Label className="font-sans text-xs font-semibold text-on-surface-variant ml-1" htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl z-10">person</span>
                    <Input
                      id="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-12 pr-4 py-6 rounded-xl border border-border bg-surface text-on-surface placeholder:text-outline/70 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none text-sm"
                      placeholder="Alex Athereal"
                      type="text"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <Label className="font-sans text-xs font-semibold text-on-surface-variant ml-1" htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl z-10">mail</span>
                    <Input
                      id="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-6 rounded-xl border border-border bg-surface text-on-surface placeholder:text-outline/70 focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all outline-none text-sm"
                      placeholder="alex@athereal.com"
                      type="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-left">
                  <Label className="font-sans text-xs font-semibold text-on-surface-variant ml-1" htmlFor="password">Password</Label>
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
                  </div>
                </div>

                <div className="flex items-start gap-3 px-1">
                  <input
                    required
                    className="w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary/20 mt-0.5 cursor-pointer"
                    id="agree"
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  <Label className="font-sans text-sm text-on-surface-variant cursor-pointer select-none leading-relaxed" htmlFor="agree">
                    I agree to the{" "}
                    <a href="#" className="text-primary hover:underline">Terms of Service</a>{" "}
                    and{" "}
                    <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={loadingState}
                  className="w-full py-6 bg-primary text-on-primary rounded-full font-sans text-sm font-semibold shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all duration-300 mt-4 cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
                >
                  {loadingState ? "Creating Account..." : "Create Account"}
                </Button>

              </form>

              <div className="mt-8 text-center">
                <p className="text-on-surface-variant font-sans text-sm">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-bold hover:underline cursor-pointer ml-1"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            {/* Testimonial Box */}
            <div className="hidden lg:flex flex-grow items-center justify-end pl-24 select-none">
              <div
                className="glass-panel p-8 rounded-[32px] shadow-xl border border-white/40 max-w-sm transition-transform duration-100 ease-out"
                style={{
                  transform: `translate(${mousePos.x + 48}px, ${mousePos.y + 48}px)`,
                }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-primary-container">
                    <img
                      alt="Sarah J. Avatar"
                      className="w-full h-full object-cover"
                      src="/images/avatar-sarah.jpg"
                    />
                  </div>
                  <div>
                    <h4 className="font-sans text-sm font-bold text-on-surface">Sarah Jenkins</h4>
                    <div className="flex text-primary">
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    </div>
                  </div>
                </div>
                <p className="text-on-surface-variant font-sans text-sm italic leading-relaxed">
                  "The check-in process was as seamless as the view from my room. Truly the airy luxury LuxeStay promised."
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 bg-surface-container-lowest border-t border-outline-variant z-40 relative">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 md:px-12 max-w-7xl mx-auto gap-6">
          <div className="font-display text-sm font-bold text-primary">LuxeStay</div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="#">Terms of Service</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="#">Help Center</a>
            <a className="text-on-surface-variant hover:text-primary transition-colors font-sans text-xs font-semibold" href="#">Careers</a>
          </div>
          <div className="text-on-surface-variant font-sans text-xs">
            © {new Date().getFullYear()} LuxeStay Athereal Travel. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
