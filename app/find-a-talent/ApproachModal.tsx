"use client";

import { useState, useTransition } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { submitApproach, type MatchedVA } from "./actions";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  va: MatchedVA;
  onClose: () => void;
}

export default function ApproachModal({ va, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [agreedPayment, setAgreedPayment] = useState(false);
  const [agreedInfo, setAgreedInfo] = useState(false);
  const [agreedContact, setAgreedContact] = useState(false);
  const [agreedEmailContract, setAgreedEmailContract] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSubmit() {
    setError("");

    if (!name.trim()) { setError("Name is required."); return; }
    if (!company.trim()) { setError("Company name is required."); return; }
    if (!email.trim() || !EMAIL_RE.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!agreedPayment || !agreedInfo || !agreedContact || !agreedEmailContract) {
      setError("Please agree to all required terms to continue.");
      return;
    }

    const fd = new FormData();
    fd.append("name", name.trim());
    fd.append("company", company.trim());
    fd.append("email", email.trim());
    fd.append("agreed_payment_terms", String(agreedPayment));
    fd.append("agreed_accurate_info", String(agreedInfo));
    fd.append("agreed_contact", String(agreedContact));
    fd.append("agreed_email_contract", String(agreedEmailContract));
    fd.append("notes", notes);
    fd.append("va_id", va.id);
    fd.append("va_niche", va.niche);
    fd.append("match_score", String(va.score));

    startTransition(async () => {
      const result = await submitApproach(fd);
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  }

  return (
    <div className="va-modal-overlay" onClick={handleOverlayClick}>
      <div className="va-modal">
        <div className="va-modal-header">
          <h2 className="va-modal-title">Approach this VA</h2>
          <button className="va-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="approach-success">
            <CheckCircle2 size={52} className="approach-success-icon" strokeWidth={1.5} />
            <h3 className="approach-success-title">Request Sent!</h3>
            <p className="approach-success-msg">
              Thanks! Our team will reach out to you shortly.
            </p>
            <button className="btn btn-primary btn-sm" onClick={onClose}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="va-modal-body">
              {/* Dynamic context line */}
              <p className="approach-va-context">
                You're approaching a <strong>{va.niche}</strong> VA with a{" "}
                <strong>{va.score}% match</strong>. Our team will follow up
                within one business day.
              </p>

              {error && (
                <div className="auth-error" role="alert" style={{ marginBottom: 16 }}>
                  {error}
                </div>
              )}

              <div className="form-group">
                <label className="form-label">
                  Your Name <span className="req-star">*</span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Company Name <span className="req-star">*</span>
                </label>
                <input
                  className="form-input"
                  type="text"
                  placeholder="Your company or business name"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Email <span className="req-star">*</span>
                </label>
                <input
                  className="form-input"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Notes <span className="optional-tag">(optional)</span>
                </label>
                <textarea
                  className="form-textarea"
                  placeholder="Anything specific you'd like us to know..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="approach-checkboxes">
                <p className="approach-checkboxes-label">
                  Required agreements <span className="req-star">*</span>
                </p>

                <label className="approach-check-item">
                  <input
                    type="checkbox"
                    checked={agreedPayment}
                    onChange={(e) => setAgreedPayment(e.target.checked)}
                  />
                  <span>
                    I understand that upon hiring, I agree to pay for the hours
                    worked, and that a formal contract will be provided later.
                  </span>
                </label>

                <label className="approach-check-item">
                  <input
                    type="checkbox"
                    checked={agreedInfo}
                    onChange={(e) => setAgreedInfo(e.target.checked)}
                  />
                  <span>I confirm that the information I've provided is accurate.</span>
                </label>

                <label className="approach-check-item">
                  <input
                    type="checkbox"
                    checked={agreedContact}
                    onChange={(e) => setAgreedContact(e.target.checked)}
                  />
                  <span>
                    I agree to be contacted by the Corvanta Virtual Solutions team
                    regarding this request.
                  </span>
                </label>

                <label className="approach-check-item">
                  <input
                    type="checkbox"
                    checked={agreedEmailContract}
                    onChange={(e) => setAgreedEmailContract(e.target.checked)}
                  />
                  <span>
                    I agree that the formal contract and legal terms will be sent
                    via email.
                  </span>
                </label>
              </div>
            </div>

            <div className="va-modal-footer">
              <button
                className="btn btn-outline btn-sm"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleSubmit}
                disabled={isPending}
              >
                {isPending ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
