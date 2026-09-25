import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";

type PaginationProps = {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  loading?: boolean;
  /** Optional caption such as "Page 3". */
  label?: string;
  className?: string;
};

function Pagination({
  canPrev,
  canNext,
  onPrev,
  onNext,
  loading = false,
  label,
  className,
}: PaginationProps) {
  return (
    <nav
      aria-label="Pagination"
      className={cn(
        "flex items-center justify-between gap-3 sm:justify-center sm:gap-4",
        className,
      )}
    >
      <button
        type="button"
        onClick={onPrev}
        disabled={loading || !canPrev}
        className="hud-btn hud-btn-ghost flex-1 sm:flex-none sm:px-5"
      >
        <ChevronLeft size={16} />
        Prev
      </button>

      {label && (
        <span className="hud-label shrink-0 tabular">{label}</span>
      )}

      <button
        type="button"
        onClick={onNext}
        disabled={loading || !canNext}
        className="hud-btn hud-btn-primary flex-1 sm:flex-none sm:px-5"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}

export default Pagination;
