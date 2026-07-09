"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { BUCKET, storagePathFromPublicUrl } from "@/lib/supabase/storage";

// Sign the current admin out and return them to the login screen.
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// Delete a project row AND its thumbnail from Storage (no orphaned files).
// Runs on the server, so the user's session is validated here — the client
// can't delete anything it isn't authenticated to.
export async function deleteProject(id) {
  const supabase = await createClient();

  // Guard: never mutate without a verified user.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  // Look up the image URL first so we know which file to remove afterwards.
  const { data: project } = await supabase
    .from("projects")
    .select("image_url")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Best-effort Storage cleanup. A failure here shouldn't undo the row delete,
  // so we don't throw — the row is already gone, which is what the user asked.
  const path = storagePathFromPublicUrl(project?.image_url);
  if (path) {
    await supabase.storage.from(BUCKET).remove([path]);
  }

  // Refresh the affected pages so the UI reflects the deletion immediately.
  revalidatePath("/admin/list");
  revalidatePath("/portfolio");
}

// Remove a single Storage object by its public URL. Used by the edit form after
// a thumbnail has been replaced, to clean up the previous file.
export async function removeStorageImage(publicUrl) {
  const path = storagePathFromPublicUrl(publicUrl);
  if (!path) return; // external/seed image — nothing to remove

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  await supabase.storage.from(BUCKET).remove([path]);
}

// Persist a new display order. `orderedIds` is the full list of project ids in
// the order the admin arranged them; we write each id's index to sort_order.
export async function reorderProjects(orderedIds) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated.");

  // Small N (a portfolio), so per-row updates are fine and keep it simple.
  const results = await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("projects").update({ sort_order: index }).eq("id", id)
    )
  );

  const failed = results.find((r) => r.error);
  if (failed?.error) throw new Error(failed.error.message);

  revalidatePath("/admin/list");
  revalidatePath("/portfolio");
}
