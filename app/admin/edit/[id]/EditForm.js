"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BUCKET } from "@/lib/supabase/storage";
import { compressImage } from "@/lib/imageCompression";
import Image from "next/image";
import { BLUR_DATA_URL } from "@/lib/blur";
import { useToast } from "@/app/components/Toast";
import { removeStorageImage } from "../../actions";
import { Save, Loader2 } from "lucide-react";

export default function EditForm({ project }) {
  const router = useRouter();
  const supabase = createClient();

  const [form, setForm] = useState({
    title: project.title ?? "",
    description: project.description ?? "",
    category: project.category ?? "",
    video_url: project.video_url ?? "",
    is_featured: project.is_featured ?? false,
  });
  const { toast } = useToast();
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Keep the current image unless the user picked a new one.
      const oldImageUrl = project.image_url;
      let imageUrl = oldImageUrl;

      if (imageFile) {
        const upload = await compressImage(imageFile);
        const ext = upload.name.split(".").pop();
        const filePath = `projects/${crypto.randomUUID()}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from(BUCKET)
          .upload(filePath, upload, {
            cacheControl: "3600",
            upsert: false,
            contentType: upload.type,
          });
        if (uploadError) throw uploadError;

        const {
          data: { publicUrl },
        } = supabase.storage.from(BUCKET).getPublicUrl(filePath);
        imageUrl = publicUrl;
      }

      const { error: updateError } = await supabase
        .from("projects")
        .update({
          title: form.title,
          description: form.description,
          category: form.category,
          video_url: form.video_url || null,
          is_featured: form.is_featured,
          image_url: imageUrl,
        })
        .eq("id", project.id);
      if (updateError) throw updateError;

      // Thumbnail was replaced → delete the previous file so it doesn't orphan.
      // Best-effort: the row is already saved, so ignore cleanup failures.
      if (imageFile && oldImageUrl && oldImageUrl !== imageUrl) {
        try {
          await removeStorageImage(oldImageUrl);
        } catch {
          /* non-fatal — old image just lingers */
        }
      }

      toast({ type: "success", message: "Changes saved" });
      router.push("/admin/list");
      router.refresh();
    } catch (err) {
      toast({ type: "error", message: err.message ?? "Something went wrong." });
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-8 text-3xl font-bold">Edit Project</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" required>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className={inputClass}
          />
        </Field>

        <Field label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
          />
        </Field>

        <Field label="Category">
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Video URL (optional)">
          <input
            name="video_url"
            type="url"
            value={form.video_url}
            onChange={handleChange}
            className={inputClass}
          />
        </Field>

        <Field label="Thumbnail">
          {project.image_url && (
            <div className="relative mb-3 aspect-[16/10] w-full max-w-xs overflow-hidden rounded-lg border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
              <Image
                src={project.image_url}
                alt={project.title}
                fill
                sizes="320px"
                placeholder="blur"
                blurDataURL={BLUR_DATA_URL}
                className="object-cover"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-500 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-indigo-700"
          />
          <p className="mt-1 text-xs text-gray-400">
            Leave empty to keep the current image.
          </p>
        </Field>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            name="is_featured"
            checked={form.is_featured}
            onChange={handleChange}
            className="h-4 w-4 rounded"
          />
          Mark as featured
        </label>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 dark:border-gray-700 dark:bg-gray-900";

function Field({ label, required, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
    </div>
  );
}
