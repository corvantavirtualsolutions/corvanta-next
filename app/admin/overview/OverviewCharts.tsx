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

const PALETTE = [
  "#2EB87C", "#3B82F6", "#8B5CF6", "#F59E0B", "#06B6D4",
  "#F97316", "#EF4444", "#EC4899", "#6366F1", "#14B8A6",
  "#84CC16", "#A855F7",
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
  messagesOverTime: { date: string; count: number }[];
  applicationsOverTime: { date: string; count: number }[];
  vasByNiche: { niche: string; count: number }[];
  ratingDistribution: { rating: string; count: number }[];
  categoryData: { category: string; count: number }[];
  messageTypeData: { type: string; count: number }[];
  specializationData: { spec: string; count: number }[];
  seekerStatus: StatusItem[];
  messageStatus: StatusItem[];
  applicationStatus: StatusItem[];
}

const fmtDate = (dateStr: string) => {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
};

const tip = {
  backgroundColor: "#fff",
  border: "1px solid #E5E7EB",
  borderRadius: 10,
  boxShadow: "0 4px 24px rgba(17,24,39,0.10)",
  color: "#111827",
  fontSize: "0.82rem",
  padding: "8px 12px",
};

// ─── Shared chart card ────────────────────────────────────────────────────────
function Card({
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

// ─── Section label inside charts ──────────────────────────────────────────────
function SubSection({ title }: { title: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "28px 0 16px" }}>
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

// ─── Gradient area chart ──────────────────────────────────────────────────────
function AreaCard({
  title,
  subtitle,
  data,
  color,
  gradId,
}: {
  title: string;
  subtitle?: string;
  data: { date: string; count: number }[];
  color: string;
  gradId: string;
}) {
  return (
    <Card title={title} subtitle={subtitle}>
      {data.length === 0 ? (
        <p className="overview-chart-empty">No data yet.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.22} />
                <stop offset="95%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#F3F4F6" />
            <XAxis
              dataKey="date"
              tickFormatter={fmtDate}
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
            <Tooltip contentStyle={tip} labelFormatter={(l) => fmtDate(l as string)} />
            <Area
              type="monotone"
              dataKey="count"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradId})`}
              dot={false}
              activeDot={{ r: 5, fill: color, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

// ─── Donut chart ──────────────────────────────────────────────────────────────
function DonutChart({ data, label }: { data: StatusItem[]; label: string }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <p className="overview-chart-empty">No data yet.</p>;
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
          <Tooltip contentStyle={tip} />
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
        <div style={{ fontSize: "1.6rem", fontWeight: 800, color: "#111827", lineHeight: 1 }}>
          {total}
        </div>
        <div style={{ fontSize: "0.68rem", color: "#9CA3AF", fontWeight: 500, marginTop: 2 }}>
          {label}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 14, flexWrap: "wrap" }}>
        {data.map((item) => (
          <div
            key={item.name}
            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: "0.78rem", color: "#374151" }}
          >
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
              {item.name}: <strong style={{ color: "#111827" }}>{item.value}</strong>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Horizontal bar chart ─────────────────────────────────────────────────────
function HBar({
  data,
  keyField,
  label = "count",
  height,
}: {
  data: { [k: string]: string | number }[];
  keyField: string;
  label?: string;
  height?: number;
}) {
  if (data.length === 0) return <p className="overview-chart-empty">No data yet.</p>;
  return (
    <ResponsiveContainer width="100%" height={height ?? Math.max(220, data.length * 36)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 20, left: 8, bottom: 0 }}>
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
          dataKey={keyField}
          width={130}
          tick={{ fontSize: 11, fill: "#374151" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip contentStyle={tip} />
        <Bar dataKey={label} radius={[0, 6, 6, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function OverviewCharts({
  seekersOverTime,
  usersOverTime,
  messagesOverTime,
  applicationsOverTime,
  vasByNiche,
  ratingDistribution,
  categoryData,
  messageTypeData,
  specializationData,
  seekerStatus,
  messageStatus,
  applicationStatus,
}: Props) {
  return (
    <div>
      {/* ── Activity Trends ── */}
      <SubSection title="Activity Trends" />
      <div className="overview-charts-grid">
        <AreaCard
          title="VA Seeker Submissions"
          subtitle="over time"
          data={seekersOverTime}
          color="#8B5CF6"
          gradId="seekerGrad"
        />
        <AreaCard
          title="User Signups"
          subtitle="over time"
          data={usersOverTime}
          color="#3B82F6"
          gradId="userGrad"
        />
        <AreaCard
          title="Messages Received"
          subtitle="over time"
          data={messagesOverTime}
          color="#06B6D4"
          gradId="msgGrad"
        />
        <AreaCard
          title="Applications Submitted"
          subtitle="over time"
          data={applicationsOverTime}
          color="#EF4444"
          gradId="appGrad"
        />
      </div>

      {/* ── Status Breakdown ── */}
      <SubSection title="Status Breakdown" />
      <div className="overview-charts-grid-3">
        <Card title="VA Seekers" subtitle="email status">
          <DonutChart data={seekerStatus} label="total" />
        </Card>
        <Card title="Messages" subtitle="resolution status">
          <DonutChart data={messageStatus} label="total" />
        </Card>
        <Card title="Applications" subtitle="review status">
          <DonutChart data={applicationStatus} label="total" />
        </Card>
      </div>

      {/* ── Distributions ── */}
      <SubSection title="Distributions" />
      <div className="overview-charts-grid">
        <Card title="VAs by Niche" subtitle="distribution">
          <HBar data={vasByNiche} keyField="niche" />
        </Card>

        <Card title="Review Ratings" subtitle="distribution">
          {ratingDistribution.every((r) => r.count === 0) ? (
            <p className="overview-chart-empty">No reviews yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={ratingDistribution} margin={{ top: 8, right: 4, left: -18, bottom: 0 }}>
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
                <Tooltip contentStyle={tip} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {ratingDistribution.map((_, i) => (
                    <Cell key={i} fill={RATING_COLORS[i]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {categoryData.length > 0 && (
          <Card title="Seeker Categories" subtitle="what they're looking for">
            <HBar data={categoryData} keyField="category" />
          </Card>
        )}

        {messageTypeData.length > 0 && (
          <Card title="Message Sender Types" subtitle="who is reaching out">
            <HBar data={messageTypeData} keyField="type" />
          </Card>
        )}
      </div>

      {/* ── Application Specializations ── */}
      {specializationData.length > 0 && (
        <>
          <SubSection title="Application Specializations" />
          <div className="overview-chart-card">
            <div className="overview-chart-header">
              <h3 className="overview-chart-title">Applicant Specializations</h3>
              <span className="overview-chart-subtitle">what applicants specialize in</span>
            </div>
            <HBar
              data={specializationData}
              keyField="spec"
              height={Math.max(240, specializationData.length * 38)}
            />
          </div>
        </>
      )}
    </div>
  );
}
