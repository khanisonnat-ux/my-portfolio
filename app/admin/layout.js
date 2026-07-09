import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { signOut } from "./actions";
import { LayoutList, PlusCircle, LogOut, ExternalLink } from "lucide-react";

// Server-side guard for the whole /admin area. The middleware already blocks
// unauthenticated requests, but re-checking here is defense-in-depth: no admin
// page can ever render without a verified user.
export default async function AdminLayout({ children }) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <nav className="flex items-center gap-1">
            <Link
              href="/admin/list"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <LayoutList className="h-4 w-4" />
              Projects
            </Link>
            <Link
              href="/admin/new"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-800"
            >
              <PlusCircle className="h-4 w-4" />
              New
            </Link>
            <Link
              href="/portfolio"
              target="_blank"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 transition hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <ExternalLink className="h-4 w-4" />
              View site
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-gray-500 sm:inline">
              {user.email}
            </span>
            <form action={signOut}>
              <button
                type="submit"
                className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
