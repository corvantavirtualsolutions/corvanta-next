"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { Resend } from "resend";

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

  // Fetch the storage URLs before deleting the row
  const { data: app } = await db
    .from("va_applications")
    .select("profile_photo_url, intro_video_url, skills_video_url, answer_video_url")
    .eq("id", id)
    .single();

  // Delete the DB row
  const { error } = await db.from("va_applications").delete().eq("id", id);
  if (error) return { error: error.message };

  // Remove storage files (best-effort — don't fail the delete if this errors)
  if (app) {
    const BUCKET = "va-videos";
    const storagePaths = [
      app.profile_photo_url,
      app.intro_video_url,
      app.skills_video_url,
      app.answer_video_url,
    ]
      .filter(Boolean)
      .map((url) => {
        // URLs look like: https://<project>.supabase.co/storage/v1/object/public/va-videos/<path>
        const marker = `/object/public/${BUCKET}/`;
        const idx = url!.indexOf(marker);
        return idx !== -1 ? decodeURIComponent(url!.slice(idx + marker.length)) : null;
      })
      .filter(Boolean) as string[];

    if (storagePaths.length > 0) {
      await db.storage.from(BUCKET).remove(storagePaths);
    }
  }

  revalidatePath("/admin/applications");
  return {};
}

// Called client-side when admin opens a detail modal — no sensitive data, no assertAdmin needed
export async function markApplicationOpened(id: string): Promise<void> {
  const db = createAdminClient();
  await db
    .from("va_applications")
    .update({ opened_at: new Date().toISOString() })
    .eq("id", id)
    .is("opened_at", null);
}

export async function toggleApplicationEmailed(
  id: string,
  emailed: boolean
): Promise<{ error?: string }> {
  try {
    await assertAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const db = createAdminClient();

  // Fetch applicant details for the email
  const { data: app } = await db
    .from("va_applications")
    .select("email, full_name")
    .eq("id", id)
    .single();

  const { error } = await db
    .from("va_applications")
    .update({ emailed })
    .eq("id", id);
  if (error) return { error: error.message };

  // Send email only when toggling TO emailed (not when toggling back off)
  if (emailed && app?.email) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: "Corvanta Virtual Solutions <admin@corvantavirtualsolutions.net>",
      to: app.email,
      subject: "Your Corvanta VA Application Has Been Reviewed",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
          <h2 style="color: #2eb87c;">Corvanta Virtual Solutions</h2>
          <p>Hi ${app.full_name},</p>
          <p>Thank you for applying to join the Corvanta Virtual Solutions team. We have reviewed your application and wanted to follow up with you.</p>
          <p>Please watch the following video for important next steps regarding your application:</p>
          <p style="margin: 24px 0;">
            <a href="https://www.youtube.com/watch?v=DDWKuo3gXMQ&list=RDIRyMoHJu-i8&index=27"
               style="background: #2eb87c; color: #fff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: 600;">
              Watch Video
            </a>
          </p>
          <p>If you have any questions, feel free to reply to this email.</p>
          <p>Best regards,<br/>The Corvanta Virtual Solutions Team</p>
        </div>
      `,
    });
  }

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
