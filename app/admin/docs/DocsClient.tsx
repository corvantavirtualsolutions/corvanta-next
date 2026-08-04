"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, ExternalLink, X } from "lucide-react";
import { addDoc, deleteDoc } from "./actions";
import type { CompanyDoc } from "./page";

const CATEGORIES = ["Contract", "Files", "Invoice", "Letters", "Other"];

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function DeleteDocButton({
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
      await deleteDoc(id);
      onDeleted();
    });
  }

  if (stage === "confirming" || isPending) {
    return (
      <div className="admin-delete-confirm">
        <span className="admin-delete-confirm-text">Delete this document?</span>
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
      aria-label="Delete document"
    >
      <Trash2 size={14} /> Delete
    </button>
  );
}

function AddDocModal({
  onClose,
  onAdded,
}: {
  onClose: () => void;
  onAdded: () => void;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [category, setCategory] = useState("Contract");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setError("");
    startTransition(async () => {
      const result = await addDoc(formData);
      if (result.error) {
        setError(result.error);
      } else {
        onAdded();
        onClose();
      }
    });
  }

  function handleOverlayClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <div className="va-modal-overlay" onClick={handleOverlayClick}>
      <div className="va-modal" style={{ maxWidth: 480 }}>
        <div className="va-modal-header">
          <h2 className="va-modal-title">Add Document</h2>
          <button className="va-modal-close" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="va-modal-body">
          {error && (
            <div
              style={{
                marginBottom: 16,
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

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                className="form-input"
                placeholder="Q1 2025 Contract"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Link (URL)</label>
              <input
                type="url"
                name="link"
                className="form-input"
                placeholder="https://..."
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                className="form-select"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            {category === "Other" && (
              <div className="form-group">
                <label className="form-label">Custom Category</label>
                <input
                  type="text"
                  name="category_other"
                  className="form-input"
                  placeholder="e.g. Agreements"
                />
              </div>
            )}

            <div className="va-modal-footer" style={{ paddingTop: 8 }}>
              <button
                type="button"
                className="btn btn-outline btn-sm"
                onClick={onClose}
                disabled={isPending}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary btn-sm"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save Document"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function DocsClient({ docs }: { docs: CompanyDoc[] }) {
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("All");
  const router = useRouter();

  function handleAdded() {
    router.refresh();
  }

  function handleDeleted() {
    router.refresh();
  }

  const allCategories = Array.from(new Set(docs.map((d) => d.category))).sort();
  const filterOptions = ["All", ...allCategories];
  const filtered =
    filter === "All" ? docs : docs.filter((d) => d.category === filter);

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 20,
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", flex: 1 }}>
          {filterOptions.map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              style={{
                padding: "4px 12px",
                borderRadius: 20,
                border: "1px solid var(--color-border)",
                background:
                  filter === opt ? "var(--color-accent)" : "transparent",
                color:
                  filter === opt ? "#fff" : "var(--color-text-secondary)",
                fontSize: "0.82rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => setShowAdd(true)}
          style={{ whiteSpace: "nowrap" }}
        >
          <Plus size={16} /> Add Document
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Link</th>
              <th>Category</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-secondary)",
                    padding: 48,
                  }}
                >
                  No documents yet.
                </td>
              </tr>
            ) : (
              filtered.map((doc) => (
                <tr key={doc.id}>
                  <td style={{ fontWeight: 600 }}>{doc.title}</td>
                  <td>
                    <a
                      href={doc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        color: "var(--color-accent)",
                      }}
                    >
                      Open <ExternalLink size={13} />
                    </a>
                  </td>
                  <td>
                    <span
                      style={{
                        padding: "2px 10px",
                        borderRadius: 20,
                        background: "var(--color-surface)",
                        border: "1px solid var(--color-border)",
                        fontSize: "0.8rem",
                        fontWeight: 600,
                      }}
                    >
                      {doc.category}
                    </span>
                  </td>
                  <td
                    style={{
                      whiteSpace: "nowrap",
                      color: "var(--color-text-secondary)",
                    }}
                  >
                    {formatDate(doc.created_at)}
                  </td>
                  <td>
                    <DeleteDocButton id={doc.id} onDeleted={handleDeleted} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddDocModal onClose={() => setShowAdd(false)} onAdded={handleAdded} />
      )}
    </>
  );
}
