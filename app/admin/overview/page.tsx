import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import OverviewCharts from "./OverviewCharts";

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
    { count: totalSubscribers, error: subscribersError },
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
    db.from("subscribers").select("*", { count: "exact", head: true }),
  ]);

  // Surface any errors to the console so they're visible in server logs
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
    subscribersError && `subscribers: ${subscribersError.message}`,
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
    totalSubscribers: totalSubscribers ?? 0,
    seekersOverTime,
    usersOverTime,
    vasByNicheData,
    ratingDistribution,
    errors,
  };
}

export default async function AdminOverviewPage() {
  const data = await fetchOverviewData();

  const statCards = [
    { label: "Total Users", value: data.totalUsers, href: "/admin" },
    { label: "Our VAs", value: data.totalVAs, href: "/admin/vas" },
    { label: "Reviews", value: data.totalReviews, href: "/admin/reviews" },
    {
      label: "VA Seekers",
      value: data.totalSeekers,
      href: "/admin/seekers",
      sub: `${data.emailedSeekers} emailed · ${data.totalSeekers - data.emailedSeekers} pending`,
    },
    {
      label: "Messages",
      value: data.totalMessages,
      href: "/admin/messages",
      sub: `${data.pendingMessages} pending · ${data.totalMessages - data.pendingMessages} resolved`,
    },
    {
      label: "Company Docs",
      value: data.totalDocs,
      href: "/admin/docs",
    },
    {
      label: "VA Applications",
      value: data.totalApplications,
      href: "/admin/applications",
      sub: `${data.newApplications} pending`,
    },
    {
      label: "Subscribers",
      value: data.totalSubscribers,
      href: "/admin/subscribers",
    },
  ];

  return (
    <div>
      <h1 className="admin-page-title">Overview</h1>

      {data.errors.length > 0 && (
        <div style={{ marginBottom: 24, padding: "12px 16px", background: "#FEF2F2", border: "1px solid #FECACA", borderRadius: 8 }}>
          <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--color-error)", fontWeight: 600 }}>
            Some data failed to load:
          </p>
          <ul style={{ margin: "6px 0 0", paddingLeft: 18, fontSize: "0.82rem", color: "var(--color-error)" }}>
            {data.errors.map((e) => <li key={e as string}>{e}</li>)}
          </ul>
        </div>
      )}

      <div className="overview-stat-grid">
        {statCards.map((card) => (
          <Link key={card.label} href={card.href} className="overview-stat-card">
            <div className="overview-stat-value">{card.value}</div>
            <div className="overview-stat-label">{card.label}</div>
            {card.sub && <div className="overview-stat-sub">{card.sub}</div>}
          </Link>
        ))}
      </div>

      <OverviewCharts
        seekersOverTime={data.seekersOverTime}
        usersOverTime={data.usersOverTime}
        vasByNiche={data.vasByNicheData}
        ratingDistribution={data.ratingDistribution}
      />
    </div>
  );
}
