"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SUPER_ADMIN = "corvantavirtualsolutions@gmail.com";

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  const isAdmin =
    user.email === SUPER_ADMIN || user.user_metadata?.role === "admin";
  if (!isAdmin) throw new Error("Not authorized");
}

export async function deleteApplication(
  id: string
): Promise<{ error?: string }> {
  try {
    await assertAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }
  const db = createAdminClient();
  const { error } = await db.from("va_applications").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/applications");
  return {};
}

export async function updateApplicationStatus(
  id: string,
  status: string
): Promise<{ error?: string }> {
  try {
    await assertAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }
  const db = createAdminClient();
  const { error } = await db
    .from("va_applications")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/applications");
  return {};
}
