import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { tones, type Tone } from "./tones";

type PillProps = {
  tone?: Tone;
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
};

function Pill({ tone = "slate", icon: Icon, children, className }: PillProps) {
  return (
    <span
      className={cn(
        "inline-flex max-w-full items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        tones[tone].pill,
        className,
      )}
    >
      {Icon && <Icon size={12} className="shrink-0" />}
      <span className="truncate">{children}</span>
    </span>
  );
}

export default Pill;
