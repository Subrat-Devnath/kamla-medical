import { cn } from "@/lib/utils";

/**
 * Animated aurora + holographic grid backdrop shared by every screen.
 * Sizes are in `vmin` so the glows never overflow a phone viewport.
 */
function AmbientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 z-0 overflow-hidden bg-void",
        className,
      )}
    >
      <div className="hud-grid absolute inset-0 animate-grid-drift" />

      <div className="absolute -top-[20vmin] -right-[20vmin] h-[70vmin] w-[70vmin] animate-aurora rounded-full bg-cyan-400/35 blur-[90px]" />
      <div className="absolute -bottom-[25vmin] -left-[20vmin] h-[70vmin] w-[70vmin] animate-orb rounded-full bg-blue-500/35 blur-[90px]" />
      <div className="absolute top-1/3 left-1/2 h-[50vmin] w-[50vmin] -translate-x-1/2 animate-orb rounded-full bg-violet-600/20 blur-[110px]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_50%_-10%,rgba(56,189,248,0.14),transparent_60%)]" />

      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
      <div className="absolute inset-x-0 top-0 h-[2px] animate-scan bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent" />
    </div>
  );
}

export default AmbientBackground;
