"use client";

import { usePathname } from "next/navigation";

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <a
        href="/admin"
        className={`admin-nav-link${pathname === "/admin" ? " active" : ""}`}
      >
        Users
      </a>
      <a
        href="/admin/reviews"
        className={`admin-nav-link${pathname === "/admin/reviews" ? " active" : ""}`}
      >
        Reviews
      </a>
    </nav>
  );
}
