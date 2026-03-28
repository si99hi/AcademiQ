"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { apiVerifyEmail, apiRegister } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { BookOpen, Mail, RefreshCw } from "lucide-react";

export default function VerifyEmailPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const pendingEmail = sessionStorage.getItem("pendingVerifyEmail");
    if (!pendingEmail) {
      router.push("/signup");
      return;
    }
    setEmail(pendingEmail);
    inputRefs.current[0]?.focus();
  }, [router]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => setCountdown((c) => c - 1), 1000);
    return () => clearInterval(timer);
  }, [countdown]);

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

  const handleVerify = async () => {
    const otpStr = otp.join("");
    if (otpStr.length < 6) {
      setError("Please enter the complete 6-digit OTP.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await apiVerifyEmail({ email, otp: otpStr });
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data));
        sessionStorage.removeItem("pendingVerifyEmail");
        setSuccess("Email verified! Redirecting to dashboard…");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        setError(data.message || "Invalid or expired OTP. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResending(true);
    setError("");
    try {
      await apiRegister({
        username: "_resend_" + Date.now(),
        email,
        password: "placeholder",
        firstName: "User",
        lastName: "",
      });
      setCountdown(60);
      setSuccess("New OTP sent! Check your inbox.");
      setTimeout(() => setSuccess(""), 3000);
    } catch {
      setError("Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue-50 to-blue-100 px-6">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl border border-blue-100 p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 mb-1">
            <BookOpen className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700 tracking-wide uppercase">AcademiQ</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mt-2">Check your email!</h2>
          <p className="text-muted-foreground mt-2 text-sm">
            We sent a 6-digit OTP to{" "}
            <span className="font-semibold text-gray-700">{email}</span>
          </p>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-600 text-sm">
              {success}
            </div>
          )}

          <div className="mt-6 flex justify-center gap-3" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleOtpChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={`w-11 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-150
                  ${digit ? "border-blue-500 text-blue-700 bg-blue-50" : "border-gray-200 text-gray-900"}
                  focus:border-blue-500 focus:ring-2 focus:ring-blue-200`}
              />
            ))}
          </div>

          <Button
            onClick={handleVerify}
            disabled={loading || otp.join("").length < 6}
            className="mt-6 w-full bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-700 hover:to-blue-700 text-white font-semibold rounded-lg"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying…
              </span>
            ) : "Verify Email ✓"}
          </Button>

          <button
            onClick={handleResend}
            disabled={countdown > 0 || resending}
            className="mt-4 flex items-center gap-1.5 mx-auto text-sm text-muted-foreground hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
            {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
          </button>

          <p className="mt-6 text-xs text-muted-foreground">
            Wrong email?{" "}
            <a onClick={() => router.push("/signup")} className="text-blue-600 cursor-pointer hover:underline">
              Go back
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
