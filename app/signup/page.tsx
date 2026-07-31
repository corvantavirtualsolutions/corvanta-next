"use client";

import { useState } from "react";
import { useActionState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signup } from "@/app/auth/actions";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [confirmError, setConfirmError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirm_password") as HTMLInputElement).value;

    let hasError = false;
    let pe = "";
    let ce = "";

    if (password.length < 6) {
      pe = "Password must be at least 6 characters.";
      hasError = true;
    }
    if (password !== confirm) {
      ce = "Passwords do not match.";
      hasError = true;
    }

    setPwdError(pe);
    setConfirmError(ce);

    if (hasError) e.preventDefault();
  }

  return (
    <section className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <span className="eyebrow">Get started</span>
          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">
            Already have an account?{" "}
            <Link href="/login" className="auth-link">
              Log in
            </Link>
          </p>
        </div>

        <form action={action} className="auth-form" noValidate onSubmit={handleSubmit}>
          {state?.error && (
            <div className="auth-error" role="alert">
              {state.error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="full_name" className="form-label">
              Full Name
            </label>
            <input
              id="full_name"
              name="full_name"
              type="text"
              autoComplete="name"
              required
              placeholder="Jane Smith"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="position" className="form-label">
              Position / Role
            </label>
            <input
              id="position"
              name="position"
              type="text"
              autoComplete="organization-title"
              required
              placeholder="e.g. CEO, Operations Manager"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="company" className="form-label">
              Company Name
            </label>
            <input
              id="company"
              name="company"
              type="text"
              autoComplete="organization"
              required
              placeholder="Acme Corp"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="auth-password-wrap">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="At least 6 characters"
                className={`form-input${pwdError ? " input-error" : ""}`}
                onChange={() => pwdError && setPwdError("")}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {pwdError && <p className="field-error">{pwdError}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="confirm_password" className="form-label">
              Confirm Password
            </label>
            <div className="auth-password-wrap">
              <input
                id="confirm_password"
                name="confirm_password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                required
                placeholder="Re-enter your password"
                className={`form-input${confirmError ? " input-error" : ""}`}
                onChange={() => confirmError && setConfirmError("")}
              />
              <button
                type="button"
                className="auth-eye-btn"
                onClick={() => setShowConfirm((s) => !s)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmError && <p className="field-error">{confirmError}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={pending}
          >
            {pending ? "Creating account..." : "Create account"}
          </button>
        </form>
      </div>
    </section>
  );
}
