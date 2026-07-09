"use client";

import { createContext, useContext, useCallback, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

// useToast() → { toast, dismiss }. Call toast({ type, message }) from any
// client component under <ToastProvider>.
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

let counter = 0;

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
};

const STYLES = {
  success:
    "border-green-200 bg-white text-green-800 dark:border-green-900 dark:bg-gray-900 dark:text-green-300",
  error:
    "border-red-200 bg-white text-red-800 dark:border-red-900 dark:bg-gray-900 dark:text-red-300",
  info:
    "border-gray-200 bg-white text-gray-800 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type = "success", message, duration = 3500 }) => {
      const id = ++counter;
      setToasts((list) => [...list, { id, type, message }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast, dismiss }}>
      {children}

      {/* Viewport — fixed, above everything, non-blocking */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[100] flex flex-col items-center gap-2 p-4 sm:items-end">
        <AnimatePresence>
          {toasts.map((t) => {
            const Icon = ICONS[t.type] ?? Info;
            return (
              <motion.div
                key={t.id}
                layout
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`pointer-events-auto flex w-full max-w-sm items-center gap-3 rounded-xl border px-4 py-3 text-sm shadow-lg ${STYLES[t.type]}`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                <span className="flex-1">{t.message}</span>
                <button
                  onClick={() => dismiss(t.id)}
                  className="flex-shrink-0 rounded p-0.5 text-gray-400 transition hover:text-gray-700 dark:hover:text-gray-200"
                  aria-label="Dismiss"
                >
                  <X className="h-4 w-4" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}
