import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/**
 * Standard content container for authenticated pages. The generous bottom
 * padding keeps the last row clear of the mobile tab bar.
 */
function PageShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-6xl space-y-6 px-4 pt-5 pb-28 sm:space-y-7 sm:px-6 sm:pt-7 lg:px-10 lg:pt-10 lg:pb-14",
        className,
      )}
    >
      {children}
    </div>
  );
}

export default PageShell;
