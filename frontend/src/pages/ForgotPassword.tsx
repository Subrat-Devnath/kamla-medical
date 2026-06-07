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
                setTimeout(() => navigate("/"), 1500);
            } else {
                showToast("error", data?.message || "Failed to reset password");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">

            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0891b2_0%,transparent_25%),radial-gradient(circle_at_bottom_left,#7c3aed_0%,transparent_25%)] opacity-30" />
            <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full -top-32 -right-20" />
            <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full -bottom-32 -left-20" />


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
                className="w-full max-w-md"
            >
                <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8">

                    <h1 className="text-3xl font-bold text-center mb-6">
                        Forgot Password
                    </h1>

                    {/* STEP 1 */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">

                            <div className="relative">
                                <input type="email" placeholder="Enter Email Address" value={emailId} onChange={(e) => setEmailId(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-cyan-500 transition text-white placeholder:text-gray-500"
                                />
                            </div>

                            <button type="submit" disabled={loading}
                                className=" w-full bg-cyan-600 hover:bg-cyan-700 transition py-4 rounded-2xl font-semibold disabled:opacity-60  disabled:cursor-not-allowed "
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

                            <input
                                type="email"
                                value={emailId}
                                readOnly
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-cyan-500 transition text-white placeholder:text-gray-500"
                            />

                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 pr-14 outline-none focus:border-purple-500 transition text-white placeholder:text-gray-500"
                            />

                            {/* TIMER */}
                            <div className="text-center text-sm text-gray-300">
                                OTP expires in:{" "}
                                <span className={otpExpired ? "text-red-500" : "text-green-400"}>
                                    {formatTime(timeLeft)}
                                </span>
                            </div>

                            <div className="flex gap-3">

                                <button
                                    type="button"
                                    onClick={handleResendOtp}
                                    disabled={resendLoading}
                                    className="w-1/2 bg-yellow-600 py-3 rounded-xl"
                                >
                                    {resendLoading ? <Loader2 className="animate-spin mx-auto" /> : "Resend OTP"}
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading || otpExpired}
                                    className={`w-1/2 py-3 rounded-xl ${otpExpired ? "bg-gray-600" : "bg-purple-600"
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

                            <input
                                type="password"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10"
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-green-600 py-3 rounded-xl"
                            >
                                {loading ? <Loader2 className="animate-spin mx-auto" /> : "Reset Password"}
                            </button>
                        </form>
                    )}

                    {/* ERROR */}
                    {errorMessage && (
                        <p className="text-red-400 text-sm mt-3">
                            {errorMessage}
                        </p>
                    )}

                    {/* BACK */}
                    <p className="text-center text-sm text-gray-400 mt-4">
                        Back to{" "}
                        <button onClick={() => navigate("/")} className="text-cyan-400">
                            Login
                        </button>
                    </p>

                </div>
            </motion.div>
        </div>
    );
}

export default ForgotPassword;