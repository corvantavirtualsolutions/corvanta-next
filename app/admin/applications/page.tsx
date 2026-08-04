import { createAdminClient } from "@/lib/supabase/admin";
import ApplicationsTable from "./ApplicationsTable";

export type VAApplication = {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
  location: string | null;
  years_experience: string | null;
  specialization: string | null;
  intro_video_url: string | null;
  skills_video_url: string | null;
  answer_video_url: string | null;
  status: string;
  created_at: string;
};

export default async function AdminApplicationsPage() {
  const db = createAdminClient();
  const { data, error } = await db
    .from("va_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="admin-page-title">VA Applications</h1>
        <p style={{ color: "var(--color-error)" }}>
          Failed to load applications: {error.message}
        </p>
      </div>
    );
  }

  const applications: VAApplication[] = data ?? [];

  return (
    <div>
      <h1 className="admin-page-title">VA Applications</h1>
      <p
        style={{
          color: "var(--color-text-secondary)",
          marginBottom: 24,
          fontSize: "0.9rem",
        }}
      >
        {applications.length} application{applications.length !== 1 ? "s" : ""}{" "}
        - most recent first. Click a row to view videos and full details.
      </p>
      <ApplicationsTable applications={applications} />
    </div>
  );
}
