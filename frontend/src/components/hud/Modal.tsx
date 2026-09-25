import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  icon?: LucideIcon;
  size?: "sm" | "md" | "lg";
  footer?: ReactNode;
  children: ReactNode;
};

const sizeClass = {
  sm: "sm:max-w-md",
  md: "sm:max-w-2xl",
  lg: "sm:max-w-4xl",
} as const;

/**
 * Bottom sheet on phones, centred dialog from `sm` up. The body scrolls on its
 * own so tall forms stay reachable on short screens. Rendered in a portal so
 * the sticky app chrome can never paint over it.
 */
function Modal({
  open,
  onClose,
  title,
  description,
  icon: Icon,
  size = "md",
  footer,
  children,
}: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  return createPortal(
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-100 flex items-end justify-center sm:items-center sm:p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-void/80 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "hud-surface relative z-10 flex max-h-[92dvh] w-full flex-col overflow-hidden rounded-b-none rounded-t-3xl sm:max-h-[88dvh] sm:rounded-3xl",
              sizeClass[size],
            )}
          >
            {/* Grab handle hint — phones only. */}
            <div className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-slate-900/15 sm:hidden dark:bg-white/20" />

            <div className="flex items-start justify-between gap-3 px-5 py-4 sm:px-6 sm:py-5">
              <div className="flex min-w-0 items-start gap-3">
                {Icon && (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-500/15 text-cyan-700 ring-1 ring-cyan-500/25 dark:bg-cyan-400/15 dark:text-cyan-300 dark:ring-cyan-400/25">
                    <Icon size={18} />
                  </span>
                )}

                <div className="min-w-0">
                  <h2 className="hud-title text-lg font-bold sm:text-xl">
                    {title}
                  </h2>
                  {description && (
                    <p className="mt-1 text-xs text-slate-500 sm:text-sm dark:text-slate-400">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-900/10 bg-slate-900/5 text-slate-500 transition-colors hover:border-rose-500/40 hover:bg-rose-500/10 hover:text-rose-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-400 dark:hover:border-rose-400/40 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"
              >
                <X size={18} />
              </button>
            </div>

            <hr className="hud-divider shrink-0" />

            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
              {children}
            </div>

            {footer && (
              <>
                <hr className="hud-divider shrink-0" />
                <div className="pb-safe shrink-0 px-5 pt-4 sm:px-6 sm:pb-5">
                  {footer}
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

export default Modal;
