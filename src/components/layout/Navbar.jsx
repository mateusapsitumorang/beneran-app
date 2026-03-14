import { Link, useLocation } from "react-router-dom";
import { Shield, AlertCircle, Moon, Sun } from "lucide-react";
import { useThemeStore } from "../../store/useThemeStore";

const menu = [
  { path: "/chat", label: "💬 Tanya AI" },
  { path: "/riwayat", label: "🕐 Riwayat" },
  { path: "/database-hitam", label: "Database Hitam" },
  { path: "/lapor", label: "Lapor Scam" },
  { path: "/edukasi", label: "Edukasi" },
];

export default function Navbar() {
  const location = useLocation();
  const { isDark, toggle } = useThemeStore();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 font-bold text-slate-800 text-xl"
        >
          <Shield size={22} className="text-blue-600" />
          Beneran?
        </Link>

        <div className="flex items-center gap-1 text-sm">
          {menu.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === path
                  ? "bg-blue-50 text-blue-600 font-medium"
                  : "text-slate-600 hover:text-slate-800 hover:bg-slate-100"
              }`}
            >
              {label}
            </Link>
          ))}

          {/* Toggle Dark Mode */}
          <button
            onClick={toggle}
            className="ml-1 p-2 rounded-lg text-slate-500 hover:bg-slate-100 transition-colors"
            title={isDark ? "Mode Terang" : "Mode Gelap"}
          >
            {isDark ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          <Link
            to="/darurat"
            className="ml-1 flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
          >
            <AlertCircle size={14} />
            Darurat
          </Link>
        </div>
      </div>
    </nav>
  );
}
