import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Runs on every matched request. Two jobs:
//   1. Refresh the Supabase auth session (rotates tokens, keeps cookies fresh).
//   2. Guard the /admin area — unauthenticated users are bounced to /login.
export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // IMPORTANT: getUser() must run immediately after client creation, with no
  // code in between. It validates the token with the Supabase Auth server —
  // do not trust getSession() in server code, it isn't revalidated.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  // Not logged in + trying to reach /admin → send to /login (remember target).
  if (!user && pathname.startsWith("/admin")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirectedFrom", pathname);
    const redirectResponse = NextResponse.redirect(url);
    // Preserve any refreshed auth cookies on the redirect response.
    supabaseResponse.cookies.getAll().forEach((cookie) =>
      redirectResponse.cookies.set(cookie)
    );
    return redirectResponse;
  }

  // Already logged in but sitting on /login → skip straight to the dashboard.
  if (user && pathname === "/login") {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/list";
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) =>
      redirectResponse.cookies.set(cookie)
    );
    return redirectResponse;
  }

  return supabaseResponse;
}
