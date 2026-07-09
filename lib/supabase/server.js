import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Supabase client for Server Components, Server Actions, and Route Handlers.
// It reads the session from the request cookies so the server knows who the
// user is. On @supabase/ssr 0.12 the cookie API is getAll/setAll.
export async function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // `setAll` was called from a Server Component, where cookies are
            // read-only. Safe to ignore — the middleware refreshes the session
            // on every request, so tokens stay current.
          }
        },
      },
    }
  );
}
