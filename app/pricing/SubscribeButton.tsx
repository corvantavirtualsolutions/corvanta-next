"use client";

import { useState } from "react";
import { ArrowRight, X, FileSignature, CheckCircle } from "lucide-react";
import { saveSubscriber } from "./actions";

type Phase = "idle" | "open" | "submitting" | "success";

export default function SubscribeButton() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");

  function openModal() {
    setName("");
    setEmail("");
    setFieldError("");
    setPhase("open");
  }

  function closeModal() {
    if (phase === "submitting") return;
    setPhase("idle");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFieldError("");

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      setFieldError("name:Please enter your name.");
      return;
    }
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setFieldError("email:Please enter a valid email address.");
      return;
    }

    setPhase("submitting");
    const result = await saveSubscriber(trimmedName, trimmedEmail);
    if (result.error) {
      setFieldError(result.error);
      setPhase("open");
    } else {
      setPhase("success");
    }
  }

  return (
    <>
      <button
        type="button"
        className="btn btn-primary btn-lg btn-block"
        onClick={openModal}
      >
        Subscribe - Start the Process <ArrowRight size={18} />
      </button>

      {(phase === "open" || phase === "submitting" || phase === "success") && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.55)",
            backdropFilter: "blur(3px)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              width: "100%",
              maxWidth: 480,
              boxShadow: "0 24px 64px rgba(0,0,0,0.22)",
              overflow: "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "16px 24px",
                borderBottom: "1px solid var(--color-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  margin: 0,
                  fontSize: "1rem",
                  fontWeight: 800,
                  color: "var(--color-text-primary)",
                }}
              >
                {phase === "success" ? "You're all set!" : "Get started"}
              </h2>
              {phase !== "submitting" && (
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 4,
                    cursor: "pointer",
                    color: "var(--color-text-secondary)",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <X size={20} />
                </button>
              )}
            </div>

            {/* Body */}
            <div style={{ padding: "24px" }}>
              {phase === "success" ? (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    gap: 16,
                    padding: "8px 0 4px",
                  }}
                >
                  <span
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: "50%",
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <CheckCircle size={28} />
                  </span>
                  <p
                    style={{
                      margin: 0,
                      fontSize: "0.95rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.65,
                    }}
                  >
                    Thanks! Check your email - we'll send you the next steps
                    and contract details shortly. No payment is charged today.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={closeModal}
                    style={{ marginTop: 4 }}
                  >
                    Close
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate>
                  <p
                    style={{
                      margin: "0 0 20px",
                      fontSize: "0.9rem",
                      color: "var(--color-text-secondary)",
                      lineHeight: 1.65,
                    }}
                  >
                    Enter your name and email and we'll send you the next
                    steps and the contract details. No payment is charged today.
                  </p>

                  {/* Name */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="sub-name">
                      Name <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>
                    <input
                      id="sub-name"
                      type="text"
                      className="form-input"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => {
                        setName(e.target.value);
                        if (fieldError.startsWith("name:")) setFieldError("");
                      }}
                      disabled={phase === "submitting"}
                      autoComplete="name"
                    />
                    {fieldError.startsWith("name:") && (
                      <p style={{ margin: "6px 0 0", fontSize: "0.82rem", color: "var(--color-error)" }}>
                        {fieldError.slice(5)}
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div className="form-group">
                    <label className="form-label" htmlFor="sub-email">
                      Email <span style={{ color: "var(--color-error)" }}>*</span>
                    </label>
                    <input
                      id="sub-email"
                      type="email"
                      className="form-input"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (fieldError.startsWith("email:")) setFieldError("");
                      }}
                      disabled={phase === "submitting"}
                      autoComplete="email"
                    />
                    {fieldError.startsWith("email:") && (
                      <p style={{ margin: "6px 0 0", fontSize: "0.82rem", color: "var(--color-error)" }}>
                        {fieldError.slice(6)}
                      </p>
                    )}
                  </div>

                  {/* Contract reminder */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                      padding: "10px 12px",
                      background: "rgba(15,118,110,0.06)",
                      border: "1px solid rgba(15,118,110,0.18)",
                      borderRadius: 8,
                      marginBottom: 20,
                    }}
                  >
                    <FileSignature
                      size={14}
                      style={{
                        color: "var(--color-accent)",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    />
                    <p
                      style={{
                        margin: 0,
                        fontSize: "0.8rem",
                        color: "var(--color-text-secondary)",
                        lineHeight: 1.6,
                      }}
                    >
                      A formal contract will be sent to you to review and sign
                      before anything is finalized.
                    </p>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary btn-block"
                    disabled={phase === "submitting"}
                    style={{ opacity: phase === "submitting" ? 0.7 : 1 }}
                  >
                    {phase === "submitting"
                      ? "Sending..."
                      : "Send Me What's Next"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
