"use client";

import { useState, useTransition } from "react";
import { toggleEmailed } from "./actions";

export function EmailedToggle({
  seekerId,
  initialEmailed,
}: {
  seekerId: string;
  initialEmailed: boolean;
}) {
  const [emailed, setEmailed] = useState(initialEmailed);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const next = !emailed;
    setEmailed(next); // optimistic update
    startTransition(async () => {
      const result = await toggleEmailed(seekerId, next);
      if (result.error) setEmailed(!next); // revert on error
    });
  }

  return (
    <button
      className={`emailed-toggle${emailed ? " emailed-toggle--on" : ""}`}
      onClick={handleToggle}
      disabled={isPending}
      title={emailed ? "Mark as not emailed" : "Mark as emailed"}
    >
      {emailed ? "Emailed" : "Not emailed"}
    </button>
  );
}
