"use server";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type AuthState = { error: string } | null;

function friendlyError(message: string): string {
  if (message.includes("Invalid login credentials")) return "Incorrect email or password.";
  if (message.includes("Email not confirmed")) return "Please confirm your email before logging in.";
  if (message.includes("User already registered")) return "An account with this email already exists. Try logging in.";
  if (message.includes("Password should be at least")) return "Password must be at least 6 characters.";
  if (message.includes("Unable to validate email address")) return "Please enter a valid email address.";
  return message;
}

export async function login(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const rememberMe = formData.get("remember_me") === "on";

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            // Without "remember me", strip maxAge/expires so cookies
            // become session-only (cleared when the browser closes)
            const opts = rememberMe
              ? options
              : { ...options, maxAge: undefined, expires: undefined };
            cookieStore.set(name, value, opts);
          });
        },
      },
    }
  );

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) return { error: friendlyError(error.message) };

  redirect("/");
}

export async function signup(prevState: AuthState, formData: FormData): Promise<AuthState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const fullName = (formData.get("full_name") as string | null) ?? "";
  const position = (formData.get("position") as string | null) ?? "";
  const company = (formData.get("company") as string | null) ?? "";

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, position, company },
    },
  });

  if (error) return { error: friendlyError(error.message) };

  // If a session was returned, the user is logged in immediately
  if (data.session) {
    redirect("/");
  }

  // Email confirmation is required
  redirect("/?signup=confirm");
}

export async function logout() {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  await supabase.auth.signOut();
  redirect("/");
}
