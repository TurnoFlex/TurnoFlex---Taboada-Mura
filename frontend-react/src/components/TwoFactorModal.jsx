import React, { useState } from "react";
import { KeyRound, ShieldAlert, ArrowRight } from "lucide-react";

export default function TwoFactorModal({ email, onVerify, onCancel, loading, error }) {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim().length === 6) {
      onVerify(code.trim());
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-white">Verificación en 2 Pasos</h3>
        <p className="text-slate-400 text-xs mt-2">
          Te enviamos un código de 6 dígitos a <span className="text-indigo-300 font-semibold">{email}</span>.
        </p>

        {error && (
          <div className="my-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <input
            type="text"
            required
            maxLength={6}
            autoFocus
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            placeholder="000000"
            className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 text-center text-2xl font-mono tracking-widest text-indigo-400 focus:outline-none focus:border-indigo-500"
          />
          <button
            type="submit"
            disabled={loading || code.length !== 6}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
          >
            {loading ? "Verificando..." : "Confirmar e Ingresar"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <button
          onClick={onCancel}
          className="mt-4 text-xs text-slate-500 hover:text-slate-400 underline"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}
