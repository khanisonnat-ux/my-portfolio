// Client-side image compression using the Canvas API — no dependencies.
//
// Resizes an image down to fit within maxWidth/maxHeight (never upscales) and
// re-encodes it, usually to WebP for strong compression. Returns a new File
// ready to upload. On any failure it returns the ORIGINAL file, so a bad input
// can never block an upload.

function readAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function compressImage(file, options = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.8,
    mimeType = "image/webp",
  } = options;

  // Only process raster images (skip SVG/GIF — resizing them is lossy or breaks
  // animation).
  if (
    !file.type.startsWith("image/") ||
    file.type === "image/svg+xml" ||
    file.type === "image/gif"
  ) {
    return file;
  }

  try {
    const dataUrl = await readAsDataURL(file);
    const img = await loadImage(dataUrl);

    const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
    const width = Math.round(img.width * ratio);
    const height = Math.round(img.height * ratio);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0, width, height);

    const blob = await new Promise((resolve) =>
      canvas.toBlob(resolve, mimeType, quality)
    );

    // Fall back to the original if encoding failed or somehow got bigger.
    if (!blob || blob.size >= file.size) return file;

    const ext = mimeType === "image/webp" ? "webp" : "jpg";
    const baseName = file.name.replace(/\.[^.]+$/, "");
    return new File([blob], `${baseName}.${ext}`, { type: mimeType });
  } catch {
    return file;
  }
}
