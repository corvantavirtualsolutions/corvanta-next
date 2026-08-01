"use client";

import { useState, useTransition } from "react";
import { X, ExternalLink, Trash2 } from "lucide-react";
import { deleteVA } from "./actions";
import type { VA } from "./types";

interface Props {
  va: VA;
  onClose: () => void;
  onDeleted: () => void;
}

export default function VADetailModal({ va, onClose, onDeleted }: Props) {
  const [isPending, startTransition] = useTransition();
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  function handleDelete() {
    setDeleteError("");
    startTransition(async () => {
      const result = await deleteVA(va.id);
      if (result.error) {
        setDeleteError(result.error);
        setConfirmDelete(false);
      } else {
        onDeleted();
      }
    });
  }

  const hasLinks = va.portfolio_link || va.facebook_link || va.linkedin_link;

  return (
    <div className="va-modal-overlay" onClick={handleOverlayClick}>
      <div className="va-modal va-modal--detail">
        <div className="va-modal-header">
          <h2 className="va-modal-title">VA Profile</h2>
          <button className="va-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="va-modal-body">
          {/* Identity row */}
          <div className="va-detail-header">
            {va.profile_image_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={va.profile_image_url}
                alt={va.name}
                className="va-detail-img"
              />
            ) : (
              <div className="va-detail-placeholder">
                {va.name[0].toUpperCase()}
              </div>
            )}
            <div className="va-detail-identity">
              <h3 className="va-detail-name">{va.name}</h3>
              <p className="va-detail-niche">{va.niche}</p>
              <p className="va-detail-email">{va.email}</p>
            </div>
          </div>

          {/* Stats */}
          {(va.years_experience !== null ||
            va.past_clients !== null ||
            va.iq !== null ||
            va.english_score !== null) && (
            <div className="va-detail-stats">
              {va.years_experience !== null && (
                <div className="va-detail-stat">
                  <div className="va-detail-stat-label">Experience</div>
                  <div className="va-detail-stat-value">
                    {va.years_experience} yr{va.years_experience !== 1 ? "s" : ""}
                  </div>
                </div>
              )}
              {va.past_clients !== null && (
                <div className="va-detail-stat">
                  <div className="va-detail-stat-label">Past Clients</div>
                  <div className="va-detail-stat-value">{va.past_clients}</div>
                </div>
              )}
              {va.iq !== null && (
                <div className="va-detail-stat">
                  <div className="va-detail-stat-label">IQ</div>
                  <div className="va-detail-stat-value">{va.iq}</div>
                </div>
              )}
              {va.english_score !== null && (
                <div className="va-detail-stat">
                  <div className="va-detail-stat-label">English Score</div>
                  <div className="va-detail-stat-value">{va.english_score}</div>
                </div>
              )}
            </div>
          )}

          {/* Bio */}
          {va.bio && (
            <div className="va-detail-section">
              <h4 className="va-detail-section-label">About</h4>
              <p className="va-detail-bio">{va.bio}</p>
            </div>
          )}

          {/* Links */}
          {hasLinks && (
            <div className="va-detail-links">
              {va.portfolio_link && (
                <a
                  href={va.portfolio_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="va-detail-link"
                >
                  <ExternalLink size={13} /> Portfolio
                </a>
              )}
              {va.facebook_link && (
                <a
                  href={va.facebook_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="va-detail-link"
                >
                  <ExternalLink size={13} /> Facebook
                </a>
              )}
              {va.linkedin_link && (
                <a
                  href={va.linkedin_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="va-detail-link"
                >
                  <ExternalLink size={13} /> LinkedIn
                </a>
              )}
            </div>
          )}

          {/* Delete */}
          <div className="va-detail-delete">
            {deleteError && (
              <p className="admin-delete-error-msg" style={{ marginBottom: 8 }}>
                {deleteError}
              </p>
            )}
            {confirmDelete ? (
              <div className="admin-delete-confirm">
                <span className="admin-delete-confirm-text">
                  Delete this VA profile? This cannot be undone.
                </span>
                <div className="admin-delete-confirm-btns">
                  <button
                    className="admin-delete-confirm-yes"
                    onClick={handleDelete}
                    disabled={isPending}
                  >
                    {isPending ? "Deleting..." : "Delete"}
                  </button>
                  <button
                    className="admin-delete-confirm-cancel"
                    onClick={() => setConfirmDelete(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="admin-delete-btn"
                onClick={() => setConfirmDelete(true)}
              >
                <Trash2 size={14} /> Delete VA
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
