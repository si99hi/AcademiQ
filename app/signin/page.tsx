"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiLogin } from "@/lib/auth";
import { Eye, EyeOff } from "lucide-react";
import { AuthBrandPanel, AuthMobileLogo, AuthSubjectsStrip } from "@/components/auth-brand-panel";

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      <AuthBrandPanel />

      {/* ── RIGHT PANEL — Form ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: "#f5f6f8" }}>
        <div className="w-full max-w-md">

          <AuthMobileLogo />

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

          <AuthSubjectsStrip />
        </div>
      </div>
    </div>
  );
}
