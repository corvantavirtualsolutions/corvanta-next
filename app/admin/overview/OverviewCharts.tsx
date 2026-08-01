"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

interface Props {
  seekersOverTime: { date: string; count: number }[];
  usersOverTime: { date: string; count: number }[];
  vasByNiche: { niche: string; count: number }[];
  ratingDistribution: { rating: string; count: number }[];
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overview-chart-card">
      <h3 className="overview-chart-title">{title}</h3>
      {children}
    </div>
  );
}

export default function OverviewCharts({
  seekersOverTime,
  usersOverTime,
  vasByNiche,
  ratingDistribution,
}: Props) {
  const lineColor = "var(--color-primary)";
  const barColor = "var(--color-primary)";

  const tooltipStyle = {
    backgroundColor: "var(--color-surface)",
    border: "1px solid var(--color-border)",
    borderRadius: 8,
    color: "var(--color-text-primary)",
    fontSize: "0.82rem",
  };

  return (
    <div className="overview-charts-grid">
      <ChartCard title="VA Seeker Submissions Over Time">
        {seekersOverTime.length === 0 ? (
          <p className="overview-chart-empty">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={seekersOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="count"
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="User Signups Over Time">
        {usersOverTime.length === 0 ? (
          <p className="overview-chart-empty">No data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={usersOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Line
                type="monotone"
                dataKey="count"
                stroke={lineColor}
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="VAs by Niche">
        {vasByNiche.length === 0 ? (
          <p className="overview-chart-empty">No VAs yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={vasByNiche} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="niche"
                width={120}
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={barColor} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>

      <ChartCard title="Review Rating Distribution">
        {ratingDistribution.every((r) => r.count === 0) ? (
          <p className="overview-chart-empty">No reviews yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ratingDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="rating"
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: "var(--color-text-secondary)" }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={barColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </ChartCard>
    </div>
  );
}
