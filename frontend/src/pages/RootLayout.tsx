import { useMemo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  CircleHelp,
  LayoutDashboard,
  LogOut,
  Package,
  ReceiptText,
  type LucideIcon,
} from "lucide-react";

import { AmbientBackground, BrandMark } from "@/components/hud";
import { cn } from "@/lib/utils";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { to: "/home", label: "Home", icon: LayoutDashboard },
  { to: "/products", label: "Products", icon: Package },
  { to: "/invoices", label: "Invoices", icon: ReceiptText },
];

function RootLayout() {
  const user = useMemo(() => {
    const email = localStorage.getItem("userEmail") || "Guest";
    const username = email.includes("@") ? email.split("@")[0] : email;

    return { username, initial: username.charAt(0).toUpperCase() };
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="relative min-h-dvh text-white">
      <AmbientBackground />

      {/* ---------- Desktop rail: icons only, expands on hover ---------- */}
      <aside className="group pointer-events-auto fixed top-0 left-0 z-50 hidden h-dvh w-[84px] flex-col overflow-hidden border-r border-white/10 bg-void/70 px-3 py-5 backdrop-blur-xl transition-[width] duration-300 ease-out hover:w-64 lg:flex">
        <div className="mb-8 flex items-center gap-3">
          <BrandMark size="sm" />

          <div className="overflow-hidden opacity-0 transition-opacity duration-200 group-hover:opacity-100">
            <p className="truncate text-sm font-bold whitespace-nowrap text-cyan-300">
              Kamla Medical
            </p>
            <p className="text-[0.6875rem] whitespace-nowrap text-slate-500">
              Control Console
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={railLinkClass} title={label}>
              <Icon size={20} className="shrink-0" />
              <span className="truncate whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                {label}
              </span>
            </NavLink>
          ))}
        </nav>

        <div className="space-y-1.5 border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 rounded-2xl px-3 py-2.5">
            <span className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300 to-blue-600 text-xs font-bold text-slate-900">
              {user.initial}
              <span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 animate-pulse rounded-full border-2 border-void bg-emerald-400" />
            </span>

            <div className="min-w-0 overflow-hidden opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <p className="truncate text-sm font-semibold whitespace-nowrap text-slate-200">
                {user.username}
              </p>
              <p className="text-[0.6875rem] whitespace-nowrap text-emerald-400">
                Online
              </p>
            </div>
          </div>

          <button type="button" className={railLinkClass({ isActive: false })}>
            <CircleHelp size={20} className="shrink-0" />
            <span className="truncate whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Help
            </span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-rose-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
          >
            <LogOut size={20} className="shrink-0" />
            <span className="truncate whitespace-nowrap opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* ---------- Mobile top bar ---------- */}
      <header className="pt-safe sticky top-0 z-40 border-b border-white/10 bg-void/80 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <BrandMark size="sm" />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-cyan-300">
                Kamla Medical
              </p>
              <p className="truncate text-[0.6875rem] text-slate-500">
                Hi, {user.username}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            aria-label="Sign out"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-rose-400 transition-colors active:bg-rose-500/15"
          >
            <LogOut size={18} />
          </button>
        </div>
      </header>

      {/* ---------- Page content ---------- */}
      <main className="relative z-10 min-w-0 lg:pl-[84px]">
        <Outlet />
      </main>

      {/* ---------- Mobile bottom tab bar ---------- */}
      <nav className="pb-safe fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-void/90 backdrop-blur-xl lg:hidden">
        <div className="mx-auto grid max-w-md grid-cols-4 gap-1 px-2 pt-1.5">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} className={tabLinkClass}>
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      "h-0.5 w-8 rounded-full transition-colors",
                      isActive ? "bg-cyan-400" : "bg-transparent",
                    )}
                  />
                  <Icon size={20} />
                  <span className="text-[0.6875rem] font-semibold">{label}</span>
                </>
              )}
            </NavLink>
          ))}

          <button type="button" className={tabLinkClass({ isActive: false })}>
            <span className="h-0.5 w-8 rounded-full bg-transparent" />
            <CircleHelp size={20} />
            <span className="text-[0.6875rem] font-semibold">Help</span>
          </button>
        </div>
      </nav>
    </div>
  );
}

const railLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
    isActive
      ? "bg-cyan-400/15 text-cyan-300 shadow-[inset_0_0_0_1px_rgb(34_211_238/0.25)]"
      : "text-slate-400 hover:bg-white/5 hover:text-white",
  );

const tabLinkClass = ({ isActive }: { isActive: boolean }) =>
  cn(
    "flex min-h-[3.5rem] flex-col items-center justify-center gap-1 rounded-2xl pb-1 transition-colors",
    isActive ? "text-cyan-300" : "text-slate-500 active:text-slate-300",
  );

export default RootLayout;
