"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiRegister } from "@/lib/auth";
import { Eye, EyeOff, BookOpen } from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    role: "student",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiRegister(form);
      if (data.email || data.message?.includes("registered")) {
        sessionStorage.setItem("pendingVerifyEmail", form.email);
        router.push("/verify-email");
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full h-11 px-4 border-2 border-gray-200 bg-white text-gray-900 text-sm outline-none transition-all focus:border-[#f5c518] focus:ring-0 placeholder:text-gray-400";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-gray-600";

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ backgroundColor: "#0d1b3e" }}>

        {/* Image placeholder */}
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(155deg, #1a2d5a 0%, #0d1b3e 50%, #080f24 100%)" }}
        >
          {/* Dot patterns */}
          <svg className="absolute top-16 left-16 opacity-20" width="100" height="100" viewBox="0 0 100 100">
            {Array.from({ length: 25 }).map((_, i) => (
              <circle key={i} cx={(i % 5) * 22 + 11} cy={Math.floor(i / 5) * 22 + 11} r="2.5" fill="#f5c518" />
            ))}
          </svg>
          <svg className="absolute bottom-28 right-12 opacity-20" width="80" height="80" viewBox="0 0 80 80">
            {Array.from({ length: 16 }).map((_, i) => (
              <circle key={i} cx={(i % 4) * 20 + 10} cy={Math.floor(i / 4) * 20 + 10} r="2" fill="#f5c518" />
            ))}
          </svg>

          {/* Bold yellow geometric shape */}
          <div className="absolute top-1/2 -right-16 -translate-y-1/2 w-64 h-64 opacity-5"
            style={{ background: "#f5c518", transform: "rotate(45deg) translateY(-50%)" }} />
        </div>

        {/* Content */}
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

          <div className="mb-16">
            <p className="section-label mb-4">JOIN THE JOURNEY</p>
            <h1 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "3rem", lineHeight: 1.05, color: "#fff" }}>
              START YOUR<br />JEE PREP<br />TODAY
            </h1>

            {/* Stat badges */}
            <div className="mt-8 grid grid-cols-2 gap-3">
              {[
                { num: "50K+", label: "Students" },
                { num: "10K+", label: "Problems" },
                { num: "3", label: "Subjects" },
                { num: "100%", label: "Free Access" },
              ].map(({ num, label }) => (
                <div key={label} className="p-3" style={{ background: "rgba(255,255,255,0.06)", borderLeft: "3px solid #f5c518" }}>
                  <p style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "1.4rem", color: "#f5c518" }}>{num}</p>
                  <p className="text-xs text-white/60 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
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
            <div className="h-1.5 w-full" style={{ background: "#f5c518" }} />

            <div className="p-8 pt-7">
              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}>
                  STUDENT PROFILE
                </p>
                <h2 style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800, fontSize: "2rem", color: "#0d1b3e" }}>
                  CREATE ACCOUNT
                </h2>
                <p className="text-sm text-gray-500 mt-1">Start your JEE preparation today</p>
              </div>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label htmlFor="firstName" className={labelClass}>First Name</label>
                    <input id="firstName" name="firstName" placeholder="Arjun" value={form.firstName}
                      onChange={handleChange} required className={inputClass} style={{ borderRadius: 0 }} />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="lastName" className={labelClass}>Last Name</label>
                    <input id="lastName" name="lastName" placeholder="Sharma" value={form.lastName}
                      onChange={handleChange} required className={inputClass} style={{ borderRadius: 0 }} />
                  </div>
                </div>

                {/* Username */}
                <div className="space-y-1.5">
                  <label htmlFor="username" className={labelClass}>Username</label>
                  <input id="username" name="username" placeholder="arjun_sharma" value={form.username}
                    onChange={handleChange} required className={inputClass} style={{ borderRadius: 0 }} />
                </div>

                {/* Email */}
                <div className="space-y-1.5">
                  <label htmlFor="email" className={labelClass}>Email Address</label>
                  <input id="email" name="email" type="email" placeholder="you@example.com" value={form.email}
                    onChange={handleChange} required className={inputClass} style={{ borderRadius: 0 }} />
                </div>

                {/* Password */}
                <div className="space-y-1.5">
                  <label htmlFor="password" className={labelClass}>Password</label>
                  <div className="relative">
                    <input id="password" name="password" type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters" value={form.password} onChange={handleChange}
                      required minLength={6} className={`${inputClass} pr-11`} style={{ borderRadius: 0 }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* CTA */}
                <button type="submit" disabled={loading}
                  className="btn-gold w-full h-12 flex items-center justify-center gap-2 disabled:opacity-60 mt-2"
                  style={{ borderRadius: 0 }}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      CREATING ACCOUNT...
                    </span>
                  ) : "CREATE ACCOUNT & VERIFY EMAIL →"}
                </button>
              </form>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-sm text-gray-500">
                  Already have an account?{" "}
                  <Link href="/signin" className="font-bold uppercase text-xs tracking-wider" style={{ color: "#0d1b3e" }}>
                    Sign in
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
