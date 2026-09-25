import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";

import {
  AuthShell,
  ErrorBanner,
  Field,
  NeonButton,
  PasswordInput,
  TextInput,
} from "@/components/hud";

function Login() {
  const navigate = useNavigate();

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
    <AuthShell
      eyebrow="Secure Access"
      title="Kamla Medical Store"
      subtitle="Sign in to your inventory and billing console."
      footer={
        <>
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/signup")}
            className="font-semibold text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            Create Account
          </button>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleLogin}>
        <Field label="Email ID">
          <TextInput
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Field>

        <Field
          label="Password"
          action={
            <button
              type="button"
              onClick={() => navigate("/forgot-password")}
              className="text-xs font-medium text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              Forgot Password?
            </button>
          }
        >
          <PasswordInput
            autoComplete="current-password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        {error && <ErrorBanner message={error} onDismiss={() => setError("")} />}

        <NeonButton
          type="submit"
          variant="primary"
          size="lg"
          icon={ArrowRight}
          loading={loading}
          className="w-full"
        >
          {loading ? "Signing in…" : "Enter Dashboard"}
        </NeonButton>
      </form>
    </AuthShell>
  );
}

export default Login;
