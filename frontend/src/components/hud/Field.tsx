import { useState, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { Eye, EyeOff, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type FieldProps = {
  label?: ReactNode;
  /** Rendered to the right of the label, e.g. a "Forgot password?" link. */
  action?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  className?: string;
  children: ReactNode;
};

function Field({ label, action, hint, error, className, children }: FieldProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {(label || action) && (
        <div className="flex items-center justify-between gap-3">
          {label && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{label}</span>
          )}
          {action}
        </div>
      )}

      {children}

      {hint && !error && <p className="text-xs text-slate-500">{hint}</p>}
      {error && <p className="text-xs font-medium text-rose-600 dark:text-rose-400">{error}</p>}
    </div>
  );
}

type TextInputProps = ComponentPropsWithoutRef<"input"> & {
  icon?: LucideIcon;
};

function TextInput({ icon: Icon, className, ...props }: TextInputProps) {
  return (
    <div className="relative">
      {Icon && (
        <Icon
          size={16}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-400 dark:text-slate-500"
        />
      )}
      <input
        className={cn("hud-input", Icon && "pl-10", className)}
        {...props}
      />
    </div>
  );
}

function TextArea({
  className,
  rows = 3,
  ...props
}: ComponentPropsWithoutRef<"textarea">) {
  return (
    <textarea rows={rows} className={cn("hud-input resize-y", className)} {...props} />
  );
}

type PasswordInputProps = Omit<ComponentPropsWithoutRef<"input">, "type">;

function PasswordInput({ className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? "text" : "password"}
        className={cn("hud-input pr-12", className)}
        {...props}
      />

      <button
        type="button"
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-1 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-xl text-slate-500 transition-colors hover:text-cyan-600 dark:text-slate-400 dark:hover:text-cyan-300"
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export { Field, TextInput, TextArea, PasswordInput };
