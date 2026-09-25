import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Clock, Mail, RefreshCw, ShieldCheck } from "lucide-react";

import {
  AuthShell,
  ErrorBanner,
  Field,
  NeonButton,
  PasswordInput,
  TextInput,
  Toast,
  type ToastState,
} from "@/components/hud";
import { cn } from "@/lib/utils";

const steps = ["Email", "OTP", "Reset"] as const;

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [emailId, setEmailId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  // ---------------- TIMER STATE ----------------
  const OTP_TIME = 180; // 3 minutes in seconds
  const [timeLeft, setTimeLeft] = useState(OTP_TIME);
  const [otpExpired, setOtpExpired] = useState(false);

  const [toast, setToast] = useState<ToastState>(null);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const API = `${BASE_URL}/user-mgmt/api/v1`;

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
  };

  // ---------------- TIMER EFFECT ----------------
  useEffect(() => {
    if (step !== 2) return;

    setTimeLeft(OTP_TIME);
    setOtpExpired(false);

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setOtpExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [step]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  // ---------------- SEND OTP ----------------
  const sendOtp = async (email: string) => {
    return fetch(`${API}/send-forgot-password-otp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emailId: email }),
    });
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!emailId) return setErrorMessage("Email is required");

    try {
      setLoading(true);

      const response = await sendOtp(emailId);
      const data = await response.json().catch(() => null);

      if (response.ok) {
        showToast("success", "OTP sent successfully");
        setStep(2);
      } else {
        showToast("error", data?.message || "Failed to send OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESEND OTP ----------------
  const handleResendOtp = async () => {
    setErrorMessage("");

    try {
      setResendLoading(true);

      const response = await sendOtp(emailId);
      const data = await response.json().catch(() => null);

      if (response.ok) {
        showToast("success", "OTP resent successfully");

        // reset timer
        setTimeLeft(OTP_TIME);
        setOtpExpired(false);
        setOtp("");
      } else {
        showToast("error", data?.message || "Failed to resend OTP");
      }
    } finally {
      setResendLoading(false);
    }
  };

  // ---------------- VERIFY OTP ----------------
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (otpExpired) {
      return setErrorMessage("OTP expired. Please resend OTP.");
    }

    if (!otp) return setErrorMessage("OTP is required");

    try {
      setLoading(true);

      const response = await fetch(`${API}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId, otp }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        showToast("success", "OTP verified successfully");
        setStep(3);
      } else {
        showToast("error", data?.message || "Invalid OTP");
      }
    } finally {
      setLoading(false);
    }
  };

  // ---------------- RESET PASSWORD ----------------
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!newPassword) return setErrorMessage("New password is required");

    try {
      setLoading(true);

      const response = await fetch(`${API}/reset-password-with-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ emailId, otp, newPassword }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok) {
        showToast("success", "Password reset successful");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        showToast("error", data?.message || "Failed to reset password");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Toast toast={toast} />

      <AuthShell
        eyebrow={`Step ${step} of 3`}
        title="Reset Your Password"
        subtitle="We'll verify your identity with a one-time code."
        footer={
          <>
            Back to{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="font-semibold text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Login
            </button>
          </>
        }
      >
        {/* Step tracker */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          {steps.map((label, index) => {
            const stepNumber = index + 1;
            const isDone = step > stepNumber;
            const isCurrent = step === stepNumber;

            return (
              <div
                key={label}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-xl border px-2 py-2 text-xs font-semibold transition-colors",
                  isCurrent &&
                    "border-cyan-600/40 bg-cyan-500/15 text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-400/15 dark:text-cyan-300",
                  isDone &&
                    "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-300",
                  !isCurrent &&
                    !isDone &&
                    "border-slate-900/10 bg-slate-900/[0.03] text-slate-500 dark:border-white/10 dark:bg-white/[0.03]",
                )}
              >
                {isDone && <Check size={13} className="shrink-0" />}
                {label}
              </div>
            );
          })}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <Field label="Email ID">
              <TextInput
                type="email"
                icon={Mail}
                autoComplete="email"
                placeholder="Enter your email address"
                value={emailId}
                onChange={(e) => setEmailId(e.target.value)}
                required
              />
            </Field>

            <NeonButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              Send OTP
            </NeonButton>
          </form>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <Field label="Email ID">
              <TextInput type="email" icon={Mail} value={emailId} readOnly />
            </Field>

            <Field label="One-Time Password" hint="Check your inbox and spam folder.">
              <TextInput
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                placeholder="• • • • • •"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="text-center text-lg tracking-[0.4em] tabular"
              />
            </Field>

            <div className="flex items-center justify-center gap-2 rounded-xl border border-slate-900/10 bg-slate-900/[0.03] px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300">
              <Clock size={15} className="text-slate-500" />
              Expires in
              <span
                className={cn(
                  "font-semibold tabular",
                  otpExpired
                    ? "text-rose-600 dark:text-rose-400"
                    : "text-emerald-600 dark:text-emerald-400",
                )}
              >
                {formatTime(timeLeft)}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <NeonButton
                variant="ghost"
                size="lg"
                icon={RefreshCw}
                onClick={handleResendOtp}
                loading={resendLoading}
                className="w-full"
              >
                Resend
              </NeonButton>

              <NeonButton
                type="submit"
                variant="primary"
                size="lg"
                loading={loading}
                disabled={otpExpired}
                className="w-full"
              >
                {otpExpired ? "OTP Expired" : "Verify OTP"}
              </NeonButton>
            </div>
          </form>
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <Field label="New Password">
              <PasswordInput
                autoComplete="new-password"
                placeholder="Enter a new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Field>

            <NeonButton
              type="submit"
              variant="primary"
              size="lg"
              icon={ShieldCheck}
              loading={loading}
              className="w-full"
            >
              Reset Password
            </NeonButton>
          </form>
        )}

        {errorMessage && (
          <div className="mt-5">
            <ErrorBanner
              message={errorMessage}
              onDismiss={() => setErrorMessage("")}
            />
          </div>
        )}
      </AuthShell>
    </>
  );
}

export default ForgotPassword;
