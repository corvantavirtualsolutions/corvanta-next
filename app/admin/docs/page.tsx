import { createAdminClient } from "@/lib/supabase/admin";
import DocsClient from "./DocsClient";

export type CompanyDoc = {
  id: string;
  title: string;
  link: string;
  category: string;
  created_at: string;
};

export default async function AdminDocsPage() {
  const db = createAdminClient();
  const { data, error } = await db
    .from("company_docs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div>
        <h1 className="admin-page-title">Company Docs</h1>
        <p style={{ color: "var(--color-error)" }}>
          Failed to load documents: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Company Docs</h1>
      <DocsClient docs={data ?? []} />
    </div>
  );
}
