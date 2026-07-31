"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SUPER_ADMIN = "corvantavirtualsolutions@gmail.com";

function callerIsAdmin(email: string | undefined, role: string | undefined): boolean {
  return email === SUPER_ADMIN || role === "admin";
}

export async function deleteReview(reviewId: string): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };
  if (!callerIsAdmin(user.email, user.user_metadata?.role)) {
    return { error: "Not authorized" };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("reviews").delete().eq("id", reviewId);
  if (error) return { error: error.message };

  revalidatePath("/admin/reviews");
  return null;
}

export async function deleteUser(userId: string): Promise<{ error: string } | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Not authenticated" };
  if (!callerIsAdmin(user.email, user.user_metadata?.role)) {
    return { error: "Not authorized" };
  }

  const adminClient = createAdminClient();

  // Block deletion of the super-admin account
  const {
    data: { user: target },
  } = await adminClient.auth.admin.getUserById(userId);

  if (target?.email === SUPER_ADMIN) {
    return { error: "The super-admin account cannot be deleted" };
  }

  const { error } = await adminClient.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };

  revalidatePath("/admin");
  return null;
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
