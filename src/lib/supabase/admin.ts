import "server-only";

import { io } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./server";

export async function requirePortfolioAdmin() {
  await io();
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    console.error("Unable to verify the current administrator session.", error);
    throw new Error("Administrator authentication could not be verified.");
  }

  if (!data.user) {
    redirect("/admin/login");
  }

  const { data: admin, error: adminError } = await supabase
    .from("portfolio_admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();

  if (adminError) {
    console.error("Unable to verify portfolio administrator access.", adminError);
    throw new Error("Administrator access could not be verified.");
  }

  if (!admin) {
    redirect("/admin/login?error=not-authorized");
  }

  return { supabase, user: data.user };
}
