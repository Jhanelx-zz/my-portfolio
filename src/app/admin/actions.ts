"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export interface LoginState {
  error: string | null;
}

const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(128),
});

export async function loginAction(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const input = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!input.success) {
    return { error: "Enter a valid email address and password." };
  }

  try {
    if (!getSupabasePublicConfig()) {
      return { error: "Admin sign-in is not configured yet." };
    }
  } catch (error) {
    return {
      error:
        error instanceof Error
          ? error.message
          : "Admin sign-in configuration is invalid.",
    };
  }

  const supabase = await createSupabaseServerClient({ allowCookieWrites: true });
  const { data, error } = await supabase.auth.signInWithPassword(input.data);

  if (error) {
    if ((error.status ?? 0) >= 500 || error.name === "AuthRetryableFetchError") {
      console.error("Supabase authentication is unavailable.", error);
      return {
        error: "The authentication service is temporarily unavailable. Please try again.",
      };
    }
    return { error: "Sign-in failed. Check your credentials and try again." };
  }
  if (!data.user) {
    return { error: "Sign-in failed. Check your credentials and try again." };
  }

  const { data: admin, error: adminError } = await supabase
    .from("portfolio_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (adminError) {
    console.error("Unable to verify portfolio administrator access.", adminError);
    await supabase.auth.signOut();
    return {
      error:
        "Administrator access is not ready. Apply the database migration and authorize your account.",
    };
  }

  if (!admin) {
    await supabase.auth.signOut();
    return { error: "This account is not authorized to manage this portfolio." };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const config = getSupabasePublicConfig();
  if (!config) redirect("/admin/login");

  const supabase = await createSupabaseServerClient({ allowCookieWrites: true });
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Unable to end the administrator session.", error);
    throw new Error("Unable to sign out. Please try again.");
  }

  redirect("/admin/login");
}
