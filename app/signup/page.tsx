"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signup } from "@/app/auth/actions";

export default function SignupPage() {
  const [state, action, pending] = useActionState(signup, null);

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

        <form action={action} className="auth-form" noValidate>
          {state?.error && (
            <div className="auth-error" role="alert">
              {state.error}
            </div>
          )}

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
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              placeholder="At least 6 characters"
              className="form-input"
            />
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
