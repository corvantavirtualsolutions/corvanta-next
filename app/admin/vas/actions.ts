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

export async function addVA(formData: FormData): Promise<{ error?: string }> {
  try {
    await assertAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const name = (formData.get("name") as string | null)?.trim() ?? "";
  const email = (formData.get("email") as string | null)?.trim() ?? "";
  const niche = (formData.get("niche") as string | null)?.trim() ?? "";

  if (!name) return { error: "Name is required." };
  if (!email) return { error: "Email is required." };
  if (!niche) return { error: "Niche is required." };

  const adminClient = createAdminClient();
  let profileImageUrl: string | null = null;

  // Upload profile picture to Supabase Storage
  const imageFile = formData.get("profile_image") as File | null;
  if (imageFile && imageFile.size > 0) {
    const ext = imageFile.name.split(".").pop() ?? "jpg";
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await adminClient.storage
      .from("va-profiles")
      .upload(path, buffer, { contentType: imageFile.type, upsert: false });

    if (uploadError) return { error: `Image upload failed: ${uploadError.message}` };

    const { data: urlData } = adminClient.storage
      .from("va-profiles")
      .getPublicUrl(uploadData.path);

    profileImageUrl = urlData.publicUrl;
  }

  const yearsRaw = formData.get("years_experience") as string | null;
  const clientsRaw = formData.get("past_clients") as string | null;
  const iqRaw = formData.get("iq") as string | null;

  const { error } = await adminClient.from("vas").insert({
    name,
    email,
    niche,
    bio: (formData.get("bio") as string | null)?.trim() || null,
    years_experience: yearsRaw ? Number(yearsRaw) : null,
    past_clients: clientsRaw ? Number(clientsRaw) : null,
    iq: iqRaw ? Number(iqRaw) : null,
    english_score: (formData.get("english_score") as string | null)?.trim() || null,
    portfolio_link: (formData.get("portfolio_link") as string | null)?.trim() || null,
    facebook_link: (formData.get("facebook_link") as string | null)?.trim() || null,
    linkedin_link: (formData.get("linkedin_link") as string | null)?.trim() || null,
    profile_image_url: profileImageUrl,
  });

  if (error) return { error: error.message };

  revalidatePath("/admin/vas");
  return {};
}

export async function deleteVA(id: string): Promise<{ error?: string }> {
  try {
    await assertAdmin();
  } catch (e) {
    return { error: (e as Error).message };
  }

  const adminClient = createAdminClient();

  // Clean up profile image from storage
  const { data: va } = await adminClient
    .from("vas")
    .select("profile_image_url")
    .eq("id", id)
    .single();

  if (va?.profile_image_url) {
    try {
      const url = new URL(va.profile_image_url);
      const parts = url.pathname.split("/va-profiles/");
      if (parts[1]) {
        await adminClient.storage.from("va-profiles").remove([parts[1]]);
      }
    } catch {
      // Non-fatal - continue with DB deletion
    }
  }

  const { error } = await adminClient.from("vas").delete().eq("id", id);
  if (error) return { error: error.message };

  revalidatePath("/admin/vas");
  return {};
}
