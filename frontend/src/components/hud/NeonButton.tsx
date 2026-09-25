import type { ComponentPropsWithoutRef } from "react";
import { LoaderCircle, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type Variant = "primary" | "ghost" | "success" | "danger";
type Size = "sm" | "md" | "lg";

const variantClass: Record<Variant, string> = {
  primary: "hud-btn-primary",
  ghost: "hud-btn-ghost",
  success: "hud-btn-success",
  danger: "hud-btn-danger",
};

const sizeClass: Record<Size, string> = {
  sm: "min-h-10 px-3 text-xs sm:text-[0.8125rem]",
  md: "min-h-11 px-4 text-sm",
  lg: "min-h-12 px-5 text-sm sm:text-base",
};

type NeonButtonProps = ComponentPropsWithoutRef<"button"> & {
  variant?: Variant;
  size?: Size;
  icon?: LucideIcon;
  /** Full width on phones, auto width from `sm` up. */
  block?: boolean;
  loading?: boolean;
};

function NeonButton({
  variant = "ghost",
  size = "md",
  icon: Icon,
  block = false,
  loading = false,
  className,
  children,
  disabled,
  type = "button",
  ...props
}: NeonButtonProps) {
  const iconSize = size === "sm" ? 14 : 16;

  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={cn(
        "hud-btn",
        variantClass[variant],
        sizeClass[size],
        block && "w-full sm:w-auto",
        className,
      )}
      {...props}
    >
      {loading ? (
        <LoaderCircle size={iconSize} className="animate-spin" />
      ) : (
        Icon && <Icon size={iconSize} className="shrink-0" />
      )}
      {children}
    </button>
  );
}

export default NeonButton;
