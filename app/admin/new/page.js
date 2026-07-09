"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { BUCKET } from "@/lib/supabase/storage";
import { compressImage } from "@/lib/imageCompression";
import { useToast } from "@/app/components/Toast";
import { UploadCloud, Loader2, Sparkles } from "lucide-react";

const initialForm = {
  title: "",
  description: "",
  category: "",
  video_url: "",
  is_featured: false,
};

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function NewProjectPage() {
  const router = useRouter();
  const supabase = createClient();
  const { toast } = useToast();

  const [form, setForm] = useState(initialForm);
  const [imageFile, setImageFile] = useState(null); // already-compressed File
  const [compressing, setCompressing] = useState(false);
  const [info, setInfo] = useState(null); // { originalSize, newSize }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Compress as soon as a file is chosen, so the savings show right away and we
  // don't repeat the work at submit time.
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setInfo(null);
      return;
    }
    setInfo(null);
    setCompressing(true);

    const compressed = await compressImage(file);
    setImageFile(compressed);
    setInfo({ originalSize: file.size, newSize: compressed.size });
    setCompressing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!imageFile) {
      toast({ type: "error", message: "Please select an image." });
      return;
    }

    setLoading(true);
    try {
      // imageFile is already compressed. Upload with a collision-safe filename.
      const ext = imageFile.name.split(".").pop();
      const filePath = `projects/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(filePath, imageFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: imageFile.type,
        });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from(BUCKET).getPublicUrl(filePath);

      const { error: insertError } = await supabase.from("projects").insert({
        title: form.title,
        description: form.description,
        category: form.category,
        video_url: form.video_url || null,
        image_url: publicUrl,
        is_featured: form.is_featured,
      });
      if (insertError) throw insertError;

      toast({ type: "success", message: `“${form.title}” added` });
      router.push("/admin/list");
      router.refresh();
    } catch (err) {
      toast({ type: "error", message: err.message ?? "Something went wrong." });
      setLoading(false);
    }
  };

  const savedPct =
    info && info.originalSize > 0
      ? Math.round((1 - info.newSize / info.originalSize) * 100)
      : 0;

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="mb-8 text-3xl font-bold">Add New Project</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Title" required>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            required
            className={inputClass}
            placeholder="My awesome project"
          />
        </Field>

        <Field label="Description">
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={4}
            className={inputClass}
            placeholder="What is it about?"
          />
        </Field>

        <Field label="Category">
          <input
            name="category"
            value={form.category}
            onChange={handleChange}
            className={inputClass}
            placeholder="Web, Game, Design…"
          />
        </Field>

        <Field label="Video URL (optional)">
          <input
            name="video_url"
            type="url"
            value={form.video_url}
            onChange={handleChange}
            className={inputClass}
            placeholder="https://youtube.com/…"
          />
        </Field>

        <Field label="Thumbnail Image" required>
          <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-dashed border-gray-300 px-4 py-3 text-sm text-gray-600 transition hover:border-indigo-400 dark:border-gray-700 dark:text-gray-300">
            <UploadCloud className="h-5 w-5" />
            <span>{imageFile ? imageFile.name : "Choose an image…"}</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>

          {/* Compression indicator */}
          {compressing && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Optimizing image…
            </p>
          )}
          {info && !compressing && (
            <div className="mt-2 flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs dark:bg-indigo-950/40">
              <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
              {savedPct > 0 ? (
                <span className="text-indigo-700 dark:text-indigo-300">
                  Optimized: {formatBytes(info.originalSize)} →{" "}
                  <strong>{formatBytes(info.newSize)}</strong> · {savedPct}%
                  smaller
                </span>
              ) : (
                <span className="text-gray-500">
                  Already optimized ({formatBytes(info.newSize)}) — no change
                  needed.
                </span>
              )}
            </div>
          )}
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
          disabled={loading || compressing}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:opacity-60"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </>
          ) : (
            "Add Project"
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
