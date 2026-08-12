"use server";

import { createAdminClient } from "@/lib/supabase/admin";

// Marks all unread reviews as opened when the admin visits the reviews page
export async function markAllReviewsRead(): Promise<void> {
  const db = createAdminClient();
  await db
    .from("reviews")
    .update({ opened_at: new Date().toISOString() })
    .is("opened_at", null);
}
