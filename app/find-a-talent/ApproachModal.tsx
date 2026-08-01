"use client";

import { useState, useTransition } from "react";
import { X, CheckCircle2 } from "lucide-react";
import { submitApproach, type MatchedVA } from "./actions";

interface Props {
  va: MatchedVA;
  onClose: () => void;
}

export default function ApproachModal({ va, onClose }: Props) {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [agreedPayment, setAgreedPayment] = useState(false);
  const [agreedInfo, setAgreedInfo] = useState(false);
  const [agreedContact, setAgreedContact] = useState(false);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleSubmit() {
    setError("");
    const fd = new FormData();
    fd.append("name", name);
    fd.append("company", company);
    fd.append("agreed_payment_terms", String(agreedPayment));
    fd.append("agreed_accurate_info", String(agreedInfo));
    fd.append("agreed_contact", String(agreedContact));
    fd.append("notes", notes);
    fd.append("va_id", va.id);
    fd.append("va_niche", va.niche);

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
              <p className="approach-va-context">
                You're approaching a <strong>{va.niche}</strong> VA. Our team will
                follow up within one business day.
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
                  <span>
                    I confirm that the information I've provided is accurate.
                  </span>
                </label>

                <label className="approach-check-item">
                  <input
                    type="checkbox"
                    checked={agreedContact}
                    onChange={(e) => setAgreedContact(e.target.checked)}
                  />
                  <span>
                    I agree to be contacted by the Corvanta team regarding this
                    request.
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
