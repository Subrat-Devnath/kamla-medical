import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  CircleCheck,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

function ErrorBanner({
  message,
  onDismiss,
}: {
  message: string;
  onDismiss?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-sm text-rose-700 sm:p-4 dark:border-rose-500/25 dark:text-rose-200"
    >
      <TriangleAlert size={16} className="mt-0.5 shrink-0 text-rose-600 dark:text-rose-400" />
      <p className="min-w-0 flex-1">{message}</p>

      {onDismiss && (
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss error"
          className="-m-1 shrink-0 rounded-lg p-1 text-rose-600/70 transition-colors hover:text-rose-700 dark:text-rose-300/70 dark:hover:text-rose-200"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}

function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 text-sm text-emerald-700 sm:p-4 dark:border-emerald-500/25 dark:text-emerald-200">
      <CircleCheck size={16} className="mt-0.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
      <p className="min-w-0 flex-1">{message}</p>
    </div>
  );
}

/** Indeterminate progress strip shown while a request is in flight. */
function LoadingStrip({ label = "Syncing data…" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-1 w-full max-w-xs overflow-hidden rounded-full bg-slate-900/10 dark:bg-white/10">
        <div className="absolute inset-y-0 w-1/3 animate-shimmer rounded-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent dark:via-cyan-400" />
      </div>
      <span className="hud-label shrink-0 text-cyan-700 dark:text-cyan-300">{label}</span>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="hud-surface flex flex-col items-center gap-3 px-6 py-12 text-center sm:py-16">
      <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900/[0.04] text-slate-500 ring-1 ring-slate-900/10 dark:bg-white/[0.04] dark:ring-white/10">
        <Icon size={24} />
      </span>

      <h3 className="text-base font-bold text-slate-800 sm:text-lg dark:text-slate-200">{title}</h3>

      {description && (
        <p className="max-w-sm text-sm text-slate-500">{description}</p>
      )}

      {action}
    </div>
  );
}

type ToastState = { type: "success" | "error"; message: string } | null;

function Toast({ toast }: { toast: ToastState }) {
  return createPortal(
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="pt-safe pointer-events-none fixed inset-x-0 top-0 z-200 flex justify-center px-4"
        >
          <div
            className={cn(
              "hud-surface mt-4 flex max-w-[calc(100vw-2rem)] items-center gap-2.5 rounded-full px-4 py-2.5 text-sm font-medium",
              toast.type === "success"
                ? "border-emerald-500/40 text-emerald-700 dark:border-emerald-400/30 dark:text-emerald-200"
                : "border-rose-500/40 text-rose-700 dark:border-rose-400/30 dark:text-rose-200",
            )}
          >
            {toast.type === "success" ? (
              <CircleCheck size={16} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
            ) : (
              <TriangleAlert size={16} className="shrink-0 text-rose-600 dark:text-rose-400" />
            )}
            <span className="min-w-0">{toast.message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export { ErrorBanner, SuccessBanner, LoadingStrip, EmptyState, Toast };
export type { ToastState };
