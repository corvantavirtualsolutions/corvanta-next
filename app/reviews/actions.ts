"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type ReviewInput = {
  rating: number;
  feedback: string;
  user_name: string;
  company: string;
};

export async function submitReview(input: ReviewInput): Promise<{ error?: string }> {
  if (!input.rating || input.rating < 1 || input.rating > 5) {
    return { error: "Please select a star rating." };
  }
  if (!input.feedback.trim()) {
    return { error: "Please write some feedback." };
  }
  if (!input.user_name.trim()) {
    return { error: "Please enter your name." };
  }

  // Attach user_id if logged in
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("reviews").insert({
    rating: input.rating,
    feedback: input.feedback.trim(),
    user_name: input.user_name.trim(),
    company: input.company.trim() || null,
    user_id: user?.id ?? null,
  });

  if (error) return { error: error.message };
  return {};
}
