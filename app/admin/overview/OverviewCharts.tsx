"use client";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const NICHE_COLORS = [
  "#2EB87C", "#3B82F6", "#8B5CF6", "#F59E0B", "#06B6D4",
  "#F97316", "#EF4444", "#EC4899", "#6366F1", "#14B8A6",
];

const RATING_COLORS = ["#EF4444", "#F97316", "#F59E0B", "#84CC16", "#22C55E"];

interface StatusItem {
  name: string;
  value: number;
  color: string;
}

interface Props {
  seekersOverTime: { date: string; count: number }[];
  usersOverTime: { date: string; count: number }[];
  vasByNiche: { niche: string; count: number }[];
  ratingDistribution: { rating: string; count: number }[];
  seekerStatus: StatusItem[];
  messageStatus: StatusItem[];
  applicationStatus: StatusItem[];
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const tooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #E5E7EB",
  borderRadius: 10,
  boxShadow: "0 4px 24px rgba(17,24,39,0.10)",
  color: "#111827",
  fontSize: "0.82rem",
  padding: "8px 12px",
};

function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overview-chart-card">
      <div className="overview-chart-header">
        <h3 className="overview-chart-title">{title}</h3>
        {subtitle && <span className="overview-chart-subtitle">{subtitle}</span>}
      </div>
      {children}
    </div>
  );
}

function DonutChart({ data, label }: { data: StatusItem[]; label: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) {
    return <p className="overview-chart-empty">No data yet.</p>;
  }
  return (
    <div style={{ position: "relative" }}>
      <ResponsiveContainer width="100%" height={180}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={72}
            paddingAngle={3}
            dataKey="value"
            startAngle={90}
            endAngle={-270}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
        </PieChart>
      </ResponsiveContainer>
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>{total}</div>
        <div style={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 500, marginTop: 2 }}>{label}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {data.map((item) => (
          <div key={item.name} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "#374151" }}>
            <span
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: item.color,
                flexShrink: 0,
                display: "inline-block",
              }}
            />
            <span>
              {item.name}:{" "}
              <strong style={{ color: "#111827" }}>{item.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function OverviewCharts({
  seekersOverTime,
  usersOverTime,
  vasByNiche,
  ratingDistribution,
  seekerStatus,
  messageStatus,
  applicationStatus,
}: Props) {
  return (
    <div>
      {/* Area charts */}
      <div className="overview-charts-grid">
        <ChartCard title="VA Seeker Submissions" subtitle="over time">
          {seekersOverTime.length === 0 ? (
            <p className="overview-chart-empty">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={seekersOverTime} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="seekerGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(l) => formatDate(l as string)}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#8B5CF6"
                  strokeWidth={2.5}
                  fill="url(#seekerGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#8B5CF6", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="User Signups" subtitle="over time">
          {usersOverTime.length === 0 ? (
            <p className="overview-chart-empty">No data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={usersOverTime} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
                <XAxis
                  dataKey="date"
                  tickFormatter={formatDate}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={tooltipStyle}
                  labelFormatter={(l) => formatDate(l as string)}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#3B82F6"
                  strokeWidth={2.5}
                  fill="url(#userGrad)"
                  dot={false}
                  activeDot={{ r: 5, fill: "#3B82F6", strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>

      {/* Donut charts */}
      <div className="overview-charts-grid-3">
        <ChartCard title="VA Seekers" subtitle="email status">
          <DonutChart data={seekerStatus} label="total" />
        </ChartCard>
        <ChartCard title="Messages" subtitle="resolution status">
          <DonutChart data={messageStatus} label="total" />
        </ChartCard>
        <ChartCard title="Applications" subtitle="review status">
          <DonutChart data={applicationStatus} label="total" />
        </ChartCard>
      </div>

      {/* Bar charts */}
      <div className="overview-charts-grid">
        <ChartCard title="VAs by Niche" subtitle="distribution">
          {vasByNiche.length === 0 ? (
            <p className="overview-chart-empty">No VAs yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={Math.max(240, vasByNiche.length * 38)}>
              <BarChart data={vasByNiche} layout="vertical" margin={{ top: 0, right: 20, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" horizontal={false} />
                <XAxis
                  type="number"
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="niche"
                  width={130}
                  tick={{ fontSize: 11, fill: "#374151" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                  {vasByNiche.map((_, i) => (
                    <Cell key={i} fill={NICHE_COLORS[i % NICHE_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Review Ratings" subtitle="distribution">
          {ratingDistribution.every((r) => r.count === 0) ? (
            <p className="overview-chart-empty">No reviews yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={ratingDistribution} margin={{ top: 8, right: 4, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" vertical={false} />
                <XAxis
                  dataKey="rating"
                  tick={{ fontSize: 13, fill: "#374151" }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  allowDecimals={false}
                  tick={{ fontSize: 10, fill: "#9CA3AF" }}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {ratingDistribution.map((_, i) => (
                    <Cell key={i} fill={RATING_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      </div>
    </div>
  );
}
