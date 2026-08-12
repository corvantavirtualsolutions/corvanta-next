"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2, ExternalLink } from "lucide-react";
import { deleteApplication, updateApplicationStatus, markApplicationOpened } from "./actions";
import type { VAApplication } from "./page";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const STATUS_OPTS = ["pending", "reviewed", "approved", "rejected"] as const;

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  pending:  { bg: "#EFF6FF", color: "#1D4ED8" },
  reviewed: { bg: "#FFF7ED", color: "#92400E" },
  approved: { bg: "#E6F7EF", color: "#166534" },
  rejected: { bg: "#FEF2F2", color: "#991B1B" },
  // legacy
  new:       { bg: "#EFF6FF", color: "#1D4ED8" },
  reviewing: { bg: "#FFF7ED", color: "#92400E" },
  accepted:  { bg: "#E6F7EF", color: "#166534" },
};

function StatusSelect({ app }: { app: VAApplication }) {
  const [isPending, startTransition] = useTransition();
  // Normalize legacy "new" -> "pending" so the dropdown shows correctly
  const initialStatus =
    app.status === "new" ? "pending"
    : app.status === "reviewing" ? "reviewed"
    : app.status === "accepted" ? "approved"
    : (app.status ?? "pending");
  const [status, setStatus] = useState(initialStatus);
  const style = STATUS_STYLE[status] ?? STATUS_STYLE.new;

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setStatus(next);
    startTransition(async () => {
      await updateApplicationStatus(app.id, next);
    });
  }

  return (
    <select
      value={status}
      onChange={handleChange}
      disabled={isPending}
      onClick={(e) => e.stopPropagation()}
      style={{
        padding: "4px 8px",
        borderRadius: 6,
        border: "1px solid var(--color-border)",
        fontSize: "0.82rem",
        background: style.bg,
        color: style.color,
        fontWeight: 600,
        cursor: "pointer",
        opacity: isPending ? 0.6 : 1,
        textTransform: "capitalize",
      }}
    >
      {STATUS_OPTS.map((s) => (
        <option key={s} value={s} style={{ textTransform: "capitalize" }}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </option>
      ))}
    </select>
  );
}

function DeleteButton({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [stage, setStage] = useState<"idle" | "confirming">("idle");

  function handleConfirm() {
    startTransition(async () => {
      await deleteApplication(id);
      onDeleted();
    });
  }

  if (stage === "confirming" || isPending) {
    return (
      <div
        className="admin-delete-confirm"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="admin-delete-confirm-text">Delete this application?</span>
        <div className="admin-delete-confirm-btns">
          <button
            className="admin-delete-confirm-yes"
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? "Deleting..." : "Delete"}
          </button>
          <button
            className="admin-delete-confirm-cancel"
            onClick={() => setStage("idle")}
            disabled={isPending}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      className="admin-delete-btn"
      onClick={(e) => {
        e.stopPropagation();
        setStage("confirming");
      }}
      aria-label="Delete application"
    >
      <Trash2 size={14} /> Delete
    </button>
  );
}

function englishLabel(score: number): string {
  if (score >= 27) return "Excellent (C1-C2)";
  if (score >= 23) return "Advanced (B2)";
  if (score >= 18) return "Intermediate (B1)";
  if (score >= 12) return "Basic (A2)";
  return "Beginner (A1)";
}

function iqLabel(score: number): string {
  if (score >= 27) return "Exceptional reasoning ability";
  if (score >= 24) return "Strong analytical skills";
  if (score >= 20) return "Above average; suitable for most VA roles";
  if (score >= 15) return "Average; may require more training";
  return "Consider additional evaluation";
}

function VideoPlayer({ label, url }: { label: string; url: string | null | undefined }) {
  if (!url) {
    return (
      <div style={{ marginBottom: "var(--sp-3)" }}>
        <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 8 }}>{label}</p>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "0.85rem" }}>
          No video recorded.
        </p>
      </div>
    );
  }
  return (
    <div style={{ marginBottom: "var(--sp-3)" }}>
      <p style={{ fontWeight: 700, fontSize: "0.9rem", marginBottom: 8 }}>{label}</p>
      <video
        src={url}
        controls
        playsInline
        style={{
          width: "100%",
          borderRadius: 10,
          background: "#000",
          display: "block",
          maxHeight: 260,
        }}
      />
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 4,
          fontSize: "0.78rem",
          color: "var(--color-accent)",
          marginTop: 6,
        }}
      >
        Open in new tab <ExternalLink size={11} />
      </a>
    </div>
  );
}

function DetailModal({
  app,
  onClose,
  onDeleted,
}: {
  app: VAApplication;
  onClose: () => void;
  onDeleted: () => void;
}) {
  function handleOverlay(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="va-modal-overlay" onClick={handleOverlay}>
      <div className="va-modal va-modal--detail">
        <div className="va-modal-header">
          <h2 className="va-modal-title">Application - {app.full_name}</h2>
          <button className="va-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="va-modal-body">
          {/* Personal info */}
          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">Personal</h4>
            <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16, flexWrap: "wrap" }}>
              {app.profile_photo_url && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={app.profile_photo_url}
                  alt={app.full_name}
                  style={{ width: 72, height: 72, borderRadius: "50%", objectFit: "cover", flexShrink: 0, border: "2px solid var(--color-border)" }}
                />
              )}
              <div className="seeker-detail-grid" style={{ flex: 1 }}>
                {[
                  ["Full Name", app.full_name],
                  ["Email", app.email],
                  ["Phone", app.phone],
                  ["Location", app.location],
                  ["Submitted", formatDateLong(app.created_at)],
                ].map(([label, value]) => (
                  <div key={label} className="seeker-detail-field">
                    <div className="seeker-detail-label">{label}</div>
                    <div className="seeker-detail-value">
                      {label === "Email" && value ? (
                        <a href={`mailto:${value}`}>{value}</a>
                      ) : (
                        value || "-"
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Professional */}
          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">Professional</h4>
            <div className="seeker-detail-grid">
              {[
                ["Specialization", app.specialization],
                ["Experience", app.years_experience],
                ["Past Clients", app.past_clients],
                ["English", app.english_proficiency],
              ].map(([label, value]) => (
                <div key={label} className="seeker-detail-field">
                  <div className="seeker-detail-label">{label}</div>
                  <div className="seeker-detail-value">{value || "-"}</div>
                </div>
              ))}
            </div>
            {app.skills && (
              <div className="seeker-detail-field" style={{ marginTop: 10 }}>
                <div className="seeker-detail-label">Skills &amp; Tools</div>
                <div className="seeker-detail-value seeker-detail-value--pre">{app.skills}</div>
              </div>
            )}
          </div>

          {/* Bio */}
          {app.bio && (
            <div className="seeker-detail-section">
              <h4 className="seeker-detail-section-title">Bio</h4>
              <div className="seeker-detail-value seeker-detail-value--pre">{app.bio}</div>
            </div>
          )}

          {/* Links */}
          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">Links</h4>
            <div className="seeker-detail-grid">
              {[
                ["Portfolio", app.portfolio_link],
                ["LinkedIn", app.linkedin_link],
                ["Facebook", app.facebook_link],
              ].map(([label, value]) => (
                <div key={label} className="seeker-detail-field">
                  <div className="seeker-detail-label">{label}</div>
                  <div className="seeker-detail-value">
                    {value ? (
                      <a href={value} target="_blank" rel="noopener noreferrer">
                        {value}
                      </a>
                    ) : "-"}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Scores */}
          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">Test Scores</h4>
            <div className="seeker-detail-grid">
              <div className="seeker-detail-field">
                <div className="seeker-detail-label">English MC Score</div>
                <div className="seeker-detail-value">
                  {app.english_mc_score != null ? (
                    <>
                      {`${app.english_mc_score} / 27`}
                      <span style={{ marginLeft: 8, color: "var(--color-text-secondary)", fontSize: "0.82rem", fontWeight: 500 }}>
                        - {englishLabel(app.english_mc_score)}
                      </span>
                    </>
                  ) : "-"}
                </div>
              </div>
              <div className="seeker-detail-field">
                <div className="seeker-detail-label">IQ Score</div>
                <div className="seeker-detail-value">
                  {app.iq_score != null ? (
                    <>
                      {`${app.iq_score} / 30`}
                      <span style={{ marginLeft: 8, color: "var(--color-text-secondary)", fontSize: "0.82rem", fontWeight: 500 }}>
                        - {iqLabel(app.iq_score)}
                      </span>
                    </>
                  ) : "-"}
                </div>
              </div>
            </div>
            {(app.english_writing_1 || app.english_writing_2 || app.english_writing_3) && (
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 10 }}>
                {[
                  ["Writing Answer 1", app.english_writing_1],
                  ["Writing Answer 2", app.english_writing_2],
                  ["Writing Answer 3", app.english_writing_3],
                ].map(([label, value]) =>
                  value ? (
                    <div key={label} className="seeker-detail-field">
                      <div className="seeker-detail-label">{label}</div>
                      <div className="seeker-detail-value seeker-detail-value--pre">{value}</div>
                    </div>
                  ) : null
                )}
              </div>
            )}
          </div>

          {/* Videos */}
          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">Recorded Videos</h4>
            <VideoPlayer label="Video 1 - Intro" url={app.intro_video_url} />
            <VideoPlayer label="Video 2 - Skills" url={app.skills_video_url} />
            <VideoPlayer
              label='Video 3 - "Which do you prefer: on time but wrong, or late but right? Why?"'
              url={app.answer_video_url}
            />
          </div>

          {/* Status + delete */}
          <div
            className="seeker-detail-section"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <StatusSelect app={app} />
            <DeleteButton id={app.id} onDeleted={onDeleted} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ApplicationsTable({
  applications,
}: {
  applications: VAApplication[];
}) {
  const [detail, setDetail] = useState<VAApplication | null>(null);
  const [locallyOpened, setLocallyOpened] = useState<Set<string>>(new Set());
  const router = useRouter();

  function openDetail(a: VAApplication) {
    if (a.opened_at === null && !locallyOpened.has(a.id)) {
      setLocallyOpened((prev) => new Set([...prev, a.id]));
      void markApplicationOpened(a.id);
    }
    setDetail(a);
  }

  function handleDeleted() {
    setDetail(null);
    router.refresh();
  }

  return (
    <>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Niche / Specialization</th>
              <th>Country</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-secondary)",
                    padding: 48,
                  }}
                >
                  No applications yet.
                </td>
              </tr>
            ) : (
              applications.map((a) => {
                const isUnread = a.opened_at === null && !locallyOpened.has(a.id);
                return (
                <tr
                  key={a.id}
                  className="seekers-table-row"
                  onClick={() => openDetail(a)}
                  style={{ background: isUnread ? "rgba(46,184,124,0.05)" : undefined }}
                >
                  <td style={{ fontWeight: isUnread ? 700 : 600 }}>{a.full_name}</td>
                  <td style={{ color: "var(--color-text-secondary)" }}>
                    {a.email}
                  </td>
                  <td>{a.specialization || "-"}</td>
                  <td>{a.location || "-"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatDate(a.created_at)}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <StatusSelect app={a} />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <DeleteButton id={a.id} onDeleted={() => router.refresh()} />
                  </td>
                </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {detail && (
        <DetailModal
          app={detail}
          onClose={() => setDetail(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}
