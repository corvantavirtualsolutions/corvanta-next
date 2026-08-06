"use server";

import { createAdminClient } from "@/lib/supabase/admin";

export interface ApplicationPayload {
  full_name: string;
  email: string;
  phone: string;
  location: string;
  profile_photo_url: string;
  specialization: string;
  years_experience: string;
  past_clients: string;
  english_proficiency: string;
  skills: string;
  bio: string;
  portfolio_link: string;
  linkedin_link: string;
  facebook_link: string;
  intro_video_url: string;
  skills_video_url: string;
  answer_video_url: string;
  english_mc_score?: number;
  english_writing_1?: string;
  english_writing_2?: string;
  english_writing_3?: string;
  iq_score?: number;
}

export async function saveApplication(
  payload: ApplicationPayload
): Promise<{ error?: string; id?: string }> {
  const db = createAdminClient();
  const { data, error } = await db
    .from("va_applications")
    .insert({ ...payload, status: "pending" })
    .select("id")
    .single();

  if (error) return { error: error.message };
  return { id: data.id };
}
