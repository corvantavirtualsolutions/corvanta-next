"use client";

import { usePathname } from "next/navigation";

export function AdminSidebarNav() {
  const pathname = usePathname();

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <a
        href="/admin/overview"
        className={`admin-nav-link${pathname === "/admin/overview" ? " active" : ""}`}
      >
        Overview
      </a>
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
      <a
        href="/admin/vas"
        className={`admin-nav-link${pathname === "/admin/vas" ? " active" : ""}`}
      >
        Our VAs
      </a>
      <a
        href="/admin/seekers"
        className={`admin-nav-link${pathname === "/admin/seekers" ? " active" : ""}`}
      >
        VA Seekers
      </a>
      <a
        href="/admin/applications"
        className={`admin-nav-link${pathname === "/admin/applications" ? " active" : ""}`}
      >
        VA Applications
      </a>
      <a
        href="/admin/messages"
        className={`admin-nav-link${pathname === "/admin/messages" ? " active" : ""}`}
      >
        Messages
      </a>
      <a
        href="/admin/subscribers"
        className={`admin-nav-link${pathname === "/admin/subscribers" ? " active" : ""}`}
      >
        Subscribers
      </a>
      <a
        href="/admin/docs"
        className={`admin-nav-link${pathname === "/admin/docs" ? " active" : ""}`}
      >
        Company Docs
      </a>
    </nav>
  );
}
