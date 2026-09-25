import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { tones, type Tone } from "./tones";

type InfoBoxProps = {
  tone?: Tone;
  label: string;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
};

/** Tinted metric group used inside record cards. */
function InfoBox({
  tone = "slate",
  label,
  icon: Icon,
  children,
  className,
}: InfoBoxProps) {
  const style = tones[tone];

  return (
    <div
      className={cn(
        "rounded-2xl border p-3.5 sm:p-4",
        style.box,
        className,
      )}
    >
      <p className={cn("hud-label mb-3 flex items-center gap-1.5", style.label)}>
        {Icon && <Icon size={13} className="shrink-0" />}
        {label}
      </p>

      <div className="space-y-2 text-sm">{children}</div>
    </div>
  );
}

type InfoRowProps = {
  label: string;
  value: ReactNode;
  valueClassName?: string;
};

function InfoRow({ label, value, valueClassName }: InfoRowProps) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-slate-500 dark:text-slate-400">{label}</span>
      <span
        className={cn(
          "min-w-0 text-right font-medium text-slate-800 tabular dark:text-slate-200",
          valueClassName,
        )}
      >
        {value}
      </span>
    </div>
  );
}

export { InfoBox, InfoRow };
