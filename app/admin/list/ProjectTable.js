"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Pencil, Star } from "lucide-react";
import { BLUR_DATA_URL } from "@/lib/blur";
import { useToast } from "@/app/components/Toast";
import { reorderProjects } from "../actions";
import DeleteButton from "./DeleteButton";

export default function ProjectTable({ initialProjects }) {
  const { toast } = useToast();
  const [items, setItems] = useState(initialProjects);
  const itemsRef = useRef(initialProjects);

  // Keep local state in sync when the server sends fresh data (e.g. after a
  // delete revalidates the route).
  useEffect(() => {
    setItems(initialProjects);
    itemsRef.current = initialProjects;
  }, [initialProjects]);

  const handleReorder = (newOrder) => {
    itemsRef.current = newOrder;
    setItems(newOrder);
  };

  // Persist once the drag gesture ends, using the latest order from the ref.
  const persist = async () => {
    try {
      await reorderProjects(itemsRef.current.map((p) => p.id));
      toast({ type: "success", message: "Order saved" });
    } catch {
      toast({ type: "error", message: "Couldn’t save the new order" });
    }
  };

  return (
    <div>
      <p className="mb-3 text-xs text-gray-400">
        Drag the handle to reorder — changes save automatically.
      </p>

      <Reorder.Group axis="y" values={items} onReorder={handleReorder} className="space-y-2">
        {items.map((project) => (
          <ProjectRow key={project.id} project={project} onDragEnd={persist} />
        ))}
      </Reorder.Group>
    </div>
  );
}

function ProjectRow({ project, onDragEnd }) {
  const controls = useDragControls();

  return (
    <Reorder.Item
      value={project}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDragEnd}
      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-800 dark:bg-gray-900"
    >
      {/* Drag handle — only this starts a drag, so buttons stay clickable */}
      <button
        onPointerDown={(e) => controls.start(e)}
        className="cursor-grab touch-none rounded p-1 text-gray-400 hover:text-gray-700 active:cursor-grabbing dark:hover:text-gray-200"
        aria-label="Drag to reorder"
      >
        <GripVertical className="h-5 w-5" />
      </button>

      {/* Thumbnail with blur-up */}
      <div className="relative h-12 w-16 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
        {project.image_url && (
          <Image
            src={project.image_url}
            alt={project.title}
            fill
            sizes="64px"
            placeholder="blur"
            blurDataURL={BLUR_DATA_URL}
            className="object-cover"
          />
        )}
      </div>

      {/* Title + description */}
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-gray-900 dark:text-white">
          {project.title}
        </p>
        <p className="truncate text-xs text-gray-500">{project.description}</p>
      </div>

      {/* Category */}
      <span className="hidden text-sm text-gray-500 sm:inline dark:text-gray-400">
        {project.category}
      </span>

      {/* Featured */}
      <span className="hidden w-6 justify-center md:flex">
        {project.is_featured && (
          <Star className="h-4 w-4 fill-current text-amber-500" />
        )}
      </span>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Link
          href={`/admin/edit/${project.id}`}
          className="inline-flex items-center gap-1 rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
        >
          <Pencil className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Edit</span>
        </Link>
        <DeleteButton id={project.id} title={project.title} />
      </div>
    </Reorder.Item>
  );
}
