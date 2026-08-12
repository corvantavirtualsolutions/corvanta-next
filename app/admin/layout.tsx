import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import AdminHeader from "@/components/AdminHeader";
import { AdminSidebarNav } from "@/components/AdminSidebarNav";

const SUPER_ADMIN = "corvantavirtualsolutions@gmail.com";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const isAdmin =
    user.email === SUPER_ADMIN || user.user_metadata?.role === "admin";

  if (!isAdmin) redirect("/");

  // Fetch unread counts for sidebar badges — best-effort, default to 0 on error
  const db = createAdminClient();
  const [r1, r2, r3, r4] = await Promise.all([
    db.from("messages").select("*", { count: "exact", head: true }).is("opened_at", null),
    db.from("va_seekers").select("*", { count: "exact", head: true }).is("opened_at", null),
    db.from("va_applications").select("*", { count: "exact", head: true }).is("opened_at", null),
    db.from("reviews").select("*", { count: "exact", head: true }).is("opened_at", null),
  ]);

  const unreadCounts = {
    messages: r1.error ? 0 : (r1.count ?? 0),
    seekers: r2.error ? 0 : (r2.count ?? 0),
    applications: r3.error ? 0 : (r3.count ?? 0),
    reviews: r4.error ? 0 : (r4.count ?? 0),
  };

  return (
    <>
      <style>{`.navbar { display: none !important; }`}</style>
      <AdminHeader user={{ email: user.email ?? "" }} />
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <p className="admin-sidebar-title">Admin</p>
          <AdminSidebarNav unreadCounts={unreadCounts} />
        </aside>
        <div className="admin-content">{children}</div>
      </div>
    </>
  );
}
