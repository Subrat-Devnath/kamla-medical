import { Search, X } from "lucide-react";

import { cn } from "@/lib/utils";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  /** Stretch the field to the full container width on every breakpoint. */
  fullWidth?: boolean;
  className?: string;
};

function SearchBar({
  value,
  onChange,
  onSubmit,
  placeholder = "Search…",
  fullWidth = false,
  className,
}: SearchBarProps) {
  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
      className={cn(
        "flex w-full items-center gap-2",
        !fullWidth && "sm:w-auto",
        className,
      )}
    >
      <div
        className={cn(
          "relative min-w-0 flex-1",
          !fullWidth && "sm:w-72 sm:flex-none lg:w-80",
        )}
      >
        <Search
          size={16}
          className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-slate-500"
        />

        <input
          type="search"
          inputMode="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="hud-input pr-10 pl-10"
        />

        {value && (
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => {
              onChange("");
              onSubmit();
            }}
            className="absolute top-1/2 right-1 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition-colors hover:text-slate-200"
          >
            <X size={15} />
          </button>
        )}
      </div>

      <button type="submit" className="hud-btn hud-btn-primary shrink-0 px-4">
        <Search size={16} />
        <span className="hidden sm:inline">Search</span>
      </button>
    </form>
  );
}

export default SearchBar;
