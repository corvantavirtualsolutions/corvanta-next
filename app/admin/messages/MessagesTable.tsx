"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Trash2 } from "lucide-react";
import { deleteMessage, updateMessageStatus } from "./actions";
import type { Message } from "./page";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function StatusSelect({ message }: { message: Message }) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState(message.status ?? "pending");

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    setStatus(next);
    startTransition(async () => {
      await updateMessageStatus(message.id, next);
    });
  }

  const isResolved = status === "resolved";

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
        background: isResolved ? "#E6F7EF" : "#FFF7ED",
        color: isResolved ? "#166534" : "#92400E",
        fontWeight: 600,
        cursor: "pointer",
        opacity: isPending ? 0.6 : 1,
      }}
    >
      <option value="pending">Pending</option>
      <option value="resolved">Resolved</option>
    </select>
  );
}

function DeleteMessageButton({
  id,
  onDeleted,
}: {
  id: string;
  onDeleted: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [stage, setStage] = useState<"idle" | "confirming">("idle");

  function handleConfirm() {
    startTransition(async () => {
      await deleteMessage(id);
      onDeleted();
    });
  }

  if (stage === "confirming" || isPending) {
    return (
      <div
        className="admin-delete-confirm"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="admin-delete-confirm-text">Delete this message?</span>
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
      aria-label="Delete message"
    >
      <Trash2 size={14} /> Delete
    </button>
  );
}

function MessageDetailModal({
  message,
  onClose,
  onDeleted,
}: {
  message: Message;
  onClose: () => void;
  onDeleted: () => void;
}) {
  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="va-modal-overlay" onClick={handleOverlayClick}>
      <div className="va-modal va-modal--detail">
        <div className="va-modal-header">
          <h2 className="va-modal-title">Message Details</h2>
          <button className="va-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="va-modal-body">
          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">From</h4>
            <div className="seeker-detail-grid">
              <div className="seeker-detail-field">
                <div className="seeker-detail-label">Full Name</div>
                <div className="seeker-detail-value">{message.full_name}</div>
              </div>
              <div className="seeker-detail-field">
                <div className="seeker-detail-label">Email</div>
                <div className="seeker-detail-value">
                  <a href={`mailto:${message.email}`}>{message.email}</a>
                </div>
              </div>
              <div className="seeker-detail-field">
                <div className="seeker-detail-label">I am a...</div>
                <div className="seeker-detail-value">
                  {message.i_am_a || "-"}
                </div>
              </div>
              <div className="seeker-detail-field">
                <div className="seeker-detail-label">Date</div>
                <div className="seeker-detail-value">
                  {formatDateLong(message.created_at)}
                </div>
              </div>
            </div>
          </div>

          <div className="seeker-detail-section">
            <h4 className="seeker-detail-section-title">Message</h4>
            <div className="seeker-detail-value seeker-detail-value--pre">
              {message.message}
            </div>
          </div>

          <div
            className="seeker-detail-section"
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <StatusSelect message={message} />
            <DeleteMessageButton id={message.id} onDeleted={onDeleted} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MessagesTable({ messages }: { messages: Message[] }) {
  const [detail, setDetail] = useState<Message | null>(null);
  const router = useRouter();

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
              <th>Full Name</th>
              <th>Email</th>
              <th>I am a...</th>
              <th>Message</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-secondary)",
                    padding: 48,
                  }}
                >
                  No messages yet.
                </td>
              </tr>
            ) : (
              messages.map((m) => (
                <tr
                  key={m.id}
                  className="seekers-table-row"
                  onClick={() => setDetail(m)}
                >
                  <td style={{ fontWeight: 600 }}>{m.full_name}</td>
                  <td style={{ color: "var(--color-text-secondary)" }}>
                    {m.email}
                  </td>
                  <td>{m.i_am_a || "-"}</td>
                  <td
                    style={{
                      maxWidth: 200,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {m.message}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {formatDate(m.created_at)}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <StatusSelect message={m} />
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <DeleteMessageButton
                      id={m.id}
                      onDeleted={() => router.refresh()}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {detail && (
        <MessageDetailModal
          message={detail}
          onClose={() => setDetail(null)}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}
