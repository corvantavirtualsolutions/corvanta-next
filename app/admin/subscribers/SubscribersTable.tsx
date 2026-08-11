"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteSubscriber, toggleSubscriberEmailed } from "./actions";

type Subscriber = {
  id: string;
  name: string | null;
  email: string;
  emailed: boolean;
  created_at: string;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function EmailedToggle({ id, initialEmailed }: { id: string; initialEmailed: boolean }) {
  const [emailed, setEmailed] = useState(initialEmailed);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !emailed;
    setEmailed(next);
    startTransition(async () => {
      const result = await toggleSubscriberEmailed(id, next);
      if (result.error) setEmailed(!next); // revert on error
    });
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 12px",
        borderRadius: 99,
        border: "none",
        cursor: isPending ? "default" : "pointer",
        fontSize: "0.8rem",
        fontWeight: 600,
        opacity: isPending ? 0.6 : 1,
        transition: "background 0.15s, color 0.15s",
        background: emailed ? "#E6F7EF" : "#F3F4F6",
        color: emailed ? "#166534" : "#6B7280",
        whiteSpace: "nowrap",
      }}
      aria-label={emailed ? "Mark as not emailed" : "Mark as emailed"}
    >
      <span
        style={{
          width: 7,
          height: 7,
          borderRadius: "50%",
          background: emailed ? "#22C55E" : "#9CA3AF",
          flexShrink: 0,
        }}
      />
      {emailed ? "Emailed" : "Not emailed"}
    </button>
  );
}

function DeleteButton({ id, onDeleted }: { id: string; onDeleted: () => void }) {
  const [isPending, startTransition] = useTransition();
  const [stage, setStage] = useState<"idle" | "confirming">("idle");

  function handleConfirm() {
    startTransition(async () => {
      await deleteSubscriber(id);
      onDeleted();
    });
  }

  if (stage === "confirming" || isPending) {
    return (
      <div className="admin-delete-confirm">
        <span className="admin-delete-confirm-text">Delete this entry?</span>
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
      onClick={() => setStage("confirming")}
      aria-label="Delete subscriber"
    >
      <Trash2 size={14} /> Delete
    </button>
  );
}

export default function SubscribersTable({
  subscribers,
}: {
  subscribers: Subscriber[];
}) {
  const router = useRouter();

  return (
    <div className="admin-table-wrap">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Date Added</th>
            <th>Emailed</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.length === 0 ? (
            <tr>
              <td
                colSpan={5}
                style={{
                  textAlign: "center",
                  color: "var(--color-text-secondary)",
                  padding: 48,
                }}
              >
                No submissions yet.
              </td>
            </tr>
          ) : (
            subscribers.map((s) => (
              <tr key={s.id}>
                <td style={{ fontWeight: 600 }}>{s.name || "-"}</td>
                <td>
                  <a href={`mailto:${s.email}`} style={{ color: "var(--color-accent)" }}>
                    {s.email}
                  </a>
                </td>
                <td style={{ whiteSpace: "nowrap", color: "var(--color-text-secondary)" }}>
                  {formatDate(s.created_at)}
                </td>
                <td>
                  <EmailedToggle id={s.id} initialEmailed={s.emailed} />
                </td>
                <td>
                  <DeleteButton id={s.id} onDeleted={() => router.refresh()} />
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
