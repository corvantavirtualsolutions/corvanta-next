"use client";

import { usePathname } from "next/navigation";

type UnreadCounts = {
  messages: number;
  seekers: number;
  applications: number;
  reviews: number;
};

function Badge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 18,
        height: 18,
        borderRadius: 99,
        background: "var(--color-primary)",
        color: "#fff",
        fontSize: "0.68rem",
        fontWeight: 700,
        padding: "0 5px",
        marginLeft: "auto",
        flexShrink: 0,
        lineHeight: 1,
      }}
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}

export function AdminSidebarNav({ unreadCounts }: { unreadCounts: UnreadCounts }) {
  const pathname = usePathname();

  const link = (href: string, label: string, badge = 0) => (
    <a
      href={href}
      className={`admin-nav-link${pathname === href ? " active" : ""}`}
      style={{ display: "flex", alignItems: "center" }}
    >
      {label}
      <Badge count={badge} />
    </a>
  );

  return (
    <nav style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ padding: "8px 10px 12px", borderBottom: "1px solid var(--color-border)", marginBottom: 4 }}>
        <p style={{ fontFamily: "var(--font-heading)", fontWeight: 700, fontSize: "1rem", color: "var(--color-text)", margin: 0 }}>
          Welcome Back! 😊
        </p>
      </div>
      {link("/admin/overview", "Overview")}
      {link("/admin", "Users")}
      {link("/admin/reviews", "Reviews", unreadCounts.reviews)}
      {link("/admin/vas", "Our VAs")}
      {link("/admin/seekers", "VA Seekers", unreadCounts.seekers)}
      {link("/admin/applications", "VA Applications", unreadCounts.applications)}
      {link("/admin/messages", "Messages", unreadCounts.messages)}
      {link("/admin/docs", "Company Docs")}
    </nav>
  );
}
