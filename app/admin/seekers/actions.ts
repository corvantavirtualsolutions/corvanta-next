"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const SUPER_ADMIN = "corvantavirtualsolutions@gmail.com";

function callerIsAdmin(email: string | undefined, role: string | undefined): boolean {
  return email === SUPER_ADMIN || role === "admin";
}

async function assertAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");
  if (!callerIsAdmin(user.email, user.user_metadata?.role))
    throw new Error("Not authorized");
}

export async function deleteSeeker(id: string): Promise<{ error?: string }> {
  try {
    await assertAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("va_seekers").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/seekers");
  return {};
}

export async function toggleEmailed(id: string, emailed: boolean): Promise<{ error?: string }> {
  try {
    await assertAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient
    .from("va_seekers")
    .update({ emailed })
    .eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/seekers");
  return {};
}
