"use client";

import { useState, useTransition } from "react";
import { ArrowRight, CheckCircle } from "lucide-react";
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
      <div
        className="card"
        style={{
          marginTop: "var(--sp-3)",
          textAlign: "center",
          padding: "var(--sp-5)",
        }}
      >
        <CheckCircle
          size={48}
          color="var(--color-accent)"
          style={{ margin: "0 auto var(--sp-2)" }}
        />
        <h3>Message sent!</h3>
        <p
          style={{
            color: "var(--color-text-secondary)",
            marginBottom: "var(--sp-3)",
          }}
        >
          Thanks for reaching out. Our team will get back to you within one
          business day.
        </p>
        <button
          className="btn btn-outline"
          onClick={() => setSuccess(false)}
        >
          Send another message
        </button>
      </div>
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
