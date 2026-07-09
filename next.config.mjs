/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Allow next/image to load thumbnails from Supabase Storage public buckets.
    // The wildcard covers any Supabase project ref (e.g. abcd1234.supabase.co).
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        // Demo images used by the seed script. Safe to remove once you've
        // replaced the sample projects with your own uploads.
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
};

export default nextConfig;
