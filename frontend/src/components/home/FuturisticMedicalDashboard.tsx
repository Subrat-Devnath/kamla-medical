import { useNavigate } from "react-router-dom";

function FuturisticMedicalDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#0f766e_0%,transparent_30%),radial-gradient(circle_at_bottom_left,#1d4ed8_0%,transparent_30%)] opacity-30" />

      {/* MAIN CONTENT */}
      <div className="relative z-10 text-center space-y-10">

        <h1 className="text-5xl font-black bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Medical Dashboard
        </h1>

        <p className="text-gray-400">
          Choose what you want to manage
        </p>

        <div className="flex flex-col sm:flex-row gap-6 justify-center">

          <button
            onClick={() => navigate("/products")}
            className="px-10 py-5 rounded-2xl text-xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:scale-105 transition"
          >
            Products
          </button>

          <button
            onClick={() => navigate("/selling")}
            className="px-10 py-5 rounded-2xl text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-600 hover:scale-105 transition"
          >
            Selling
          </button>



        </div>
      </div>

    </div>
  );
}

export default FuturisticMedicalDashboard;