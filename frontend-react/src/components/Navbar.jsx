import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Calendar, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 text-xl font-bold text-indigo-400 hover:text-indigo-300 transition">
        <Calendar className="w-6 h-6 text-indigo-500" />
        <span>TurnoFlex</span>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <div className="flex items-center gap-2 text-sm text-slate-300 bg-slate-800/80 px-3.5 py-1.5 rounded-full border border-slate-700">
              <User className="w-4 h-4 text-indigo-400" />
              <span className="font-medium">{user.name}</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 uppercase tracking-wider">
                {user.role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm font-medium text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 px-3.5 py-1.5 rounded-lg border border-rose-500/20 transition"
            >
              <LogOut className="w-4 h-4" />
              Salir
            </button>
          </>
        ) : (
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3.5 py-2 rounded-lg hover:bg-slate-800 transition">
              Iniciar Sesión
            </Link>
            <Link to="/register" className="text-sm font-medium bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg shadow-md shadow-indigo-600/30 transition">
              Registrarse
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
