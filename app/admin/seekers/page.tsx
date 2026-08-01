import { createAdminClient } from "@/lib/supabase/admin";
import { DeleteSeekerButton } from "./DeleteSeekerButton";
import type { VaSeeker } from "./types";

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function AgreementDots({ s }: { s: VaSeeker }) {
  const dots = [
    { agreed: s.agreed_payment_terms, title: "Payment terms" },
    { agreed: s.agreed_accurate_info, title: "Accurate info" },
    { agreed: s.agreed_contact, title: "Contact consent" },
    { agreed: s.agreed_email_contract, title: "Email contract" },
  ];
  return (
    <div style={{ display: "flex", gap: 5, alignItems: "center" }}>
      {dots.map((d) => (
        <span
          key={d.title}
          title={d.title}
          style={{
            display: "inline-block",
            width: 10,
            height: 10,
            borderRadius: "50%",
            flexShrink: 0,
            background: d.agreed ? "var(--color-primary)" : "var(--color-border)",
          }}
        />
      ))}
    </div>
  );
}

function Truncate({ text, max = 120 }: { text: string | null; max?: number }) {
  if (!text) return <>-</>;
  return <>{text.length > max ? text.slice(0, max) + "..." : text}</>;
}

export default async function AdminSeekersPage() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("va_seekers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="admin-page-title">VA Seekers</h1>
        <p style={{ color: "var(--color-error)" }}>
          Failed to load VA seekers: {error.message}
        </p>
      </div>
    );
  }

  const seekers: VaSeeker[] = data ?? [];

  return (
    <div>
      <h1 className="admin-page-title">VA Seekers</h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: 24, fontSize: "0.9rem" }}>
        {seekers.length} submission{seekers.length !== 1 ? "s" : ""} - most recent first
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>Email</th>
              <th>VA Approached</th>
              <th>Match</th>
              <th>Category</th>
              <th>Hours</th>
              <th>Budget</th>
              <th>Project Details</th>
              <th>Notes</th>
              <th>Agreements</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {seekers.length === 0 ? (
              <tr>
                <td
                  colSpan={13}
                  style={{
                    textAlign: "center",
                    color: "var(--color-text-secondary)",
                    padding: 48,
                  }}
                >
                  No submissions yet.
                </td>
              </tr>
            ) : (
              seekers.map((s) => (
                <tr key={s.id}>
                  <td style={{ fontWeight: 600, whiteSpace: "nowrap" }}>{s.name}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{s.company}</td>
                  <td style={{ color: "var(--color-text-secondary)", whiteSpace: "nowrap" }}>
                    {s.email ?? "-"}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>
                    {s.va_name ? (
                      <>
                        <span style={{ fontWeight: 600 }}>{s.va_name}</span>
                        {s.va_niche && (
                          <span
                            style={{
                              display: "block",
                              fontSize: "0.78rem",
                              color: "var(--color-text-secondary)",
                            }}
                          >
                            {s.va_niche}
                          </span>
                        )}
                      </>
                    ) : (
                      s.va_niche ?? "-"
                    )}
                  </td>
                  <td style={{ whiteSpace: "nowrap", fontWeight: 600 }}>
                    {s.match_score !== null ? `${s.match_score}%` : "-"}
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{s.category ?? "-"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{s.hours ?? "-"}</td>
                  <td style={{ whiteSpace: "nowrap" }}>{s.budget ?? "-"}</td>
                  <td style={{ maxWidth: 200 }}>
                    <Truncate text={s.project_details} />
                  </td>
                  <td style={{ maxWidth: 180 }}>
                    <Truncate text={s.notes} max={80} />
                  </td>
                  <td>
                    <AgreementDots s={s} />
                  </td>
                  <td style={{ whiteSpace: "nowrap" }}>{formatDate(s.created_at)}</td>
                  <td>
                    <DeleteSeekerButton seekerId={s.id} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {seekers.length > 0 && (
        <p style={{ marginTop: 12, fontSize: "0.78rem", color: "var(--color-text-secondary)" }}>
          Agreements (left to right): payment terms / accurate info / contact consent / email contract
        </p>
      )}
    </div>
  );
}
