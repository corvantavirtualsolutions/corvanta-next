"use client";

import { useTransition } from "react";
import { updateUserRole } from "./actions";

export function RoleToggle({
  userId,
  currentRole,
  isSuperAdmin,
}: {
  userId: string;
  currentRole: string;
  isSuperAdmin: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  if (isSuperAdmin) return null;

  const isAdmin = currentRole === "admin";

  function handleClick() {
    startTransition(async () => {
      await updateUserRole(userId, isAdmin ? "user" : "admin");
    });
  }

  return (
    <button
      className={`admin-role-btn${isAdmin ? " admin-role-btn--demote" : ""}`}
      onClick={handleClick}
      disabled={isPending}
    >
      {isPending ? "Saving..." : isAdmin ? "Remove admin" : "Make admin"}
    </button>
  );
}
