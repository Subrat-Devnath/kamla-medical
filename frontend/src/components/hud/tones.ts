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

export const tones: Record<Tone, ToneStyle> = {
  cyan: {
    box: "border-cyan-400/20 bg-cyan-400/[0.07]",
    label: "text-cyan-300",
    pill: "border-cyan-400/30 bg-cyan-400/10 text-cyan-200",
    badge: "bg-cyan-400/15 text-cyan-300 ring-cyan-400/30",
    text: "text-cyan-300",
    glow: "hover:shadow-cyan-500/25",
  },
  blue: {
    box: "border-blue-400/20 bg-blue-500/[0.08]",
    label: "text-blue-300",
    pill: "border-blue-400/30 bg-blue-500/10 text-blue-200",
    badge: "bg-blue-500/15 text-blue-300 ring-blue-400/30",
    text: "text-blue-300",
    glow: "hover:shadow-blue-500/25",
  },
  violet: {
    box: "border-violet-400/20 bg-violet-500/[0.08]",
    label: "text-violet-300",
    pill: "border-violet-400/30 bg-violet-500/10 text-violet-200",
    badge: "bg-violet-500/15 text-violet-300 ring-violet-400/30",
    text: "text-violet-300",
    glow: "hover:shadow-violet-500/25",
  },
  amber: {
    box: "border-amber-400/20 bg-amber-400/[0.08]",
    label: "text-amber-300",
    pill: "border-amber-400/30 bg-amber-400/10 text-amber-200",
    badge: "bg-amber-400/15 text-amber-300 ring-amber-400/30",
    text: "text-amber-300",
    glow: "hover:shadow-amber-500/25",
  },
  emerald: {
    box: "border-emerald-400/20 bg-emerald-400/[0.08]",
    label: "text-emerald-300",
    pill: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    badge: "bg-emerald-400/15 text-emerald-300 ring-emerald-400/30",
    text: "text-emerald-300",
    glow: "hover:shadow-emerald-500/25",
  },
  rose: {
    box: "border-rose-400/20 bg-rose-400/[0.08]",
    label: "text-rose-300",
    pill: "border-rose-400/30 bg-rose-400/10 text-rose-200",
    badge: "bg-rose-400/15 text-rose-300 ring-rose-400/30",
    text: "text-rose-300",
    glow: "hover:shadow-rose-500/25",
  },
  slate: {
    box: "border-white/10 bg-white/[0.04]",
    label: "text-slate-400",
    pill: "border-white/15 bg-white/[0.06] text-slate-200",
    badge: "bg-white/[0.08] text-slate-300 ring-white/15",
    text: "text-slate-200",
    glow: "hover:shadow-slate-500/20",
  },
};
