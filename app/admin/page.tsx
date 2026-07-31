import { createAdminClient } from "@/lib/supabase/admin";
import { RoleToggle } from "./RoleToggle";

const SUPER_ADMIN = "corvantavirtualsolutions@gmail.com";

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "-";
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function getRole(email: string | undefined, userMeta: Record<string, unknown> | undefined): string {
  if (email === SUPER_ADMIN) return "super-admin";
  return (userMeta?.role as string) || "user";
}

export default async function AdminUsersPage() {
  const adminClient = createAdminClient();
  const {
    data: { users },
    error,
  } = await adminClient.auth.admin.listUsers({ perPage: 1000 });

  if (error) {
    return (
      <div>
        <h1 className="admin-page-title">Users</h1>
        <p style={{ color: "var(--color-error)" }}>
          Failed to load users: {error.message}
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="admin-page-title">Users</h1>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Last Sign-in</th>
              <th>Created</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const role = getRole(u.email, u.user_metadata as Record<string, unknown>);
              const isSuperAdmin = u.email === SUPER_ADMIN;

              return (
                <tr key={u.id}>
                  <td>
                    <span style={{ fontWeight: isSuperAdmin ? 700 : 400 }}>
                      {u.email ?? "-"}
                    </span>
                  </td>
                  <td>{formatDate(u.last_sign_in_at)}</td>
                  <td>{formatDate(u.created_at)}</td>
                  <td>
                    <span
                      className={`admin-role-badge admin-role-badge--${
                        role === "super-admin"
                          ? "superadmin"
                          : role === "admin"
                          ? "admin"
                          : "user"
                      }`}
                    >
                      {role === "super-admin" ? "Super Admin" : role === "admin" ? "Admin" : "User"}
                    </span>
                  </td>
                  <td>
                    <RoleToggle
                      userId={u.id}
                      currentRole={role}
                      isSuperAdmin={isSuperAdmin}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
