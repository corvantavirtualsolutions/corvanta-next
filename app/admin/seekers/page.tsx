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

function AgreementDot({ agreed }: { agreed: boolean }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: agreed ? "var(--color-primary)" : "var(--color-border)",
        flexShrink: 0,
      }}
      title={agreed ? "Agreed" : "Not agreed"}
    />
  );
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
        {seekers.length} submission{seekers.length !== 1 ? "s" : ""} — most recent first
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Company</th>
              <th>VA / Niche</th>
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
                  colSpan={7}
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
                  <td style={{ fontWeight: 600 }}>{s.name}</td>
                  <td>{s.company}</td>
                  <td>{s.va_niche ?? "-"}</td>
                  <td style={{ maxWidth: 220, color: "var(--color-text-secondary)" }}>
                    {s.notes ?? "-"}
                  </td>
                  <td>
                    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <AgreementDot agreed={s.agreed_payment_terms} />
                      <AgreementDot agreed={s.agreed_accurate_info} />
                      <AgreementDot agreed={s.agreed_contact} />
                    </div>
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
          Agreements: payment terms / accurate info / contact consent
        </p>
      )}
    </div>
  );
}
