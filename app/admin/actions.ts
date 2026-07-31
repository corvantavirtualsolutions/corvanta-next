"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SUPER_ADMIN = "corvantavirtualsolutions@gmail.com";

function callerIsAdmin(email: string | undefined, role: string | undefined): boolean {
  return email === SUPER_ADMIN || role === "admin";
}

export async function updateUserRole(userId: string, role: "admin" | "user") {
  // Verify the caller is an admin
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");
  if (!callerIsAdmin(user.email, user.user_metadata?.role)) {
    throw new Error("Not authorized");
  }

  // Prevent modifying the super-admin
  const adminClient = createAdminClient();
  const {
    data: { user: target },
  } = await adminClient.auth.admin.getUserById(userId);

  if (target?.email === SUPER_ADMIN) {
    throw new Error("The super-admin account cannot be modified");
  }

  await adminClient.auth.admin.updateUserById(userId, {
    user_metadata: { role },
  });

  revalidatePath("/admin");
}
