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
