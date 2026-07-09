"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { Star, PlayCircle } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/blur";

// Preferred tab order; anything else falls to the end alphabetically.
const CATEGORY_ORDER = ["Video", "Graphic", "Web"];

export default function ProjectGrid({ projects }) {
  // Build the tab list from whatever categories actually exist in the data.
  const categories = useMemo(() => {
    const unique = [...new Set(projects.map((p) => p.category).filter(Boolean))];
    unique.sort((a, b) => {
      const ia = CATEGORY_ORDER.indexOf(a);
      const ib = CATEGORY_ORDER.indexOf(b);
      return (ia === -1 ? 99 : ia) - (ib === -1 ? 99 : ib) || a.localeCompare(b);
    });
    return ["All", ...unique];
  }, [projects]);

  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.category === active);

  return (
    <div>
      {/* Filter tabs */}
      <div className="mb-10 flex flex-wrap justify-center gap-2">
        {categories.map((cat) => {
          const isActive = active === cat;
          return (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "text-white"
                  : "text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-pill"
                  className="absolute inset-0 rounded-full bg-indigo-600"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <motion.div
        layout
        className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <AnimatePresence mode="popLayout">
          {filtered.map((project) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              whileHover={{ scale: 1.03 }}
              className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900"
            >
              {/* Thumbnail */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {project.image_url && (
                  <Image
                    src={project.image_url}
                    alt={project.title}
                    fill
                    loading="lazy"
                    placeholder="blur"
                    blurDataURL={BLUR_DATA_URL}
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                )}

                {project.is_featured && (
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-amber-500/90 px-2.5 py-1 text-xs font-medium text-white backdrop-blur">
                    <Star className="h-3.5 w-3.5 fill-current" />
                    Featured
                  </span>
                )}

                {project.video_url && (
                  <a
                    href={project.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white backdrop-blur transition hover:bg-black/80"
                  >
                    <PlayCircle className="h-4 w-4" />
                    Watch
                  </a>
                )}
              </div>

              {/* Body */}
              <div className="p-5">
                <span className="text-xs font-semibold uppercase tracking-wide text-indigo-500">
                  {project.category}
                </span>
                <h2 className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                  {project.title}
                </h2>
                <p className="mt-2 line-clamp-3 text-sm text-gray-500 dark:text-gray-400">
                  {project.description}
                </p>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Empty state for a filter with no matches */}
      {filtered.length === 0 && (
        <p className="py-16 text-center text-gray-500">
          No {active.toLowerCase()} projects yet.
        </p>
      )}
    </div>
  );
}
