import { createAdminClient } from "@/lib/supabase/admin";
import VAGrid from "./VAGrid";
import type { VA } from "./types";

export default async function AdminVAsPage() {
  const adminClient = createAdminClient();
  const { data, error } = await adminClient
    .from("vas")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="admin-page-title">Our VAs</h1>
        <p style={{ color: "var(--color-error)" }}>
          Failed to load VAs: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Our VAs</h1>
      <VAGrid initialVAs={(data ?? []) as VA[]} />
    </div>
  );
}
