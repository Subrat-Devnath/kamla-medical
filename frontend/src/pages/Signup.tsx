import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Building2, Mail, UserPlus } from "lucide-react";

import {
  AuthShell,
  ErrorBanner,
  Field,
  NeonButton,
  PasswordInput,
  SuccessBanner,
  TextInput,
} from "@/components/hud";

function Signup() {
  const navigate = useNavigate();

  const [companyName, setCompanyname] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

      const response = await fetch(`${API}/register-normal-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          companyName,
          emailId,
          password,
          name: emailId,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSuccessMessage("Account created successfully!");

        setCompanyname("");
        setEmailId("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setErrorMessage(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      console.error("Signup error:", error);

      setErrorMessage("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="New Workspace"
      title="Create Your Account"
      subtitle="Set up your medical store console in under a minute."
      footer={
        <>
          Already have an account?{" "}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="font-semibold text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            Sign In
          </button>
        </>
      }
    >
      <form className="space-y-5" onSubmit={handleSignup}>
        {successMessage && <SuccessBanner message={successMessage} />}

        {errorMessage && (
          <ErrorBanner
            message={errorMessage}
            onDismiss={() => setErrorMessage("")}
          />
        )}

        <Field label="Company Name">
          <TextInput
            type="text"
            icon={Building2}
            placeholder="Kamla Medical Store"
            value={companyName}
            onChange={(e) => setCompanyname(e.target.value)}
            required
          />
        </Field>

        <Field label="Email ID">
          <TextInput
            type="email"
            icon={Mail}
            autoComplete="email"
            placeholder="you@company.com"
            value={emailId}
            onChange={(e) => setEmailId(e.target.value)}
            required
          />
        </Field>

        <Field label="Password">
          <PasswordInput
            autoComplete="new-password"
            placeholder="Create a strong password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Field>

        <Field label="Re-enter Password" error={errorMessageForPassword}>
          <PasswordInput
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);

              if (password !== e.target.value) {
                setErrorMessageForPassword(
                  "Password and Re-enter Password do not match",
                );
              } else {
                setErrorMessageForPassword("");
              }
            }}
            required
          />
        </Field>

        <NeonButton
          type="submit"
          variant="primary"
          size="lg"
          icon={UserPlus}
          loading={loading}
          disabled={password !== confirmPassword}
          className="w-full"
        >
          {loading ? "Creating Account…" : "Create Account"}
        </NeonButton>
      </form>
    </AuthShell>
  );
}

export default Signup;
