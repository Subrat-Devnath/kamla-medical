import { Moon, Palette, Sun, type LucideIcon } from "lucide-react";
import { useState } from "react";

import { useTheme, type Theme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

import Modal from "./Modal";

type ThemeOption = {
  value: Theme;
  label: string;
  hint: string;
  icon: LucideIcon;
};

const options: ThemeOption[] = [
  { value: "light", label: "Light", hint: "Bright, high-contrast", icon: Sun },
  { value: "dark", label: "Dark", hint: "Original console look", icon: Moon },
];

type TriggerVariant = "rail" | "header";

const triggerClass: Record<TriggerVariant, string> = {
  rail: "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-900/5 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/5 dark:hover:text-white",
  header:
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-slate-900/10 bg-slate-900/5 text-slate-600 transition-colors active:bg-slate-900/10 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:active:bg-white/15",
};

/**
 * Icon button that opens a small "choose your theme" dialog. Used both in
 * the desktop rail (full-width row, label revealed on hover) and the mobile
 * top bar (icon-only, square button).
 */
function ThemeToggle({ variant = "rail" }: { variant?: TriggerVariant }) {
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const TriggerIcon = theme === "dark" ? Moon : Sun;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Change appearance"
        className={triggerClass[variant]}
      >
        <TriggerIcon size={variant === "rail" ? 20 : 18} className="shrink-0" />
        {variant === "rail" && (
          <span className="truncate whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            Appearance
          </span>
        )}
      </button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Appearance"
        description="Pick the look that's easiest on your eyes."
        icon={Palette}
        size="sm"
      >
        <div className="grid grid-cols-2 gap-3">
          {options.map(({ value, label, hint, icon: Icon }) => {
            const active = theme === value;
            return (
              <button
                key={value}
                type="button"
                onClick={() => {
                  setTheme(value);
                  setOpen(false);
                }}
                aria-pressed={active}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border p-4 text-center transition-colors",
                  active
                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/50 dark:bg-cyan-400/10 dark:text-cyan-300"
                    : "border-slate-900/10 bg-slate-900/[0.03] text-slate-600 hover:bg-slate-900/[0.06] dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-300 dark:hover:bg-white/[0.06]",
                )}
              >
                <span
                  className={cn(
                    "flex h-11 w-11 items-center justify-center rounded-xl",
                    value === "light"
                      ? "bg-amber-400/20 text-amber-600 dark:text-amber-300"
                      : "bg-indigo-400/20 text-indigo-600 dark:text-indigo-300",
                  )}
                >
                  <Icon size={20} />
                </span>
                <span className="text-sm font-bold">{label}</span>
                <span className="text-[0.6875rem] text-slate-500 dark:text-slate-500">
                  {hint}
                </span>
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}

export default ThemeToggle;
