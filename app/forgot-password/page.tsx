"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiForgotPassword } from "@/lib/auth";
import { Mail, ArrowLeft } from "lucide-react";
import { AuthBrandPanel, AuthMobileLogo, AuthSubjectsStrip } from "@/components/auth-brand-panel";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const inputClass =
    "w-full h-11 px-4 border-2 border-gray-200 bg-white text-gray-900 text-sm outline-none transition-all focus:border-[#f5c518] focus:ring-0 placeholder:text-gray-400";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-gray-600";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data = await apiForgotPassword({ email });
      if (data.message?.toLowerCase().includes("sent")) {
        sessionStorage.setItem("resetEmail", email);
        setSent(true);
      } else {
        setError(data.message || "Something went wrong.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
        <AuthBrandPanel />
        <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: "#f5f6f8" }}>
          <div className="w-full max-w-md">
            <AuthMobileLogo />
            <div className="bg-white shadow-xl border-0 overflow-hidden">
              <div className="h-1.5 w-full" style={{ background: "#f5c518" }} />
              <div className="p-8 pt-7 text-center">
                <div className="flex justify-center mb-6">
                  <div className="p-4" style={{ background: "#f5c518" }}>
                    <Mail className="w-8 h-8" style={{ color: "#0d1b3e" }} />
                  </div>
                </div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  CHECK YOUR INBOX
                </p>
                <h2
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "#0d1b3e",
                  }}
                >
                  OTP SENT
                </h2>
                <p className="text-sm text-gray-500 mt-3">
                  We sent a password reset OTP to{" "}
                  <span className="font-semibold text-gray-800">{email}</span>. It expires in 10 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/reset-password")}
                  className="btn-gold w-full h-12 mt-8 flex items-center justify-center gap-2"
                  style={{ borderRadius: 0 }}
                >
                  ENTER OTP &amp; RESET PASSWORD →
                </button>
                <button
                  type="button"
                  onClick={() => setSent(false)}
                  className="mt-4 text-xs font-semibold uppercase tracking-wider text-gray-500 hover:text-[#0d1b3e]"
                >
                  Use a different email?
                </button>
              </div>
            </div>
            <AuthSubjectsStrip />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      <AuthBrandPanel />

      <div className="flex-1 flex items-center justify-center px-6 py-12" style={{ background: "#f5f6f8" }}>
        <div className="w-full max-w-md">
          <AuthMobileLogo />

          <div className="bg-white shadow-xl border-0 overflow-hidden">
            <div className="h-1.5 w-full" style={{ background: "#f5c518" }} />

            <div className="p-8 pt-7">
              <div className="mb-7">
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-1"
                  style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  PASSWORD HELP
                </p>
                <h2
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "#0d1b3e",
                  }}
                >
                  FORGOT PASSWORD?
                </h2>
                <p className="text-sm text-gray-500 mt-1">Enter your email and we&apos;ll send a reset OTP.</p>
              </div>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="email" className={labelClass}>
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className={inputClass}
                    style={{ borderRadius: 0 }}
                  />
                </div>

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
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      SENDING OTP...
                    </span>
                  ) : (
                    "SEND RESET OTP →"
                  )}
                </button>
              </form>

              <Link
                href="/signin"
                className="mt-6 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider justify-center text-gray-500 hover:text-[#0d1b3e] transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to sign in
              </Link>
            </div>
          </div>

          <AuthSubjectsStrip />
        </div>
      </div>
    </div>
  );
}
