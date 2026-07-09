import { createClient } from "@/lib/supabase/server";
import ProjectGrid from "./ProjectGrid";

// Reads cookies (via the server client), so this route renders dynamically.
export const metadata = {
  title: "Portfolio",
  description: "Selected work and projects.",
};

export default async function PortfolioPage() {
  const supabase = await createClient();

  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    // Respect the admin's manual drag-and-drop order; un-ordered rows (null
    // sort_order, e.g. seed data) fall to the end, newest first.
    .order("sort_order", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-24 text-center">
        <p className="text-red-500">
          Failed to load projects. Please try again later.
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          My Portfolio
        </h1>
        <p className="mt-3 text-lg text-gray-500">
          A collection of things I&apos;ve built.
        </p>
      </header>

      {projects?.length ? (
        <ProjectGrid projects={projects} />
      ) : (
        <p className="text-center text-gray-500">
          No projects yet — check back soon.
        </p>
      )}
    </main>
  );
}
