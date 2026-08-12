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

// Called client-side when admin opens a message — no sensitive data, no assertAdmin needed
export async function markMessageOpened(id: string): Promise<void> {
  const db = createAdminClient();
  await db
    .from("messages")
    .update({ opened_at: new Date().toISOString() })
    .eq("id", id)
    .is("opened_at", null);
}

export async function deleteMessage(id: string): Promise<{ error?: string }> {
  try {
    await assertAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }
  const db = createAdminClient();
  const { error } = await db.from("messages").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return {};
}

export async function updateMessageStatus(
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
    .from("messages")
    .update({ status })
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/admin/messages");
  return {};
}
