"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function saveSubscriber(
  name: string,
  email: string
): Promise<{ error?: string }> {
  const db = createAdminClient();
  const { error } = await db
    .from("subscribers")
    .insert({ name: name.trim() || null, email: email.trim().toLowerCase() });
  if (error) return { error: error.message };
  return {};
}
