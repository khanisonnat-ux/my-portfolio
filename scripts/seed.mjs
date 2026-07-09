// Seed the `projects` table with sample data so the grid isn't empty.
//
// Run with:  npm run seed
// (which passes --env-file=.env.local, so process.env is populated)
//
// Uses the SERVICE ROLE key to bypass Row Level Security — this is a local,
// server-side admin script and the key must never reach the browser.

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || url.includes("YOUR_PROJECT_REF") || !serviceKey || serviceKey === "your-service-role-key") {
  console.error(
    "\n✗ Missing Supabase credentials.\n" +
      "  Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local\n" +
      "  (Dashboard → Settings → API → 'service_role' secret).\n"
  );
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Stable demo thumbnails from picsum (the ?seed keeps each image consistent).
const img = (seed) => `https://picsum.photos/seed/${seed}/800/500`;

const projects = [
  {
    title: "Neon Runner — Trailer",
    description:
      "Launch trailer for a synthwave endless-runner. Edited in DaVinci Resolve with a custom sound design pass.",
    category: "Video",
    image_url: img("neonrunner"),
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    is_featured: true,
  },
  {
    title: "Aurora Brand Identity",
    description:
      "Full visual identity for a skincare startup: logo system, color palette, and packaging mockups.",
    category: "Graphic",
    image_url: img("aurora"),
    video_url: null,
    is_featured: true,
  },
  {
    title: "Taskflow — SaaS Dashboard",
    description:
      "Responsive project-management dashboard built with Next.js, Tailwind, and Supabase realtime.",
    category: "Web",
    image_url: img("taskflow"),
    video_url: null,
    is_featured: false,
  },
  {
    title: "Street Food Doc — Short",
    description:
      "A 3-minute mini-documentary following a night-market vendor. Shot handheld, color graded for warmth.",
    category: "Video",
    image_url: img("streetfood"),
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    is_featured: false,
  },
  {
    title: "Festival Poster Series",
    description:
      "A set of three gig posters exploring bold type and risograph-inspired textures.",
    category: "Graphic",
    image_url: img("poster"),
    video_url: null,
    is_featured: false,
  },
  {
    title: "Portfolio CMS",
    description:
      "The very site you're looking at — a headless portfolio with a secure admin dashboard.",
    category: "Web",
    image_url: img("cms"),
    video_url: null,
    is_featured: false,
  },
];

async function main() {
  console.log(`Seeding ${projects.length} projects…`);
  const { data, error } = await supabase
    .from("projects")
    .insert(projects.map((p, i) => ({ ...p, sort_order: i })))
    .select();

  if (error) {
    console.error("\n✗ Seed failed:", error.message, "\n");
    process.exit(1);
  }

  console.log(`✓ Inserted ${data.length} projects. Open /portfolio to see them.\n`);
}

main();
