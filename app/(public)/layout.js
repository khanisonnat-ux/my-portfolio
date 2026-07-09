import SiteHeader from "@/app/components/SiteHeader";

// Shared chrome for all public pages (currently /portfolio). The (public)
// folder is a route group — the parentheses mean it does NOT appear in the URL,
// it just scopes this header/footer to public pages and keeps it out of /admin.
export default function PublicLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex-1">{children}</div>
      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-gray-800">
        © {new Date().getFullYear()} · Built with Next.js &amp; Supabase
      </footer>
    </div>
  );
}
