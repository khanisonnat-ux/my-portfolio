import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProjectTable from "./ProjectTable";
import { PlusCircle } from "lucide-react";

export const metadata = { title: "Admin — Projects" };

export default async function AdminListPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link
          href="/admin/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
        >
          <PlusCircle className="h-4 w-4" />
          New Project
        </Link>
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
          Failed to load: {error.message}
        </p>
      )}

      {!error && projects?.length === 0 && (
        <p className="rounded-lg border border-dashed border-gray-300 px-4 py-12 text-center text-gray-500 dark:border-gray-700">
          No projects yet. Click “New Project” to add your first one.
        </p>
      )}

      {projects?.length > 0 && <ProjectTable initialProjects={projects} />}
    </div>
  );
}
