"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login } from "@/app/auth/actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState(login, null);

  return (
    <section className="auth-page">
      <div className="auth-card card">
        <div className="auth-header">
          <span className="eyebrow">Welcome back</span>
          <h1 className="auth-title">Log in to your account</h1>
          <p className="auth-subtitle">
            Don&#39;t have an account?{" "}
            <Link href="/signup" className="auth-link">
              Sign up
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
              autoComplete="current-password"
              required
              placeholder="Enter your password"
              className="form-input"
            />
          </div>

          <div className="auth-remember">
            <label className="form-check">
              <input
                id="remember_me"
                name="remember_me"
                type="checkbox"
                defaultChecked
              />
              <span>Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block"
            disabled={pending}
          >
            {pending ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>
    </section>
  );
}
