import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  icon?: LucideIcon;
  backTo?: string;
  actions?: ReactNode;
  className?: string;
};

function PageHeader({
  eyebrow,
  title,
  subtitle,
  icon: Icon,
  backTo,
  actions,
  className,
}: PageHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className={cn("space-y-4", className)}>
      {backTo && (
        <button
          type="button"
          onClick={() => navigate(backTo)}
          className="hud-btn hud-btn-ghost min-h-10 px-3 text-xs"
        >
          <ArrowLeft size={14} />
          Back
        </button>
      )}

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 items-start gap-3 sm:gap-4">
          {Icon && (
            <span className="mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-700 ring-1 ring-cyan-500/30 sm:h-14 sm:w-14 dark:from-cyan-400/25 dark:to-blue-600/25 dark:text-cyan-300 dark:ring-cyan-400/30">
              <Icon className="h-5 w-5 sm:h-6 sm:w-6" />
            </span>
          )}

          <div className="min-w-0 space-y-1.5">
            {eyebrow && (
              <p className="hud-label text-cyan-700/80 dark:text-cyan-300/80">{eyebrow}</p>
            )}

            <h1 className="hud-title text-2xl leading-tight font-black tracking-tight sm:text-3xl lg:text-4xl">
              {title}
            </h1>

            {subtitle && (
              <div className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</div>
            )}
          </div>
        </div>

        {actions && (
          <div className="flex flex-wrap gap-2 sm:gap-3 [&>*]:flex-1 sm:[&>*]:flex-none">
            {actions}
          </div>
        )}
      </div>

      <hr className="hud-divider" />
    </header>
  );
}

export default PageHeader;
