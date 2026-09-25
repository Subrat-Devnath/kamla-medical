import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

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

    const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

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

    const stepLabel =
        step === 1 ? "Step 1 of 3 · Email" : step === 2 ? "Step 2 of 3 · OTP" : "Step 3 of 3 · New Password";

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center px-6 py-10">

            {/* Background effects — match Login */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#38bdf8_0%,transparent_30%),radial-gradient(circle_at_bottom_left,#2563eb_0%,transparent_30%)] opacity-40" />
            <div className="absolute w-[550px] h-[550px] bg-sky-400/30 blur-[120px] rounded-full -top-40 -right-24" />
            <div className="absolute w-[550px] h-[550px] bg-blue-600/25 blur-[120px] rounded-full -bottom-40 -left-24" />

            {/* TOAST */}
            {toast && (
                <div
                    className={`
            fixed top-6 left-1/2 transform -translate-x-1/2
            px-6 py-3 rounded-xl text-sm shadow-lg
            transition-all z-50
            ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}
        `}
                >
                    {toast.message}
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-cyan-500/10">

                    {/* HEADER */}
                    <div className="text-center mb-6">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/40 mb-5">
                            <span className="text-3xl">✚</span>
                        </div>

                        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-sky-500 bg-clip-text text-transparent">
                            Forgot Password
                        </h1>

                        <p className="mt-3 text-sm text-slate-400">{stepLabel}</p>
                    </div>

                    {/* Step indicator boxes */}
                    <div className="mb-6 grid grid-cols-3 gap-2">
                        {[1, 2, 3].map((n) => (
                            <div
                                key={n}
                                className={`rounded-xl border px-2 py-2 text-center text-xs font-semibold ${
                                    step === n
                                        ? "border-cyan-400/40 bg-cyan-500/15 text-cyan-300"
                                        : step > n
                                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                                          : "border-white/10 bg-white/[0.03] text-slate-500"
                                }`}
                            >
                                {n === 1 ? "Email" : n === 2 ? "OTP" : "Reset"}
                            </div>
                        ))}
                    </div>

                    {/* STEP 1 */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email ID
                                </label>
                                <input
                                    type="email"
                                    placeholder="Enter Email Address"
                                    value={emailId}
                                    onChange={(e) => setEmailId(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-cyan-500 transition text-white placeholder:text-gray-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-500/30 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin mx-auto" />
                                ) : (
                                    "Send OTP"
                                )}
                            </button>
                        </form>
                    )}

                    {/* STEP 2 */}
                    {step === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email ID
                                </label>
                                <input
                                    type="email"
                                    value={emailId}
                                    readOnly
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 outline-none text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    OTP
                                </label>
                                <input
                                    type="text"
                                    placeholder="Enter OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-cyan-500 transition text-white placeholder:text-gray-500"
                                />
                            </div>

                            <div className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-center text-sm text-gray-300">
                                OTP expires in:{" "}
                                <span className={otpExpired ? "text-red-500 font-semibold" : "text-green-400 font-semibold"}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendLoading}
                                    className="w-1/2 rounded-2xl border border-amber-500/30 bg-amber-500/15 py-3 font-semibold text-amber-300 hover:bg-amber-500/25 disabled:opacity-50"
                                >
                                    {resendLoading ? <Loader2 className="animate-spin mx-auto" /> : "Resend OTP"}
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading || otpExpired}
                                    className={`w-1/2 rounded-2xl py-3 font-semibold transition ${
                                        otpExpired
                                            ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                                            : "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500"
                                    }`}
                                >
                                    {loading ? (
                                        <Loader2 className="animate-spin mx-auto" />
                                    ) : otpExpired ? (
                                        "OTP Expired"
                                    ) : (
                                        "Verify OTP"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}

                    {/* STEP 3 */}
                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-cyan-500 transition text-white placeholder:text-gray-500"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-400 hover:to-cyan-500 transition-all duration-300 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-emerald-500/20 hover:scale-[1.02] disabled:opacity-50"
                            >
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Reset Password"}
                            </button>
                        </form>
                    )}

                    {errorMessage && (
                        <p className="text-red-400 text-sm mt-4 text-center">
                            {errorMessage}
                        </p>
                    )}

                    <p className="text-center text-gray-500 text-sm mt-8">
                        Back to{" "}
                        <button
                            type="button"
                            onClick={() => navigate("/login")}
                            className="text-cyan-400 hover:text-cyan-300 transition"
                        >
                            Login
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;
