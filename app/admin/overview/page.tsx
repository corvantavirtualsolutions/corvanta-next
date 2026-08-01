import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import OverviewCharts from "./OverviewCharts";

async function fetchOverviewData() {
  const db = createAdminClient();

  const [
    { count: totalUsers },
    { count: totalVAs },
    { count: totalReviews },
    { count: totalSeekers },
    { count: emailedSeekers },
    { data: seekersByDay },
    { data: usersByDay },
    { data: vasByNiche },
    { data: ratings },
  ] = await Promise.all([
    db.from("users").select("*", { count: "exact", head: true }),
    db.from("va_profiles").select("*", { count: "exact", head: true }),
    db.from("reviews").select("*", { count: "exact", head: true }),
    db.from("va_seekers").select("*", { count: "exact", head: true }),
    db
      .from("va_seekers")
      .select("*", { count: "exact", head: true })
      .eq("emailed", true),
    db
      .from("va_seekers")
      .select("created_at")
      .order("created_at", { ascending: true }),
    db
      .from("users")
      .select("created_at")
      .order("created_at", { ascending: true }),
    db.from("va_profiles").select("niche"),
    db.from("reviews").select("rating"),
  ]);

  // Group seekers by day
  const seekerDayCounts: Record<string, number> = {};
  for (const row of seekersByDay ?? []) {
    const day = row.created_at.slice(0, 10);
    seekerDayCounts[day] = (seekerDayCounts[day] ?? 0) + 1;
  }
  const seekersOverTime = Object.entries(seekerDayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  // Group users by day
  const userDayCounts: Record<string, number> = {};
  for (const row of usersByDay ?? []) {
    const day = row.created_at.slice(0, 10);
    userDayCounts[day] = (userDayCounts[day] ?? 0) + 1;
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
    totalUsers: totalUsers ?? 0,
    totalVAs: totalVAs ?? 0,
    totalReviews: totalReviews ?? 0,
    totalSeekers: totalSeekers ?? 0,
    emailedSeekers: emailedSeekers ?? 0,
    seekersOverTime,
    usersOverTime,
    vasByNicheData,
    ratingDistribution,
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
  ];

  return (
    <div>
      <h1 className="admin-page-title">Overview</h1>

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
