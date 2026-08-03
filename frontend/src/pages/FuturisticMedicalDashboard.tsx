import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  FileText,
  Package,
} from "lucide-react";

const cards = [
  {
    title: "Products",
    description:
      "Manage medicine inventory, stock levels, pricing, and expiry tracking in one place.",
    path: "/products",
    icon: Package,
    accent: "cyan",
    cta: "Manage Products",
  },
  {
    title: "Invoices",
    description:
      "Create customer invoices, map products, apply discounts, and generate final bills.",
    path: "/invoices",
    icon: FileText,
    accent: "blue",
    cta: "Manage Invoices",
  },
] as const;

const accentStyles = {
  cyan: {
    iconWrap: "bg-cyan-500/20 text-cyan-300 ring-cyan-400/30",
    button: "bg-cyan-500 hover:bg-cyan-400 text-black",
    glow: "group-hover:shadow-cyan-500/20",
  },
  blue: {
    iconWrap: "bg-blue-500/20 text-blue-300 ring-blue-400/30",
    button: "bg-blue-500 hover:bg-blue-400 text-white",
    glow: "group-hover:shadow-blue-500/20",
  },
} as const;

function FuturisticMedicalDashboard() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,#38bdf8_0%,transparent_30%),radial-gradient(circle_at_bottom_left,#2563eb_0%,transparent_30%)] opacity-40" />
      <div className="pointer-events-none absolute -top-40 -right-24 h-[550px] w-[550px] rounded-full bg-sky-400/30 blur-[120px]" />
      <div className="pointer-events-none absolute -bottom-40 -left-24 h-[550px] w-[550px] rounded-full bg-blue-600/25 blur-[120px]" />

      <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center px-6 py-14 sm:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mb-10 text-center"
        >
          <span className="inline-flex items-center rounded-full border border-cyan-400/40 bg-cyan-400/10 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-cyan-300">
            WELCOME ABOARD
          </span>

          <h1 className="mt-6 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
            <span className="bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-500 bg-clip-text text-transparent">
              Kamla Medical Store
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-gray-400 sm:text-base">
            Streamline inventory and billing from one place. Manage products
            and create invoices efficiently with a modern interface.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid w-full max-w-4xl gap-6 md:grid-cols-2">
          {cards.map((card, index) => {
            const Icon = card.icon;
            const styles = accentStyles[card.accent];

            return (
              <motion.button
                key={card.title}
                type="button"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: 0.12 + index * 0.08,
                }}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={() => navigate(card.path)}
                className={`group flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.04] p-6 text-left shadow-lg backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/[0.07] hover:shadow-2xl ${styles.glow}`}
              >
                <div
                  className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl ring-1 ${styles.iconWrap}`}
                >
                  <Icon size={22} />
                </div>

                <h2 className="text-xl font-bold text-white">
                  {card.title}
                </h2>

                <p className="mt-3 flex-1 text-sm leading-relaxed text-gray-400">
                  {card.description}
                </p>

                <span
                  className={`mt-6 inline-flex w-fit items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${styles.button}`}
                >
                  {card.cta}
                  <ArrowRight
                    size={16}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FuturisticMedicalDashboard;