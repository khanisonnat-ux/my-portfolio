// A tiny gray-gradient SVG, base64-encoded, used as the blur placeholder for
// remote images. next/image can only auto-generate blurDataURL for statically
// imported images, so for Supabase/remote URLs we supply this shared one.
// It's a plain string literal, so it works in both server and client bundles.
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxNicgaGVpZ2h0PScxMCc+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSdnJyB4MT0nMCcgeTE9JzAnIHgyPScxJyB5Mj0nMSc+PHN0b3Agb2Zmc2V0PScwJScgc3RvcC1jb2xvcj0nI2YzZjRmNicvPjxzdG9wIG9mZnNldD0nMTAwJScgc3RvcC1jb2xvcj0nI2U1ZTdlYicvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPScxNicgaGVpZ2h0PScxMCcgZmlsbD0ndXJsKCNnKScvPjwvc3ZnPg==";
