import { redirect } from "next/navigation";
import { Suspense } from "react";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import AdminNavigation from "../AdminNavigation";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const config = getSupabasePublicConfig();
  if (!config) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#f4f7f5] dark:bg-[#0b100e]">
      <AdminNavigation />
      <main className="mx-auto min-w-0 max-w-7xl px-5 py-8 sm:px-8 md:ml-64">
        <Suspense fallback={<p className="text-sm text-[#536159]">Loading admin content…</p>}>
          {children}
        </Suspense>
      </main>
    </div>
  );
}
