import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import EditForm from "./EditForm";

export const metadata = { title: "Edit Project" };

export default async function EditProjectPage({ params }) {
  const supabase = await createClient();

  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !project) notFound();

  return <EditForm project={project} />;
}
