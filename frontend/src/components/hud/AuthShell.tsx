import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";

import AmbientBackground from "./AmbientBackground";
import BrandMark from "./BrandMark";

type AuthShellProps = {
  eyebrow?: string;
  title: string;
  subtitle?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
};

function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center px-4 py-8 text-white sm:px-6 sm:py-12">
      <AmbientBackground />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="hud-surface overflow-hidden rounded-3xl p-6 sm:p-8">
          <div className="mb-7 flex flex-col items-center text-center">
            <BrandMark size="lg" className="mb-5" />

            {eyebrow && (
              <p className="hud-label mb-3 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-cyan-300">
                {eyebrow}
              </p>
            )}

            <h1 className="hud-title text-2xl leading-tight font-black tracking-tight sm:text-3xl">
              {title}
            </h1>

            {subtitle && (
              <p className="mt-3 text-sm text-slate-400">{subtitle}</p>
            )}
          </div>

          {children}

          <div className="mt-7 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-[0.6875rem] tracking-[0.14em] text-slate-500 uppercase">
            <ShieldCheck size={13} className="text-emerald-400" />
            Encrypted medical channel
          </div>

          {footer && (
            <div className="mt-4 text-center text-sm text-slate-500">
              {footer}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default AuthShell;
