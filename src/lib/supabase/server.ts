import "server-only";

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { requireSupabasePublicConfig } from "./config";
import type { Database } from "./types";

export async function createSupabaseServerClient({
  allowCookieWrites = false,
}: { allowCookieWrites?: boolean } = {}) {
  const { url, publishableKey } = requireSupabasePublicConfig();
  const cookieStore = await cookies();

  return createServerClient<Database>(url, publishableKey, {
    cookieOptions: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch (error) {
          if (allowCookieWrites) throw error;
          // Server Components cannot write cookies; proxy.ts refreshes sessions.
        }
      },
    },
  });
}
