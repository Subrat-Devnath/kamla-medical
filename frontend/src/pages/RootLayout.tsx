import { useMemo } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { CircleHelp, Home, LogOut } from "lucide-react";

function ReactLayout() {
  const user = useMemo(() => {
    const email = localStorage.getItem("userEmail") || "Guest";

    const username = email.includes("@")
      ? email.split("@")[0]
      : email;

    return {
      username,
      initial: username.charAt(0).toUpperCase(),
    };
  }, []);

  const handleLogout = () => {
    // Clear all stored data
    localStorage.clear();
    sessionStorage.clear();

    // Redirect to login page
    window.location.href = "/";
  };

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,#38bdf8_0%,transparent_30%),radial-gradient(circle_at_bottom_left,#2563eb_0%,transparent_30%)] opacity-40" />
      <div className="pointer-events-none fixed -top-40 -right-24 h-[550px] w-[550px] rounded-full bg-sky-400/30 blur-[120px]" />
      <div className="pointer-events-none fixed -bottom-40 -left-24 h-[550px] w-[550px] rounded-full bg-blue-600/25 blur-[120px]" />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside className="group sticky top-0 z-50 flex h-screen w-[88px] flex-col overflow-hidden border-r border-white/10 bg-black/50 px-3 py-5 backdrop-blur-xl transition-all duration-300 ease-in-out hover:w-64">
          {/* User Info */}
          <div className="mb-8 flex items-center gap-3 px-1">
            <div className="flex h-10 w-10 min-w-[40px] items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 text-sm font-bold text-black">
              {user.initial}
            </div>

            <div className="hidden overflow-hidden group-hover:block">
              <p className="truncate text-base font-bold text-cyan-300">
                {user.username}
              </p>
              <p className="text-xs text-gray-500">
                Logged in
              </p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            <NavLink
              to="/home"
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-500/15 text-cyan-300"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <Home size={20} className="min-w-[20px]" />

              <span className="hidden whitespace-nowrap group-hover:inline">
                Home
              </span>
            </NavLink>
          </nav>

          {/* Bottom Menu */}
          <div className="space-y-2 border-t border-white/10 pt-4">
            {/* Help */}
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-gray-400 transition-all duration-300 hover:bg-white/5 hover:text-white"
            >
              <CircleHelp size={20} className="min-w-[20px]" />

              <span className="hidden whitespace-nowrap group-hover:inline">
                Help
              </span>
            </button>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-red-400 transition-all duration-300 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={20} className="min-w-[20px]" />

              <span className="hidden whitespace-nowrap group-hover:inline">
                Sign Out
              </span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="relative min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ReactLayout;