// Shared Storage constants + helpers (safe to import on client or server —
// this file has no secrets and no Supabase client instance).

export const BUCKET = "portfolio-assets";

// Turn a public Storage URL back into the object path inside the bucket, e.g.
//   https://ref.supabase.co/storage/v1/object/public/portfolio-assets/projects/abc.jpg
//   →  projects/abc.jpg
// Returns null if the URL isn't a public object in this bucket (e.g. an
// external/seed URL like picsum.photos), so callers can safely skip removal.
export function storagePathFromPublicUrl(url) {
  if (!url) return null;
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
}
