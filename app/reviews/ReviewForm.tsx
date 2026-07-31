"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { submitReview } from "./actions";

export default function ReviewForm({
  defaultName,
  defaultCompany,
}: {
  defaultName: string;
  defaultCompany: string;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [name, setName] = useState(defaultName);
  const [company, setCompany] = useState(defaultCompany);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  function handleSubmit() {
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }
    if (!feedback.trim()) {
      setError("Please write some feedback.");
      return;
    }
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    setError("");
    startTransition(async () => {
      const result = await submitReview({ rating, feedback, user_name: name, company });
      if (result.error) {
        setError(result.error);
      } else {
        setSubmitted(true);
      }
    });
  }

  if (submitted) {
    return (
      <div className="review-form-card card">
        <div className="review-success">
          <div className="review-success-icon">&#127881;</div>
          <h3>Thank you for your review!</h3>
          <p>We really appreciate your feedback.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="review-form-card card">
      <h3 className="review-form-title">Leave a review</h3>

      {error && (
        <p className="field-error" style={{ marginBottom: "var(--sp-2)" }}>
          {error}
        </p>
      )}

      <div className="form-group">
        <label className="form-label">
          Your rating <span className="req-star">*</span>
        </label>
        <div className="star-row">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              className={`star-btn${(hoverRating || rating) >= n ? " star-active" : ""}`}
              onMouseEnter={() => setHoverRating(n)}
              onMouseLeave={() => setHoverRating(0)}
              onClick={() => { setRating(n); setError(""); }}
              aria-label={`Rate ${n} star${n !== 1 ? "s" : ""}`}
            >
              <Star size={28} />
            </button>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="review-name" className="form-label">
          Your name <span className="req-star">*</span>
        </label>
        <input
          id="review-name"
          type="text"
          className="form-input"
          placeholder="Jane Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="review-company" className="form-label">
          Company <span className="optional-tag">(optional)</span>
        </label>
        <input
          id="review-company"
          type="text"
          className="form-input"
          placeholder="Acme Corp"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="review-feedback" className="form-label">
          Your feedback <span className="req-star">*</span>
        </label>
        <textarea
          id="review-feedback"
          className="form-textarea"
          placeholder="Tell us about your experience working with Corvanta..."
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="btn btn-primary btn-block"
        onClick={handleSubmit}
        disabled={isPending}
      >
        {isPending ? "Submitting..." : "Submit Review"}
      </button>
    </div>
  );
}
