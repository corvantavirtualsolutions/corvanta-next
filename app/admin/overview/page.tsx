import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import { Users, Bot, Star, Search, MessageCircle, FileText, ClipboardList, TrendingUp } from "lucide-react";
import OverviewCharts from "./OverviewCharts";

const STAT_COLORS = {
  users: "#3B82F6",
  vas: "#2EB87C",
  reviews: "#F59E0B",
  seekers: "#8B5CF6",
  messages: "#06B6D4",
  docs: "#F97316",
  applications: "#EF4444",
};

async function fetchOverviewData() {
  const db = createAdminClient();

  const [
    usersResult,
    { count: totalVAs, error: vasError },
    { count: totalReviews, error: reviewsError },
    { count: totalSeekers, error: seekersError },
    { count: emailedSeekers, error: emailedError },
    { data: seekersByDay, error: seekersDayError },
    { data: vasByNiche, error: nicheError },
    { data: ratings, error: ratingsError },
    { count: totalMessages, error: messagesError },
    { count: pendingMessages, error: pendingMessagesError },
    { count: totalDocs, error: docsError },
    { count: totalApplications, error: appsError },
    { count: newApplications, error: newAppsError },
  ] = await Promise.all([
    db.auth.admin.listUsers({ perPage: 1000 }),
    db.from("vas").select("*", { count: "exact", head: true }),
    db.from("reviews").select("*", { count: "exact", head: true }),
    db.from("va_seekers").select("*", { count: "exact", head: true }),
    db.from("va_seekers").select("*", { count: "exact", head: true }).eq("emailed", true),
    db.from("va_seekers").select("created_at").order("created_at", { ascending: true }),
    db.from("vas").select("niche"),
    db.from("reviews").select("rating"),
    db.from("messages").select("*", { count: "exact", head: true }),
    db.from("messages").select("*", { count: "exact", head: true }).eq("status", "pending"),
    db.from("company_docs").select("*", { count: "exact", head: true }),
    db.from("va_applications").select("*", { count: "exact", head: true }),
    db.from("va_applications").select("*", { count: "exact", head: true }).eq("status", "pending"),
  ]);

  const errors = [
    vasError && `vas: ${vasError.message}`,
    reviewsError && `reviews: ${reviewsError.message}`,
    seekersError && `va_seekers: ${seekersError.message}`,
    emailedError && `va_seekers (emailed): ${emailedError.message}`,
    seekersDayError && `va_seekers (by day): ${seekersDayError.message}`,
    nicheError && `vas (niche): ${nicheError.message}`,
    ratingsError && `reviews (rating): ${ratingsError.message}`,
    usersResult.error && `auth.listUsers: ${usersResult.error.message}`,
    messagesError && `messages: ${messagesError.message}`,
    pendingMessagesError && `messages (pending): ${pendingMessagesError.message}`,
    docsError && `company_docs: ${docsError.message}`,
    appsError && `va_applications: ${appsError.message}`,
    newAppsError && `va_applications (new): ${newAppsError.message}`,
  ].filter(Boolean);
  if (errors.length > 0) {
    console.error("[Overview] Query errors:", errors.join(" | "));
  }

  const authUsers = usersResult.data?.users ?? [];
  const totalUsers = authUsers.length;

  // Group seekers by day
  const seekerDayCounts: Record<string, number> = {};
  for (const row of seekersByDay ?? []) {
    const day = row.created_at.slice(0, 10);
    seekerDayCounts[day] = (seekerDayCounts[day] ?? 0) + 1;
  }
  const seekersOverTime = Object.entries(seekerDayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  // Group auth users by signup day
  const userDayCounts: Record<string, number> = {};
  for (const u of authUsers) {
    if (u.created_at) {
      const day = u.created_at.slice(0, 10);
      userDayCounts[day] = (userDayCounts[day] ?? 0) + 1;
    }
  }
  const usersOverTime = Object.entries(userDayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  // VAs by niche
  const nicheCounts: Record<string, number> = {};
  for (const row of vasByNiche ?? []) {
    if (row.niche) nicheCounts[row.niche] = (nicheCounts[row.niche] ?? 0) + 1;
  }
  const vasByNicheData = Object.entries(nicheCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([niche, count]) => ({ niche, count }));

  // Rating distribution
  const ratingCounts: Record<string, number> = {};
  for (const row of ratings ?? []) {
    const r = String(row.rating);
    ratingCounts[r] = (ratingCounts[r] ?? 0) + 1;
  }
  const ratingDistribution = ["1", "2", "3", "4", "5"].map((r) => ({
    rating: `${r}★`,
    count: ratingCounts[r] ?? 0,
  }));

  // Avg rating
  const ratingList = ratings ?? [];
  const avgRating =
    ratingList.length > 0
      ? ratingList.reduce((sum: number, r: { rating: number | null }) => sum + (Number(r.rating) || 0), 0) /
        ratingList.length
      : null;

  return {
    totalUsers,
    totalVAs: totalVAs ?? 0,
    totalReviews: totalReviews ?? 0,
    totalSeekers: totalSeekers ?? 0,
    emailedSeekers: emailedSeekers ?? 0,
    totalMessages: totalMessages ?? 0,
    pendingMessages: pendingMessages ?? 0,
    totalDocs: totalDocs ?? 0,
    totalApplications: totalApplications ?? 0,
    newApplications: newApplications ?? 0,
    avgRating,
    seekersOverTime,
    usersOverTime,
    vasByNicheData,
    ratingDistribution,
    errors,
  };
}

export default async function AdminOverviewPage() {
  const data = await fetchOverviewData();

  const emailRate =
    data.totalSeekers > 0 ? Math.round((data.emailedSeekers / data.totalSeekers) * 100) : 0;
  const resolutionRate =
    data.totalMessages > 0
      ? Math.round(((data.totalMessages - data.pendingMessages) / data.totalMessages) * 100)
      : 0;

  const seekerStatus = [
    { name: "Emailed", value: data.emailedSeekers, color: "#2EB87C" },
    { name: "Pending", value: data.totalSeekers - data.emailedSeekers, color: "#F59E0B" },
  ];
  const messageStatus = [
    { name: "Resolved", value: data.totalMessages - data.pendingMessages, color: "#2EB87C" },
    { name: "Pending", value: data.pendingMessages, color: "#F59E0B" },
  ];
  const applicationStatus = [
    { name: "Reviewed", value: data.totalApplications - data.newApplications, color: "#2EB87C" },
    { name: "Pending", value: data.newApplications, color: "#EF4444" },
  ];

  const statCards = [
    {
      label: "Total Users",
      value: data.totalUsers,
      href: "/admin",
      color: STAT_COLORS.users,
      icon: <Users size={18} />,
    },
    {
      label: "Our VAs",
      value: data.totalVAs,
      href: "/admin/vas",
      color: STAT_COLORS.vas,
      icon: <Bot size={18} />,
    },
    {
      label: "Reviews",
      value: data.totalReviews,
      href: "/admin/reviews",
      color: STAT_COLORS.reviews,
      icon: <Star size={18} />,
      sub: data.avgRating ? `Avg ${data.avgRating.toFixed(1)}★ across all reviews` : undefined,
    },
    {
      label: "VA Seekers",
      value: data.totalSeekers,
      href: "/admin/seekers",
      color: STAT_COLORS.seekers,
      icon: <Search size={18} />,
      sub: `${data.emailedSeekers} emailed · ${data.totalSeekers - data.emailedSeekers} pending`,
    },
    {
      label: "Messages",
      value: data.totalMessages,
      href: "/admin/messages",
      color: STAT_COLORS.messages,
      icon: <MessageCircle size={18} />,
      sub: `${data.pendingMessages} pending · ${data.totalMessages - data.pendingMessages} resolved`,
    },
    {
      label: "Company Docs",
      value: data.totalDocs,
      href: "/admin/docs",
      color: STAT_COLORS.docs,
      icon: <FileText size={18} />,
    },
    {
      label: "VA Applications",
      value: data.totalApplications,
      href: "/admin/applications",
      color: STAT_COLORS.applications,
      icon: <ClipboardList size={18} />,
      sub: `${data.newApplications} pending review`,
    },
  ];

  const kpiMetrics = [
    { label: "Email Rate", value: `${emailRate}%`, description: "of seekers contacted", color: "#8B5CF6" },
    { label: "Resolution Rate", value: `${resolutionRate}%`, description: "of messages resolved", color: "#3B82F6" },
    ...(data.avgRating
      ? [{ label: "Avg Rating", value: `${data.avgRating.toFixed(1)}★`, description: "from reviews", color: "#F59E0B" }]
      : []),
    { label: "Pending Apps", value: String(data.newApplications), description: "need review", color: "#EF4444" },
  ];

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: 24,
          gap: 12,
        }}
      >
        <div>
          <h1 className="admin-page-title" style={{ marginBottom: 4 }}>
            Overview
          </h1>
          <p style={{ fontSize: "0.875rem", color: "var(--color-text-secondary)", margin: 0 }}>
            Platform health and activity at a glance
          </p>
        </div>
        <div
          style={{
            fontSize: "0.75rem",
            color: "var(--color-text-secondary)",
            background: "var(--color-surface)",
            border: "1px solid var(--color-border)",
            borderRadius: 20,
            padding: "5px 12px",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          Live data
        </div>
      </div>

      {data.errors.length > 0 && (
        <div
          style={{
            marginBottom: 24,
            padding: "12px 16px",
            background: "#FEF2F2",
            border: "1px solid #FECACA",
            borderRadius: 8,
          }}
        >
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-error)", fontWeight: 600 }}>
            Some data failed to load:
          </p>
          <ul
            style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: "0.82rem", color: "var(--color-error)" }}
          >
            {data.errors.map((e) => (
              <li key={e as string}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Stat cards */}
      <div className="overview-stat-grid">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="overview-stat-card"
            style={{ borderTopColor: card.color, borderTopWidth: 3, borderTopStyle: "solid" }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div className="overview-stat-value" style={{ color: card.color }}>
                  {card.value}
                </div>
                <div className="overview-stat-label">{card.label}</div>
              </div>
              <div
                style={{
                  background: card.color + "18",
                  color: card.color,
                  borderRadius: 10,
                  padding: "8px 10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </div>
            </div>
            {card.sub && <div className="overview-stat-sub">{card.sub}</div>}
          </Link>
        ))}
      </div>

      {/* KPI strip */}
      <div className="overview-kpi-row" style={{ marginBottom: 28 }}>
        {kpiMetrics.map((kpi) => (
          <div key={kpi.label} className="overview-kpi-chip">
            <TrendingUp size={13} style={{ color: kpi.color, flexShrink: 0 }} />
            <span className="overview-kpi-value" style={{ color: kpi.color }}>
              {kpi.value}
            </span>
            <span className="overview-kpi-label">{kpi.label}</span>
            <span className="overview-kpi-desc">— {kpi.description}</span>
          </div>
        ))}
      </div>

      <OverviewCharts
        seekersOverTime={data.seekersOverTime}
        usersOverTime={data.usersOverTime}
        vasByNiche={data.vasByNicheData}
        ratingDistribution={data.ratingDistribution}
        seekerStatus={seekerStatus}
        messageStatus={messageStatus}
        applicationStatus={applicationStatus}
      />
    </div>
  );
}
