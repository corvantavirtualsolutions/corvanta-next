"use server";

import { createAdminClient } from "@/lib/supabase/admin";

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function submitContactMessage(
  formData: FormData
): Promise<{ error?: string; success?: boolean }> {
  const full_name = (formData.get("full_name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const i_am_a = (formData.get("i_am_a") as string | null)?.trim() ?? "";
  const message = (formData.get("message") as string | null)?.trim() ?? "";

  if (!full_name) return { error: "Full name is required." };
  if (!email) return { error: "Email address is required." };
  if (!isValidEmail(email)) return { error: "Please enter a valid email address." };
  if (!message) return { error: "Message is required." };

  const db = createAdminClient();
  const { error } = await db
    .from("messages")
    .insert({ full_name, email, i_am_a, message });

  if (error) return { error: "Failed to send your message. Please try again." };

  return { success: true };
}
