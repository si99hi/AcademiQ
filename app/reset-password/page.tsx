"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiResetPassword } from "@/lib/auth";
import { Eye, EyeOff, CheckCircle } from "lucide-react";
import { AuthBrandPanel, AuthMobileLogo, AuthSubjectsStrip } from "@/components/auth-brand-panel";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const inputClass =
    "w-full h-11 px-4 border-2 border-gray-200 bg-white text-gray-900 text-sm outline-none transition-all focus:border-[#f5c518] focus:ring-0 placeholder:text-gray-400";
  const labelClass = "text-xs font-bold uppercase tracking-wider text-gray-600";

  useEffect(() => {
    const resetEmail = sessionStorage.getItem("resetEmail");
    if (!resetEmail) {
      router.push("/forgot-password");
      return;
    }
    setEmail(resetEmail);
    inputRefs.current[0]?.focus();
  }, [router]);

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(""));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpStr = otp.join("");
    if (otpStr.length < 6) {
      setError("Enter the complete 6-digit OTP.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const data = await apiResetPassword({ email, otp: otpStr, newPassword });
      if (data.message?.toLowerCase().includes("successfully")) {
        sessionStorage.removeItem("resetEmail");
        setDone(true);
      } else {
        setError(data.message || "Reset failed. OTP may be expired.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
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
                  <div className="p-4 rounded-full" style={{ background: "rgba(245, 197, 24, 0.25)" }}>
                    <CheckCircle className="w-10 h-10" style={{ color: "#0d1b3e" }} />
                  </div>
                </div>
                <p
                  className="text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: "#f5c518", fontFamily: "'Barlow Condensed', sans-serif" }}
                >
                  ALL SET
                </p>
                <h2
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "#0d1b3e",
                  }}
                >
                  PASSWORD UPDATED
                </h2>
                <p className="text-sm text-gray-500 mt-3">You can sign in with your new password.</p>
                <button
                  type="button"
                  onClick={() => router.push("/signin")}
                  className="btn-gold w-full h-12 mt-8 flex items-center justify-center gap-2"
                  style={{ borderRadius: 0 }}
                >
                  SIGN IN →
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
                  NEW CREDENTIALS
                </p>
                <h2
                  style={{
                    fontFamily: "'Barlow Condensed', sans-serif",
                    fontWeight: 800,
                    fontSize: "2rem",
                    color: "#0d1b3e",
                  }}
                >
                  RESET PASSWORD
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  OTP sent to <span className="font-semibold text-gray-800">{email}</span>
                </p>
              </div>

              {error && (
                <div className="mb-5 p-3 bg-red-50 border-l-4 border-red-500 text-red-600 text-sm">{error}</div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1.5">
                  <span className={labelClass}>6-digit OTP</span>
                  <div className="flex gap-2 justify-between pt-1" onPaste={handlePaste}>
                    {otp.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputRefs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        className={`w-11 h-12 text-center text-lg font-bold border-2 outline-none transition-all duration-150 rounded-none
                          ${
                            digit
                              ? "border-[#f5c518] text-[#0d1b3e] bg-[#fffef5]"
                              : "border-gray-200 text-gray-900 bg-white"
                          }
                          focus:border-[#f5c518] focus:ring-0`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="newPassword" className={labelClass}>
                    New password
                  </label>
                  <div className="relative">
                    <input
                      id="newPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 6 characters"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      minLength={6}
                      className={`${inputClass} pr-11`}
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

                <div className="space-y-1.5">
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
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
                      RESETTING...
                    </span>
                  ) : (
                    "RESET PASSWORD →"
                  )}
                </button>
              </form>
            </div>
          </div>

          <AuthSubjectsStrip />
        </div>
      </div>
    </div>
  );
}
