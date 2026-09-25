import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

type PanelProps = ComponentPropsWithoutRef<"div"> & {
  interactive?: boolean;
};

/** Frosted glass surface that every card, list row and sheet is built on. */
function Panel({ className, interactive = false, ...props }: PanelProps) {
  return (
    <div
      className={cn(
        "hud-surface",
        interactive && "hud-surface-interactive",
        className,
      )}
      {...props}
    />
  );
}

export default Panel;
