"use client";

import { X } from "lucide-react";
import { DeleteSeekerButton } from "./DeleteSeekerButton";
import type { VaSeeker } from "./types";

interface Props {
  seeker: VaSeeker;
  onClose: () => void;
  onDeleted: () => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function Field({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="seeker-detail-field">
      <div className="seeker-detail-label">{label}</div>
      <div className="seeker-detail-value">{value || "-"}</div>
    </div>
  );
}

function AgreementItem({ agreed, text }: { agreed: boolean; text: string }) {
  return (
    <div className="seeker-detail-agreement-item">
      <span
        className={`seeker-detail-agreement-dot${agreed ? " seeker-detail-agreement-dot--on" : ""}`}
        aria-hidden
      />
      <span style={{ color: agreed ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
        {text}
      </span>
    </div>
  );
}

export default function SeekerDetailModal({ seeker, onClose, onDeleted }: Props) {
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="va-modal-overlay" onClick={handleOverlayClick}>
      <div className="va-modal va-modal--detail">
        <div className="va-modal-header">
          <h2 className="va-modal-title">Submission Details</h2>
          <button className="va-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="va-modal-body">

          {/* Contact */}
          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">Contact</h4>
            <div className="seeker-detail-grid">
              <Field label="Name" value={seeker.name} />
              <Field label="Company" value={seeker.company} />
              <Field label="Email" value={seeker.email} />
              <Field label="Submitted" value={formatDate(seeker.created_at)} />
            </div>
          </div>

          {/* VA Approached */}
          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">VA Approached</h4>
            <div className="seeker-detail-grid">
              <Field label="VA Name" value={seeker.va_name} />
              <Field label="Niche" value={seeker.va_niche} />
              <div className="seeker-detail-field">
                <div className="seeker-detail-label">Match Score</div>
                <div className="seeker-detail-value">
                  {seeker.match_score !== null ? (
                    <span className="seeker-match-badge">{seeker.match_score}% match</span>
                  ) : (
                    "-"
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Search criteria */}
          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">Search Criteria</h4>
            <div className="seeker-detail-grid">
              <Field label="Category" value={seeker.category} />
              <Field label="Hours / Week" value={seeker.hours} />
              <Field label="Budget" value={seeker.budget} />
            </div>
            {seeker.project_details && (
              <div className="seeker-detail-field" style={{ marginTop: 12 }}>
                <div className="seeker-detail-label">Project Details</div>
                <div className="seeker-detail-value seeker-detail-value--pre">
                  {seeker.project_details}
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {seeker.notes && (
            <div className="seeker-detail-section">
              <h4 className="seeker-detail-section-title">Notes</h4>
              <div className="seeker-detail-value seeker-detail-value--pre">
                {seeker.notes}
              </div>
            </div>
          )}

          {/* Agreements */}
          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">Agreements</h4>
            <div className="seeker-detail-agreements">
              <AgreementItem
                agreed={seeker.agreed_payment_terms}
                text="I understand that upon hiring, I agree to pay for the hours worked, and that a formal contract will be provided later."
              />
              <AgreementItem
                agreed={seeker.agreed_accurate_info}
                text="I confirm that the information I've provided is accurate."
              />
              <AgreementItem
                agreed={seeker.agreed_contact}
                text="I agree to be contacted by the Corvanta Virtual Solutions team regarding this request."
              />
              <AgreementItem
                agreed={seeker.agreed_email_contract}
                text="I agree that the formal contract and legal terms will be sent via email."
              />
            </div>
          </div>

          {/* Delete */}
          <div className="seeker-detail-delete">
            <DeleteSeekerButton seekerId={seeker.id} onDeleted={onDeleted} />
          </div>
        </div>
      </div>
    </div>
  );
}
