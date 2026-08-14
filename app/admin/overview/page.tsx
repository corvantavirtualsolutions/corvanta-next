import { createAdminClient } from "@/lib/supabase/admin";
import Link from "next/link";
import {
  Users,
  Bot,
  Star,
  Search,
  MessageCircle,
  FileText,
  ClipboardList,
  TrendingUp,
  Eye,
  Bell,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
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
    { data: seekerCategories, error: catError },
    { data: messagesFullData, error: msgFullError },
    { data: appsFullData, error: appFullError },
    { count: unopenedSeekers, error: unopenedSeekerError },
    { count: unreadMessages, error: unreadMsgError },
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
    db.from("va_seekers").select("category"),
    db.from("messages").select("i_am_a, created_at").order("created_at", { ascending: true }),
    db
      .from("va_applications")
      .select("iq_score, english_mc_score, specialization, status, created_at")
      .order("created_at", { ascending: true }),
    db.from("va_seekers").select("*", { count: "exact", head: true }).is("opened_at", null),
    db.from("messages").select("*", { count: "exact", head: true }).is("opened_at", null),
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
    catError && `va_seekers (category): ${catError.message}`,
    msgFullError && `messages (full): ${msgFullError.message}`,
    appFullError && `va_applications (full): ${appFullError.message}`,
    unopenedSeekerError && `va_seekers (unopened): ${unopenedSeekerError.message}`,
    unreadMsgError && `messages (unread): ${unreadMsgError.message}`,
  ].filter(Boolean);
  if (errors.length > 0) {
    console.error("[Overview] Query errors:", errors.join(" | "));
  }

  const authUsers = usersResult.data?.users ?? [];
  const totalUsers = authUsers.length;

  // Seekers over time
  const seekerDayCounts: Record<string, number> = {};
  for (const row of seekersByDay ?? []) {
    const day = row.created_at.slice(0, 10);
    seekerDayCounts[day] = (seekerDayCounts[day] ?? 0) + 1;
  }
  const seekersOverTime = Object.entries(seekerDayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  // Users over time
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

  // Rating distribution & avg
  const ratingCounts: Record<string, number> = {};
  for (const row of ratings ?? []) {
    const r = String(row.rating);
    ratingCounts[r] = (ratingCounts[r] ?? 0) + 1;
  }
  const ratingDistribution = ["1", "2", "3", "4", "5"].map((r) => ({
    rating: `${r}★`,
    count: ratingCounts[r] ?? 0,
  }));
  const ratingList = ratings ?? [];
  const avgRating =
    ratingList.length > 0
      ? ratingList.reduce(
          (sum: number, r: { rating: number | null }) => sum + (Number(r.rating) || 0),
          0
        ) / ratingList.length
      : null;

  // Seeker categories
  const catCounts: Record<string, number> = {};
  for (const row of seekerCategories ?? []) {
    const cat = row.category ?? "Unspecified";
    catCounts[cat] = (catCounts[cat] ?? 0) + 1;
  }
  const categoryData = Object.entries(catCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([category, count]) => ({ category, count }));

  // Messages over time + sender types
  const msgTypeCounts: Record<string, number> = {};
  const msgDayCounts: Record<string, number> = {};
  for (const row of messagesFullData ?? []) {
    const type = row.i_am_a ?? "Unknown";
    msgTypeCounts[type] = (msgTypeCounts[type] ?? 0) + 1;
    const day = (row.created_at as string).slice(0, 10);
    msgDayCounts[day] = (msgDayCounts[day] ?? 0) + 1;
  }
  const messageTypeData = Object.entries(msgTypeCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([type, count]) => ({ type, count }));
  const messagesOverTime = Object.entries(msgDayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

  // Applications: pipeline + scores + specialization + over time
  const pipelineMap = { pending: 0, reviewed: 0, approved: 0, rejected: 0 };
  const iqScores: number[] = [];
  const englishScores: number[] = [];
  const specCounts: Record<string, number> = {};
  const appDayCounts: Record<string, number> = {};
  for (const app of appsFullData ?? []) {
    const s = (app.status ?? "pending").toLowerCase();
    if (s === "pending" || s === "new") pipelineMap.pending++;
    else if (s === "reviewed" || s === "reviewing") pipelineMap.reviewed++;
    else if (s === "approved" || s === "accepted") pipelineMap.approved++;
    else if (s === "rejected") pipelineMap.rejected++;

    if (app.iq_score !== null) iqScores.push(Number(app.iq_score));
    if (app.english_mc_score !== null) englishScores.push(Number(app.english_mc_score));
    if (app.specialization) {
      specCounts[app.specialization] = (specCounts[app.specialization] ?? 0) + 1;
    }
    const day = (app.created_at as string).slice(0, 10);
    appDayCounts[day] = (appDayCounts[day] ?? 0) + 1;
  }
  const avgIQScore =
    iqScores.length > 0 ? iqScores.reduce((s, v) => s + v, 0) / iqScores.length : null;
  const avgEnglishScore =
    englishScores.length > 0 ? englishScores.reduce((s, v) => s + v, 0) / englishScores.length : null;
  const specializationData = Object.entries(specCounts)
    .sort(([, a], [, b]) => b - a)
    .map(([spec, count]) => ({ spec, count }));
  const applicationsOverTime = Object.entries(appDayCounts)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, count]) => ({ date, count }));

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
    unopenedSeekers: unopenedSeekers ?? 0,
    unreadMessages: unreadMessages ?? 0,
    pipelineMap,
    avgIQScore,
    avgEnglishScore,
    seekersOverTime,
    usersOverTime,
    vasByNicheData,
    ratingDistribution,
    categoryData,
    messageTypeData,
    messagesOverTime,
    applicationsOverTime,
    specializationData,
    errors,
  };
}

// ─── Pipeline stage ───────────────────────────────────────────────────────────
function PipelineStage({
  label,
  count,
  total,
  color,
}: {
  label: string;
  count: number;
  total: number;
  color: string;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderTop: `3px solid ${color}`,
        borderRadius: 10,
        padding: "16px 18px",
      }}
    >
      <div style={{ fontSize: "1.9rem", fontWeight: 800, color, lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151", margin: "5px 0 2px" }}>
        {label}
      </div>
      <div style={{ fontSize: "0.72rem", color: "#9CA3AF" }}>{pct}% of total</div>
      <div
        style={{
          marginTop: 10,
          height: 4,
          background: "#F3F4F6",
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: color,
            borderRadius: 4,
          }}
        />
      </div>
    </div>
  );
}

// ─── Score card ───────────────────────────────────────────────────────────────
function ScoreCard({
  label,
  value,
  max,
  color,
}: {
  label: string;
  value: number;
  max: number;
  color: string;
}) {
  const pct = Math.round((value / max) * 100);
  return (
    <div
      style={{
        flex: 1,
        background: "#fff",
        border: "1px solid #E5E7EB",
        borderTop: `3px solid ${color}`,
        borderRadius: 10,
        padding: "18px 20px",
      }}
    >
      <div
        style={{
          fontSize: "0.7rem",
          textTransform: "uppercase",
          letterSpacing: "0.06em",
          color: "#9CA3AF",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: "2.4rem", fontWeight: 800, color, lineHeight: 1 }}>
          {value.toFixed(1)}
        </span>
        <span style={{ fontSize: "0.85rem", color: "#9CA3AF" }}>/ {max}</span>
      </div>
      <div style={{ fontSize: "0.75rem", color: "#6B7280", margin: "4px 0 12px" }}>
        {pct}% — {pct >= 80 ? "Excellent" : pct >= 60 ? "Good" : pct >= 40 ? "Average" : "Below avg"}
      </div>
      <div style={{ height: 8, background: "#F3F4F6", borderRadius: 6, overflow: "hidden" }}>
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            borderRadius: 6,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
}

// ─── Section divider ──────────────────────────────────────────────────────────
function SectionDivider({ title }: { title: string }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        margin: "32px 0 18px",
      }}
    >
      <span
        style={{
          fontSize: "0.7rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#9CA3AF",
          whiteSpace: "nowrap",
        }}
      >
        {title}
      </span>
      <div style={{ flex: 1, height: 1, background: "#E5E7EB" }} />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
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
      href: "/admin/users",
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
    {
      label: "Email Rate",
      value: `${emailRate}%`,
      description: "of seekers contacted",
      color: "#8B5CF6",
    },
    {
      label: "Resolution Rate",
      value: `${resolutionRate}%`,
      description: "of messages resolved",
      color: "#3B82F6",
    },
    ...(data.avgRating
      ? [
          {
            label: "Avg Rating",
            value: `${data.avgRating.toFixed(1)}★`,
            description: "from reviews",
            color: "#F59E0B",
          },
        ]
      : []),
    ...(data.avgIQScore !== null
      ? [
          {
            label: "Avg IQ",
            value: `${data.avgIQScore.toFixed(1)}/30`,
            description: "application score",
            color: "#6366F1",
          },
        ]
      : []),
    ...(data.avgEnglishScore !== null
      ? [
          {
            label: "Avg English",
            value: `${data.avgEnglishScore.toFixed(1)}/27`,
            description: "application score",
            color: "#06B6D4",
          },
        ]
      : []),
  ];

  const needsAttention = [
    data.unopenedSeekers > 0 && {
      href: "/admin/seekers",
      count: data.unopenedSeekers,
      label: "Unread Seekers",
      color: "#8B5CF6",
      icon: <Eye size={15} />,
    },
    data.unreadMessages > 0 && {
      href: "/admin/messages",
      count: data.unreadMessages,
      label: "Unread Messages",
      color: "#06B6D4",
      icon: <Bell size={15} />,
    },
    data.newApplications > 0 && {
      href: "/admin/applications",
      count: data.newApplications,
      label: "Pending Applications",
      color: "#EF4444",
      icon: <AlertTriangle size={15} />,
    },
  ].filter(Boolean) as {
    href: string;
    count: number;
    label: string;
    color: string;
    icon: React.ReactNode;
  }[];

  const pipeline = [
    { label: "Pending", count: data.pipelineMap.pending, color: "#F59E0B" },
    { label: "Reviewed", count: data.pipelineMap.reviewed, color: "#3B82F6" },
    { label: "Approved", count: data.pipelineMap.approved, color: "#2EB87C" },
    { label: "Rejected", count: data.pipelineMap.rejected, color: "#EF4444" },
  ];

  return (
    <div>
      {/* Header */}
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
            color: "#2EB87C",
            background: "#E6F7EF",
            border: "1px solid #2EB87C40",
            borderRadius: 20,
            padding: "5px 12px",
            whiteSpace: "nowrap",
            flexShrink: 0,
            fontWeight: 600,
          }}
        >
          ● Live data
        </div>
      </div>

      {/* Errors */}
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
      <div className="overview-kpi-row" style={{ marginBottom: 24 }}>
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

      {/* Needs Attention */}
      {needsAttention.length > 0 && (
        <>
          <SectionDivider title="Needs Attention" />
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
            {needsAttention.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  background: item.color + "0D",
                  border: `1px solid ${item.color}40`,
                  borderLeft: `4px solid ${item.color}`,
                  borderRadius: 10,
                  padding: "12px 18px",
                  textDecoration: "none",
                  transition: "box-shadow 0.15s",
                  flex: "1 1 160px",
                }}
              >
                <span style={{ color: item.color }}>{item.icon}</span>
                <div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: item.color, lineHeight: 1 }}>
                    {item.count}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#6B7280", marginTop: 2 }}>{item.label}</div>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}

      {/* Application Pipeline */}
      {data.totalApplications > 0 && (
        <>
          <SectionDivider title="Application Pipeline" />
          <div
            style={{
              background: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: 12,
              padding: "20px 22px",
              marginBottom: 8,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <p style={{ margin: 0, fontSize: "0.8rem", color: "#9CA3AF" }}>
                {data.totalApplications} total applications
              </p>
              <Link
                href="/admin/applications"
                style={{ fontSize: "0.78rem", color: "#2EB87C", fontWeight: 600, textDecoration: "none" }}
              >
                View all →
              </Link>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "stretch" }}>
              {pipeline.map((stage, i) => (
                <>
                  <PipelineStage
                    key={stage.label}
                    label={stage.label}
                    count={stage.count}
                    total={data.totalApplications}
                    color={stage.color}
                  />
                  {i < pipeline.length - 1 && (
                    <div
                      key={`arrow-${i}`}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        color: "#D1D5DB",
                        flexShrink: 0,
                      }}
                    >
                      <ChevronRight size={18} />
                    </div>
                  )}
                </>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Application Test Scores */}
      {(data.avgIQScore !== null || data.avgEnglishScore !== null) && (
        <>
          <SectionDivider title="Applicant Test Scores" />
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap", marginBottom: 8 }}>
            {data.avgIQScore !== null && (
              <ScoreCard label="Avg IQ Score" value={data.avgIQScore} max={30} color="#6366F1" />
            )}
            {data.avgEnglishScore !== null && (
              <ScoreCard
                label="Avg English Score"
                value={data.avgEnglishScore}
                max={27}
                color="#06B6D4"
              />
            )}
          </div>
        </>
      )}

      {/* Charts */}
      <SectionDivider title="Analytics & Trends" />
      <OverviewCharts
        seekersOverTime={data.seekersOverTime}
        usersOverTime={data.usersOverTime}
        messagesOverTime={data.messagesOverTime}
        applicationsOverTime={data.applicationsOverTime}
        vasByNiche={data.vasByNicheData}
        ratingDistribution={data.ratingDistribution}
        categoryData={data.categoryData}
        messageTypeData={data.messageTypeData}
        specializationData={data.specializationData}
        seekerStatus={seekerStatus}
        messageStatus={messageStatus}
        applicationStatus={applicationStatus}
      />
    </div>
  );
}
