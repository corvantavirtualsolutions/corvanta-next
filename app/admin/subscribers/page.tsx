import { createAdminClient } from "@/lib/supabase/admin";
import SubscribersTable from "./SubscribersTable";

type Subscriber = {
  id: string;
  name: string | null;
  email: string;
  created_at: string;
};

export default async function AdminSubscribersPage() {
  const db = createAdminClient();
  const { data, error } = await db
    .from("subscribers")
    .select("id, name, email, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="admin-page-title">Subscribers</h1>
        <p style={{ color: "var(--color-error)" }}>
          Failed to load subscribers: {error.message}
        </p>
      </div>
    );
  }

  const subscribers: Subscriber[] = data ?? [];

  return (
    <div>
      <h1 className="admin-page-title">Subscribers</h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: 24,
          fontSize: "0.9rem",
        }}
      >
        {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""} -
        most recent first. These people clicked Subscribe on the Pricing page
        and are awaiting follow-up.
      </p>
      <SubscribersTable subscribers={subscribers} />
    </div>
  );
}
