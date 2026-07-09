"use client";

import { useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { useToast } from "@/app/components/Toast";
import { deleteProject } from "../actions";

// Client wrapper so we can confirm before firing the server action. The actual
// delete runs server-side (in actions.js), where the session is validated.
export default function DeleteButton({ id, title }) {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const handleDelete = () => {
    if (!confirm(`Delete “${title}”? This cannot be undone.`)) return;
    startTransition(async () => {
      try {
        await deleteProject(id);
        toast({ type: "success", message: `Deleted “${title}”` });
      } catch (err) {
        toast({ type: "error", message: err.message ?? "Delete failed." });
      }
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50 disabled:opacity-60 dark:border-red-900 dark:hover:bg-red-950"
    >
      {isPending ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Trash2 className="h-3.5 w-3.5" />
      )}
      <span className="hidden sm:inline">Delete</span>
    </button>
  );
}
