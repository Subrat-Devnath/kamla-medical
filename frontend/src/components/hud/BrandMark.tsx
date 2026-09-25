import { cn } from "@/lib/utils";

type BrandMarkProps = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeClass = {
  sm: "h-9 w-9 rounded-xl text-base",
  md: "h-12 w-12 rounded-2xl text-xl",
  lg: "h-16 w-16 rounded-[1.25rem] text-2xl sm:h-20 sm:w-20 sm:text-3xl",
} as const;

/** Glowing medical-cross badge used as the app logo. */
function BrandMark({ size = "md", className }: BrandMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-300 via-sky-400 to-blue-600 font-black text-slate-900 shadow-lg shadow-cyan-500/40",
        sizeClass[size],
        className,
      )}
    >
      <span className="absolute inset-0 animate-pulse bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.55),transparent_60%)]" />
      <span className="relative">✚</span>
    </span>
  );
}

export default BrandMark;
