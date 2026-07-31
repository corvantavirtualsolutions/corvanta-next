import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminHeader from "@/components/AdminHeader";

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

  return (
    <>
      <style>{`.navbar { display: none !important; }`}</style>
      <AdminHeader user={{ email: user.email ?? "" }} />
      <div className="admin-layout">
        <aside className="admin-sidebar">
          <p className="admin-sidebar-title">Admin</p>
          <a href="/admin" className="admin-nav-link active">
            Users
          </a>
        </aside>
        <div className="admin-content">{children}</div>
      </div>
    </>
  );
}
