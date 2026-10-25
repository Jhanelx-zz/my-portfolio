import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import LoginForm from "./LoginForm";

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AdminLoginPage({
  searchParams,
}: LoginPageProps) {
  return (
    <Suspense fallback={<AdminLoginFallback />}>
      <AdminLoginContent searchParams={searchParams} />
    </Suspense>
  );
}

function AdminLoginFallback() {
  return (
    <section className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
      <section className="w-full rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#111916] sm:p-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          Private dashboard
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">
          Checking administrator access…
        </p>
      </section>
    </section>
  );
}

async function AdminLoginContent({
  searchParams,
}: LoginPageProps) {
  const config = getSupabasePublicConfig();
  const params = await searchParams;

  if (!config) {
    return (
      <section className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
        <section className="w-full rounded-2xl border border-amber-500/20 bg-white p-8 shadow-sm dark:bg-[#111916]">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
            Setup required
          </p>
          <h1 className="mt-3 text-2xl font-bold">Admin sign-in is not configured</h1>
          <p className="mt-3 text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">
            Configure the Supabase project URL and publishable key for this
            deployment, apply the CMS migrations, and authorize an administrator
            account.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex text-sm font-medium text-emerald-700 hover:underline dark:text-emerald-400"
          >
            Return to the portfolio
          </Link>
        </section>
      </section>
    );
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error && error.name !== "AuthSessionMissingError") {
    console.error("Unable to check the current administrator session.", error);
    throw new Error("Unable to check the current session. Please try again later.");
  }

  if (data.user) {
    const { data: admin, error: adminError } = await supabase
      .from("portfolio_admins")
      .select("user_id")
      .eq("user_id", data.user.id)
      .maybeSingle();

    if (adminError) {
      console.error("Unable to verify portfolio administrator access.", adminError);
      throw new Error("Administrator access could not be verified.");
    }

    if (admin) redirect("/admin");
  }

  return (
    <section className="mx-auto flex min-h-screen max-w-xl items-center px-6 py-16">
      <section className="w-full rounded-2xl border border-black/10 bg-white p-8 shadow-sm dark:border-white/10 dark:bg-[#111916] sm:p-10">
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-400">
          Private dashboard
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Admin sign in</h1>
        <p className="mt-3 text-sm leading-6 text-[#536159] dark:text-[#b2c0b7]">
          Sign in with the administrator account configured for this portfolio.
          Public registration is disabled.
        </p>
        {params.error === "not-authorized" && (
          <p
            role="alert"
            className="mt-5 rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-sm text-red-700 dark:text-red-300"
          >
            This account is not authorized to manage the portfolio.
          </p>
        )}
        <LoginForm />
      </section>
    </section>
  );
}
