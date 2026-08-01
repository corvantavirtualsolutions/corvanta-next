import { createAdminClient } from "@/lib/supabase/admin";
import SeekersTable from "./SeekersTable";
import type { VaSeeker } from "./types";

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
        {seekers.length} submission{seekers.length !== 1 ? "s" : ""} - most recent first.
        Click a row to view full details.
      </p>
      <SeekersTable seekers={seekers} />
    </div>
  );
}
