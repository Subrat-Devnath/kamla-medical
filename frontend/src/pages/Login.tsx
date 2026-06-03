import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import { Eye, EyeOff } from "lucide-react";
function Login() {
    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const API = `${BASE_URL}/security/api/v1`;

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        setLoading(true);
        setError("");

        try {
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userName: email,
                    password: password,
                }),
            });

            const data = await response.json();

            if (data.accessToken) {
                localStorage.setItem("accessToken", data.accessToken);
                localStorage.setItem("refreshToken", data.refreshToken);
                localStorage.setItem("userEmail", email);

                navigate("/home");
            } else {
                setError("Invalid email or password");
            }
        } catch (err) {
            console.error(err);
            setError("Server error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden flex items-center justify-center px-6 py-10">

            {/* Background effects */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0891b2_0%,transparent_25%),radial-gradient(circle_at_bottom_left,#7c3aed_0%,transparent_25%)] opacity-30" />
            <div className="absolute w-[500px] h-[500px] bg-cyan-500/20 blur-3xl rounded-full -top-32 -right-20" />
            <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-3xl rounded-full -bottom-32 -left-20" />

            {/* ANIMATED CARD */}
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="bg-white/5 border border-white/10 backdrop-blur-2xl rounded-3xl p-8 shadow-2xl shadow-cyan-500/10">

                    {/* HEADER */}
                    <div className="text-center mb-8">

                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/40 mb-5">
                            <span className="text-3xl">✚</span>
                        </div>

                        <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                            Login to Your Account
                        </h1>

                    </div>

                    {/* FORM */}
                    <form className="space-y-6" onSubmit={handleLogin}>

                        {/* EMAIL */}
                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-2">
                                Email ID
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-cyan-500 transition text-white placeholder:text-gray-500"
                                required
                            />
                        </div>

                        {/* PASSWORD */}
                        <div>

                            <div className="flex items-center justify-between mb-2">
                                <label className="text-sm font-medium text-gray-300">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    onClick={() => navigate("/forgot-password")}
                                    className="text-xs text-cyan-400 hover:text-cyan-300 transition"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 pr-14 outline-none focus:border-purple-500 transition text-white placeholder:text-gray-500"
                                    required
                                />

                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition"
                                >
                                    {showPassword ? (
                                        <EyeOff size={18} />
                                    ) : (
                                        <Eye size={18} />
                                    )}
                                </button>
                            </div>

                        </div>

                        {error && (
                            <p className="text-red-400 text-sm">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-500/30 hover:scale-[1.02] disabled:opacity-50"
                        >
                            {loading ? "Logging in..." : "Login to Dashboard"}
                        </button>

                    </form>

                    <p className="text-center text-gray-500 text-sm mt-8">
                        Don't have an account?
                        <button
                            type="button"
                            onClick={() => navigate("/signup")}
                            className="text-cyan-400 hover:text-cyan-300 ml-2 transition"
                        >
                            Create Account
                        </button>
                    </p>

                </div>
            </motion.div>

        </div>
    );
}

export default Login;