export type Tone =
  | "cyan"
  | "blue"
  | "violet"
  | "amber"
  | "emerald"
  | "rose"
  | "slate";

type ToneStyle = {
  /** Tinted container used by info boxes. */
  box: string;
  /** Small uppercase caption inside a box. */
  label: string;
  /** Rounded status chip. */
  pill: string;
  /** Square icon badge. */
  badge: string;
  /** Accent text colour for values and links. */
  text: string;
  /** Coloured glow applied on hover. */
  glow: string;
};

// Every tone ships a light-mode value plus a `dark:` override so the same
// component looks right in both themes (see ThemeContext / RootLayout toggle).
export const tones: Record<Tone, ToneStyle> = {
  cyan: {
    box: "border-cyan-600/25 bg-cyan-500/[0.06] dark:border-cyan-400/20 dark:bg-cyan-400/[0.07]",
    label: "text-cyan-700 dark:text-cyan-300",
    pill: "border-cyan-600/30 bg-cyan-500/10 text-cyan-700 dark:border-cyan-400/30 dark:bg-cyan-400/10 dark:text-cyan-200",
    badge: "bg-cyan-500/15 text-cyan-700 ring-cyan-600/30 dark:bg-cyan-400/15 dark:text-cyan-300 dark:ring-cyan-400/30",
    text: "text-cyan-700 dark:text-cyan-300",
    glow: "hover:shadow-cyan-500/25",
  },
  blue: {
    box: "border-blue-600/25 bg-blue-500/[0.08] dark:border-blue-400/20 dark:bg-blue-500/[0.08]",
    label: "text-blue-700 dark:text-blue-300",
    pill: "border-blue-600/30 bg-blue-500/10 text-blue-700 dark:border-blue-400/30 dark:bg-blue-500/10 dark:text-blue-200",
    badge: "bg-blue-500/15 text-blue-700 ring-blue-600/30 dark:bg-blue-500/15 dark:text-blue-300 dark:ring-blue-400/30",
    text: "text-blue-700 dark:text-blue-300",
    glow: "hover:shadow-blue-500/25",
  },
  violet: {
    box: "border-violet-600/25 bg-violet-500/[0.08] dark:border-violet-400/20 dark:bg-violet-500/[0.08]",
    label: "text-violet-700 dark:text-violet-300",
    pill: "border-violet-600/30 bg-violet-500/10 text-violet-700 dark:border-violet-400/30 dark:bg-violet-500/10 dark:text-violet-200",
    badge: "bg-violet-500/15 text-violet-700 ring-violet-600/30 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-400/30",
    text: "text-violet-700 dark:text-violet-300",
    glow: "hover:shadow-violet-500/25",
  },
  amber: {
    box: "border-amber-600/25 bg-amber-500/[0.08] dark:border-amber-400/20 dark:bg-amber-400/[0.08]",
    label: "text-amber-700 dark:text-amber-300",
    pill: "border-amber-600/30 bg-amber-500/10 text-amber-700 dark:border-amber-400/30 dark:bg-amber-400/10 dark:text-amber-200",
    badge: "bg-amber-500/15 text-amber-700 ring-amber-600/30 dark:bg-amber-400/15 dark:text-amber-300 dark:ring-amber-400/30",
    text: "text-amber-700 dark:text-amber-300",
    glow: "hover:shadow-amber-500/25",
  },
  emerald: {
    box: "border-emerald-600/25 bg-emerald-500/[0.08] dark:border-emerald-400/20 dark:bg-emerald-400/[0.08]",
    label: "text-emerald-700 dark:text-emerald-300",
    pill: "border-emerald-600/30 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-400/10 dark:text-emerald-200",
    badge: "bg-emerald-500/15 text-emerald-700 ring-emerald-600/30 dark:bg-emerald-400/15 dark:text-emerald-300 dark:ring-emerald-400/30",
    text: "text-emerald-700 dark:text-emerald-300",
    glow: "hover:shadow-emerald-500/25",
  },
  rose: {
    box: "border-rose-600/25 bg-rose-500/[0.08] dark:border-rose-400/20 dark:bg-rose-400/[0.08]",
    label: "text-rose-700 dark:text-rose-300",
    pill: "border-rose-600/30 bg-rose-500/10 text-rose-700 dark:border-rose-400/30 dark:bg-rose-400/10 dark:text-rose-200",
    badge: "bg-rose-500/15 text-rose-700 ring-rose-600/30 dark:bg-rose-400/15 dark:text-rose-300 dark:ring-rose-400/30",
    text: "text-rose-700 dark:text-rose-300",
    glow: "hover:shadow-rose-500/25",
  },
  slate: {
    box: "border-slate-900/10 bg-slate-900/[0.03] dark:border-white/10 dark:bg-white/[0.04]",
    label: "text-slate-600 dark:text-slate-400",
    pill: "border-slate-900/15 bg-slate-900/[0.04] text-slate-700 dark:border-white/15 dark:bg-white/[0.06] dark:text-slate-200",
    badge: "bg-slate-900/[0.06] text-slate-700 ring-slate-900/15 dark:bg-white/[0.08] dark:text-slate-300 dark:ring-white/15",
    text: "text-slate-700 dark:text-slate-200",
    glow: "hover:shadow-slate-500/20",
  },
};
