"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiLogin } from "@/lib/auth";
import { Eye, EyeOff, BookOpen } from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiLogin({ email, password });
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        router.push("/dashboard");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL — Image placeholder ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#0d1b3e" }}>

        {/* Hardcoded background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />
        {/* Navy-blue overlay */}
        <div className="absolute inset-0" style={{ background: "rgba(13,27,62,0.72)" }} />

        {/* Decorative dots pattern */}
        <svg className="absolute top-12 right-12 opacity-20 z-10" width="120" height="120" viewBox="0 0 120 120">
          {Array.from({ length: 36 }).map((_, i) => (
            <circle key={i} cx={(i % 6) * 20 + 10} cy={Math.floor(i / 6) * 20 + 10} r="2" fill="#f5c518" />
          ))}
        </svg>
        <svg className="absolute bottom-24 left-8 opacity-20 z-10" width="80" height="80" viewBox="0 0 80 80">
          {Array.from({ length: 16 }).map((_, i) => (
            <circle key={i} cx={(i % 4) * 20 + 10} cy={Math.floor(i / 4) * 20 + 10} r="2" fill="#f5c518" />
          ))}
        </svg>

        {/* Gold wavy accent */}
        <svg className="absolute bottom-40 left-0 w-full opacity-30 z-10" viewBox="0 0 600 40" preserveAspectRatio="none">
          <path d="M0,20 Q150,0 300,20 T600,20" stroke="#f5c518" strokeWidth="3" fill="none" />
          <path d="M0,30 Q150,10 300,30 T600,30" stroke="#f5c518" strokeWidth="2" fill="none" />
        </svg>

        {/* Content overlay */}
        <div className="relative z-10 flex flex-col justify-between w-full p-12">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="p-2" style={{ background: "#f5c518" }}>
              <BookOpen className="w-6 h-6" style={{ color: "#0d1b3e" }} />
            </div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#fff", letterSpacing: "0.06em" }}>
              ACADEMIQ
            </span>
          </div>

          {/* Hero text */}
          <div className="mb-16">
            <p className="section-label mb-4">PLACE TO GROW</p>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "3.2rem", lineHeight: 1.05, color: "#fff" }}>
              WE CREATING<br />LEADERS FOR<br />TOMORROW
            </h1>
            <p className="mt-4 text-white/70 text-sm leading-relaxed max-w-xs">
              Master Physics, Chemistry &amp; Mathematics with expert-curated content built for JEE success.
            </p>

            <div className="flex gap-3 mt-8">
              {["10k+ Problems", "Expert Faculty", "AI Analytics"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-white/80 text-xs">
                  <div className="w-1.5 h-1.5 flex-shrink-0" style={{ background: "#f5c518" }} />
                  {f}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL — Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: "#f5f6f8" }}>
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="p-1.5" style={{ background: "#f5c518" }}>
              <BookOpen className="w-5 h-5" style={{ color: "#0d1b3e" }} />
            </div>
            <span style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.3rem", color: "#0d1b3e" }}>ACADEMIQ</span>
          </div>

          {/* Card */}
          <div className="bg-white shadow-xl border-0 overflow-hidden">

            {/* Gold top bar */}
            <div className="h-1.5 w-full" style={{ background: "#f5c518" }} />

            <div className="p-8 pt-7">
              <div className="mb-7">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}>
                  STUDENT LOGIN
                </p>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#0d1b3e" }}>
                  WELCOME BACK
                </h2>
                <p className="text-sm text-gray-500 mt-1">Sign in to continue your JEE journey</p>
              </div>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full h-11 px-4 border-2 border-gray-200 bg-white text-gray-900 text-sm outline-none transition-all focus:border-[#f5c518] focus:ring-0 placeholder:text-gray-400"
                    style={{ borderRadius: 0 }}
                  />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className="text-xs font-bold uppercase tracking-wider text-gray-600">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full h-11 px-4 pr-11 border-2 border-gray-200 bg-white text-gray-900 text-sm outline-none transition-all focus:border-[#f5c518] focus:ring-0 placeholder:text-gray-400"
                      style={{ borderRadius: 0 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Forgot */}
                <div className="flex justify-end">
                  <Link href="/forgot-password" className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#0d1b3e" }}>
                    Forgot password?
                  </Link>
                </div>

                {/* CTA */}
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold w-full h-12 flex items-center justify-center gap-2 disabled:opacity-60"
                  style={{ borderRadius: 0 }}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      SIGNING IN...
                    </span>
                  ) : "SIGN IN →"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Don&apos;t have an account?{" "}
                  <Link href="/signup" className="font-bold uppercase text-xs tracking-wider" style={{ color: "#0d1b3e" }}>
                    Create one
                  </Link>
                </p>
              </div>
            </div>
          </div>

          {/* Subjects strip */}
          <div className="mt-6 grid grid-cols-3 gap-2">
            {[
              { label: "Physics", icon: "⚡" },
              { label: "Chemistry", icon: "⚗️" },
              { label: "Mathematics", icon: "∑" },
            ].map(({ label, icon }) => (
              <div key={label} className="text-center py-3" style={{ background: "#0d1b3e" }}>
                <div className="text-lg">{icon}</div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-white/70 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
