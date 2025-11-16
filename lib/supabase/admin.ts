import { createClient } from "@supabase/supabase-js";

// DO NOT expose this key to the client-side!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!serviceRoleKey) {
  throw new Error(
    "SUPABASE_SERVICE_ROLE_KEY is not set in environment variables. This is required for admin-level server-side operations."
  );
}

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set.");
}

/**
 * This is an ADMIN client and should ONLY be used in server-side
 * code (API routes, Server Actions) where you need to bypass RLS.
 */
export const createAdminClient = () => {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        // We are using the service_role key, so we can disable auto-refresh
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
};