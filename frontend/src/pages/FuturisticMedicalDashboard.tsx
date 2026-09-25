import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Activity,
  ArrowRight,
  CalendarDays,
  History,
  Package,
  ReceiptText,
  ShieldCheck,
  Sparkles,
  Tag,
  Wallet,
  type LucideIcon,
} from "lucide-react";

import { PageShell, Panel, Pill } from "@/components/hud";
import { tones, type Tone } from "@/components/hud/tones";
import { cn } from "@/lib/utils";

type ModuleCard = {
  title: string;
  description: string;
  path: string;
  icon: LucideIcon;
  tone: Tone;
  cta: string;
  boxes: { label: string; value: string; icon: LucideIcon }[];
};

const modules: ModuleCard[] = [
  {
    title: "Products",
    description:
      "Manage medicine inventory, stock levels, pricing and expiry tracking in one place.",
    path: "/products",
    icon: Package,
    tone: "cyan",
    cta: "Manage Products",
    boxes: [
      { label: "Inventory", value: "Stock & qty", icon: Package },
      { label: "Expiry", value: "Date alerts", icon: CalendarDays },
      { label: "History", value: "Purchases", icon: History },
    ],
  },
  {
    title: "Invoices",
    description:
      "Create customer invoices, map products, apply discounts and generate final bills.",
    path: "/invoices",
    icon: ReceiptText,
    tone: "blue",
    cta: "Manage Invoices",
    boxes: [
      { label: "Draft", value: "Create bill", icon: ReceiptText },
      { label: "Items", value: "Map products", icon: Tag },
      { label: "Totals", value: "Auto maths", icon: Wallet },
    ],
  },
];

function FuturisticMedicalDashboard() {
  const navigate = useNavigate();

  return (
    <PageShell>
      {/* ---------- Hero ---------- */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
        className="flex flex-col items-center pt-4 text-center sm:pt-8"
      >
        <span className="hud-label inline-flex items-center gap-2 rounded-full border border-cyan-600/40 bg-cyan-500/10 px-3.5 py-1.5 text-cyan-700 dark:border-cyan-400/40 dark:bg-cyan-400/10 dark:text-cyan-300">
          <Sparkles size={13} />
          Welcome aboard
        </span>

        <h1 className="hud-title mt-5 text-3xl leading-[1.1] font-black tracking-tight sm:text-5xl lg:text-6xl">
          Kamla Medical Store
        </h1>

        <p className="mt-4 max-w-xl text-sm leading-relaxed text-slate-500 sm:mt-5 sm:text-base dark:text-slate-400">
          Streamline inventory and billing from a single console. Track stock,
          watch expiry dates and raise invoices in seconds.
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Pill tone="emerald" icon={Activity}>
            All systems operational
          </Pill>
          <Pill tone="cyan" icon={ShieldCheck}>
            Secure session
          </Pill>
        </div>
      </motion.section>

      {/* ---------- Module cards ---------- */}
      <section className="grid gap-4 sm:gap-5 md:grid-cols-2">
        {modules.map((module, index) => {
          const Icon = module.icon;
          const tone = tones[module.tone];

          return (
            <motion.div
              key={module.title}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 + index * 0.08 }}
            >
              <Panel
                interactive
                role="button"
                tabIndex={0}
                onClick={() => navigate(module.path)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    navigate(module.path);
                  }
                }}
                className={cn(
                  "group flex h-full cursor-pointer flex-col p-5 text-left sm:p-6",
                  tone.glow,
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1",
                      tone.badge,
                    )}
                  >
                    <Icon size={22} />
                  </span>

                  <ArrowRight
                    size={18}
                    className="mt-3 shrink-0 text-slate-400 transition-all duration-300 group-hover:translate-x-1 group-hover:text-cyan-600 dark:text-slate-600 dark:group-hover:text-cyan-300"
                  />
                </div>

                <h2 className="mt-4 text-lg font-bold text-slate-900 sm:text-xl dark:text-white">
                  {module.title}
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-400">
                  {module.description}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2">
                  {module.boxes.map((box) => {
                    const BoxIcon = box.icon;

                    return (
                      <div
                        key={box.label}
                        className={cn(
                          "rounded-xl border p-2.5 text-left",
                          tone.box,
                        )}
                      >
                        <p
                          className={cn(
                            "flex items-center gap-1 text-[0.625rem] font-semibold tracking-wider uppercase",
                            tone.label,
                          )}
                        >
                          <BoxIcon size={11} className="shrink-0" />
                          <span className="truncate">{box.label}</span>
                        </p>
                        <p className="mt-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {box.value}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <span
                  className={cn(
                    "mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition-colors sm:w-fit",
                    tone.pill,
                  )}
                >
                  {module.cta}
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </Panel>
            </motion.div>
          );
        })}
      </section>
    </PageShell>
  );
}

export default FuturisticMedicalDashboard;
