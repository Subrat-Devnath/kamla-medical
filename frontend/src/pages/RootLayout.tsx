


import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
function ReactLayout() {
  const navigate = useNavigate();

  const [showProfile, setShowProfile] = useState(false);

  // get user from localStorage (after login)
  const user = {
    email: localStorage.getItem("userEmail") || "guest@email.com",
  };

  return (
    <div className="min-h-screen bg-black text-white relative">

      {/* NAVBAR */}
      <div className="flex justify-end p-4">
        <button
          onClick={() => setShowProfile(true)}
          className="px-5 py-2 rounded-xl bg-white/10 border border-white/10 hover:bg-white/20"
        >
          Profile
        </button>
      </div>

      {/* PAGE CONTENT */}
      <Outlet />

      {/* PROFILE SIDEBAR */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-black/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl transform transition-transform duration-300 z-50
                ${showProfile ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="p-6 space-y-6">

          <div className="flex justify-between">
            <h2 className="text-xl font-bold text-cyan-400">
              User Profile
            </h2>

            <button
              onClick={() => setShowProfile(false)}
              className="text-gray-400"
            >
              ✕
            </button>
          </div>

          <div className="bg-white/5 p-4 rounded-xl border border-white/10">
            <p className="text-gray-400 text-sm">Email</p>
            <p className="text-lg font-semibold">{user.email}</p>
          </div>

          <button
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
            className="w-full py-3 bg-red-600 rounded-xl"
          >
            Logout
          </button>

        </div>
      </div>

      {/* BACKDROP */}
      {showProfile && (
        <div
          onClick={() => setShowProfile(false)}
          className="fixed inset-0 bg-black/60 z-40"
        />
      )}
    </div>
  );
}



export default ReactLayout