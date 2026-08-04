"use client";

import { useState, useTransition } from "react";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import { submitContactMessage } from "./actions";

export default function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    setError("");

    startTransition(async () => {
      const result = await submitContactMessage(formData);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
        form.reset();
      }
    });
  }

  if (success) {
    return (
      <>
        <style>{`
          @keyframes cvSuccessIn {
            from { opacity: 0; transform: translateY(12px) scale(0.97); }
            to   { opacity: 1; transform: translateY(0)   scale(1);    }
          }
          @keyframes cvCheckPop {
            0%   { opacity: 0; transform: scale(0.5); }
            70%  { transform: scale(1.12); }
            100% { opacity: 1; transform: scale(1); }
          }
          @keyframes cvRingPulse {
            0%   { box-shadow: 0 0 0 0 rgba(15,118,110,0.35); }
            70%  { box-shadow: 0 0 0 14px rgba(15,118,110,0); }
            100% { box-shadow: 0 0 0 0   rgba(15,118,110,0); }
          }
        `}</style>

        <div
          className="card"
          style={{
            marginTop: "var(--sp-3)",
            textAlign: "center",
            padding: "56px var(--sp-4)",
            animation: "cvSuccessIn 0.4s cubic-bezier(0.22,1,0.36,1) both",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 0,
          }}
        >
          {/* Animated check circle */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "rgba(15,118,110,0.10)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "var(--sp-3)",
              animation: "cvCheckPop 0.45s cubic-bezier(0.22,1,0.36,1) 0.15s both, cvRingPulse 1s ease 0.5s both",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "var(--color-accent)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Check size={22} color="#fff" strokeWidth={2.5} />
            </div>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: "1.625rem",
              fontWeight: 700,
              color: "var(--color-text-primary)",
              margin: "0 0 var(--sp-2)",
              letterSpacing: "-0.01em",
            }}
          >
            Message sent!
          </h2>

          {/* Body copy */}
          <p
            style={{
              color: "var(--color-text-secondary)",
              fontSize: "1rem",
              lineHeight: 1.65,
              maxWidth: 340,
              margin: "0 auto",
              marginBottom: "var(--sp-4)",
            }}
          >
            Thanks for reaching out. Our team will get back to you within one
            business day.
          </p>

          {/* Divider */}
          <div
            style={{
              width: 48,
              height: 2,
              borderRadius: 2,
              background: "rgba(15,118,110,0.20)",
              marginBottom: "var(--sp-4)",
            }}
          />

          {/* Reset button */}
          <button
            className="btn btn-outline"
            onClick={() => setSuccess(false)}
            style={{ display: "inline-flex", alignItems: "center", gap: 8, alignSelf: "center" }}
          >
            <RotateCcw size={15} />
            Send another message
          </button>
        </div>
      </>
    );
  }

  return (
    <form
      className="card"
      style={{ marginTop: "var(--sp-3)" }}
      onSubmit={handleSubmit}
      noValidate
    >
      {error && (
        <div
          style={{
            marginBottom: "var(--sp-2)",
            padding: "10px 14px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
            color: "var(--color-error)",
            fontSize: "0.875rem",
          }}
        >
          {error}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Full Name</label>
          <input
            type="text"
            name="full_name"
            className="form-input"
            placeholder="Jane Cooper"
          />
        </div>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            className="form-input"
            placeholder="jane@company.com"
          />
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">I am a...</label>
        <select
          name="i_am_a"
          className="form-select"
          defaultValue="Business looking to hire"
        >
          <option>Business looking to hire</option>
          <option>Partner / Press</option>
          <option>Other</option>
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Message</label>
        <textarea
          name="message"
          className="form-textarea"
          placeholder="How can we help?"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={isPending}
      >
        {isPending ? (
          "Sending..."
        ) : (
          <>
            Send Message <ArrowRight size={18} />
          </>
        )}
      </button>
    </form>
  );
}
