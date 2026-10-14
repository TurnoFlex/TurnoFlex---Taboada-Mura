import React from "react";
import { useAuth } from "../context/AuthContext";
import { ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 md:p-10 shadow-2xl">
        <div className="flex items-center gap-2 text-indigo-400 text-sm font-semibold uppercase mb-3">
          <Sparkles className="w-4 h-4" />
          <span>Sesión Iniciada con Éxito</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-black text-white">
          ¡Hola, <span className="text-indigo-400">{user?.name}</span>!
        </h1>

        <p className="text-slate-300 text-base mt-3 max-w-2xl">
          Te autenticaste correctamente en el frontend de <span className="font-semibold text-white">React</span>. Tu token JWT está guardado en el navegador y tu sesión fue validada por la API de Express.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-start gap-3">
            <ShieldCheck className="w-6 h-6 text-indigo-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold text-sm">Rol Asignado</h3>
              <p className="text-indigo-300 text-sm font-mono mt-0.5">{user?.role}</p>
            </div>
          </div>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 flex items-start gap-3">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold text-sm">Correo Registrado</h3>
              <p className="text-slate-400 text-sm mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}