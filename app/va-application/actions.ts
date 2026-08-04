"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface ApplicationPayload {
  full_name: string;
  email: string;
  phone?: string;
  location?: string;
  years_experience?: string;
  specialization?: string;
  intro_video_url: string;
  skills_video_url: string;
  answer_video_url: string;
}

export async function saveApplication(
  payload: ApplicationPayload
): Promise<{ error?: string; id?: string }> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("va_applications")
    .insert(payload)
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: data.id };
}
