"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteSeeker } from "./actions";

type Stage = "idle" | "confirming" | "success" | "error";

export function DeleteSeekerButton({ seekerId }: { seekerId: string }) {
  const [isPending, startTransition] = useTransition();
  const [stage, setStage] = useState<Stage>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function handleConfirm() {
    startTransition(async () => {
      const result = await deleteSeeker(seekerId);
      if (result?.error) {
        setErrorMsg(result.error);
        setStage("error");
      } else {
        setStage("success");
      }
    });
  }

  if (stage === "success") {
    return <span className="admin-delete-success">Deleted.</span>;
  }

  if (stage === "error") {
    return (
      <span className="admin-delete-error-msg">
        {errorMsg}{" "}
        <button className="admin-delete-dismiss" onClick={() => setStage("idle")}>
          Dismiss
        </button>
      </span>
    );
  }

  if (stage === "confirming" || isPending) {
    return (
      <div className="admin-delete-confirm">
        <span className="admin-delete-confirm-text">
          Delete this record? This cannot be undone.
        </span>
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
      aria-label="Delete record"
    >
      <Trash2 size={14} />
      Delete
    </button>
  );
}
