"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deleteSubscriber } from "./actions";

type Subscriber = {
  id: string;
  name: string | null;
  email: string;
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
      <div className="admin-delete-confirm" onClick={(e) => e.stopPropagation()}>
        <span className="admin-delete-confirm-text">Delete this subscriber?</span>
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
            <th>Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                style={{
                  textAlign: "center",
                  color: "var(--color-text-secondary)",
                  padding: 48,
                }}
              >
                No subscribers yet.
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
