import { createAdminClient } from "@/lib/supabase/admin";
import { RoleToggle } from "./RoleToggle";
import { DeleteUserButton } from "./DeleteUserButton";

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

function metaStr(meta: Record<string, unknown> | undefined, key: string): string {
  const val = meta?.[key];
  return typeof val === "string" && val.trim() ? val : "-";
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
              <th>Full Name</th>
              <th>Email</th>
              <th>Position / Role</th>
              <th>Company</th>
              <th>Last Sign-in</th>
              <th>Created</th>
              <th>Account Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => {
              const meta = u.user_metadata as Record<string, unknown> | undefined;
              const role = getRole(u.email, meta);
              const isSuperAdmin = u.email === SUPER_ADMIN;

              return (
                <tr key={u.id}>
                  <td style={{ fontWeight: isSuperAdmin ? 700 : 400 }}>
                    {metaStr(meta, "full_name")}
                  </td>
                  <td>{u.email ?? "-"}</td>
                  <td>{metaStr(meta, "position")}</td>
                  <td>{metaStr(meta, "company")}</td>
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
                    <div className="admin-actions">
                      <RoleToggle
                        userId={u.id}
                        currentRole={role}
                        isSuperAdmin={isSuperAdmin}
                      />
                      <DeleteUserButton
                        userId={u.id}
                        isSuperAdmin={isSuperAdmin}
                      />
                    </div>
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
