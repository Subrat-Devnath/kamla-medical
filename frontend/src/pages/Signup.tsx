import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "@/components/ui/card";



import { Eye, EyeOff } from "lucide-react";

function Signup() {

    const navigate = useNavigate();

    const [showPassword, setShowPassword] = useState(false);

    const [companyName, setCompanyname] = useState("");
    const [emailId, setEmailId] = useState("");
    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [loading, setLoading] = useState(false);

    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorMessageForPassword, setErrorMessageForPassword] = useState("");

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const API = `${BASE_URL}/user-mgmt/api/v1`;

    const handleSignup = async (e: React.FormEvent) => {

        e.preventDefault();

        setSuccessMessage("");
        setErrorMessage("");
        setErrorMessageForPassword("");
        try {

            setLoading(true);

            const response = await fetch(
                `${API}/register-normal-user`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        companyName,
                        emailId,
                        password,
                        name: emailId
                    }),
                }
            );

            const data = await response.json();

            console.log("Signup success:", data);

            if (response.ok && data.success) {

                setSuccessMessage("Account created successfully!");

                setCompanyname("");
                setEmailId("");
                setPassword("");

                setTimeout(() => {
                    navigate("/login");
                }, 2000);

            } else {

                setErrorMessage(
                    data.message || "Signup failed. Please try again."
                );
            }

        } catch (error) {

            console.error("Signup error:", error);

            setErrorMessage("Something went wrong. Please try again.");

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

            {/* ANIMATION WRAPPER */}
            <motion.div
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <Card className="bg-white/5 border-white/10 backdrop-blur-2xl text-white rounded-3xl shadow-2xl shadow-cyan-500/10">

                    <CardContent className="p-8">

                        {/* HEADER */}
                        <div className="text-center mb-8">

                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/40 mb-5">
                                <span className="text-3xl">✚</span>
                            </div>

                            <h1 className="text-4xl font-black tracking-tight bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 bg-clip-text text-transparent">
                                Create Your Account
                            </h1>

                            <p className="text-gray-400 mt-3 text-sm leading-relaxed">
                                Create your medical management account and manage inventory, billing, buying history, and medicine sales.
                            </p>

                        </div>

                        {/* SUCCESS MESSAGE */}
                        {successMessage && (
                            <div className="mb-4 rounded-xl border border-green-500/30 bg-green-500/10 p-3 text-green-400 text-sm text-center">
                                {successMessage}
                            </div>
                        )}

                        {/* ERROR MESSAGE */}
                        {errorMessage && (
                            <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-red-400 text-sm text-center">
                                {errorMessage}
                            </div>
                        )}


                        {/* FORM */}
                        <form className="space-y-6" onSubmit={handleSignup}>

                            {/* COMPANY NAME */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Company Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Enter your company name"
                                    value={companyName}
                                    onChange={(e) => setCompanyname(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-cyan-500 transition text-white placeholder:text-gray-500"
                                    required
                                />
                            </div>

                            {/* EMAIL */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Email ID
                                </label>

                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={emailId}
                                    onChange={(e) => setEmailId(e.target.value)}
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 outline-none focus:border-cyan-500 transition text-white placeholder:text-gray-500"
                                    required
                                />
                            </div>

                            {/* PASSWORD */}
                            <div>

                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Password
                                </label>

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
                                        {showPassword ? (<EyeOff size={18} />) : (<Eye size={18} />)}
                                    </button>

                                </div>

                            </div>

                            {/* CONFIRM PASSWORD */}
                            <div>

                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Re-enter Password
                                </label>

                                <div className="relative">

                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Re-enter your password"
                                        value={confirmPassword}
                                        onChange={(e) => {
                                            setConfirmPassword(e.target.value);

                                            if (password !== e.target.value) {
                                                setErrorMessageForPassword("Password and Re-enter Password do not match");
                                            } else {
                                                setErrorMessageForPassword("");
                                            }
                                        }}
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-4 py-4 pr-14 outline-none focus:border-cyan-500 transition text-white placeholder:text-gray-500"
                                        required
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400 transition"
                                    >
                                        {showConfirmPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                                {/* ERROR MESSAGE */}
                                {errorMessageForPassword && (
                                    <p className="text-red-400 text-sm mt-2">
                                        {errorMessageForPassword}
                                    </p>
                                )}

                            </div>

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                disabled={loading || password !== confirmPassword}
                                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 py-4 rounded-2xl font-bold text-lg shadow-lg shadow-cyan-500/30 hover:scale-[1.02] disabled:opacity-50"
                            >
                                {loading ? "Creating Account..." : "Create Account"}
                            </button>

                        </form>

                        {/* DIVIDER */}
                        <div className="relative my-8">

                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10" />
                            </div>

                            <div className="relative flex justify-center text-sm">
                                <span className="bg-black px-4 text-gray-500">
                                    Secure Medical Platform
                                </span>
                            </div>

                        </div>

                        {/* LOGIN LINK */}
                        <p className="text-center text-gray-400 text-sm mt-8">

                            Already have an account?{" "}

                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="text-cyan-400 hover:text-cyan-300"
                            >
                                Sign In
                            </button>

                        </p>

                    </CardContent>

                </Card>
            </motion.div>

        </div>
    );
}

export default Signup;