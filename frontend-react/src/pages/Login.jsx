import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import TwoFactorModal from "../components/TwoFactorModal";
import { Lock, Mail, AlertCircle } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const [twoFactorData, setTwoFactorData] = useState(null);
  const [twoFactorError, setTwoFactorError] = useState("");
  const [verifying2FA, setVerifying2FA] = useState(false);

  const { completeLoginWithToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!email.includes("@")) return setError("Email inválido.");
    if (password.length < 4) return setError("Contraseña muy corta.");

    setLoading(true);
    try {
      const res = await api.login(email, password);
      if (res.require2FA) {
        setTwoFactorData(res);
      } else if (res.token) {
        completeLoginWithToken(res.token, res.user);
        navigate("/");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify2FA = async (code) => {
    setTwoFactorError("");
    setVerifying2FA(true);
    try {
      const res = await api.verify2FA(twoFactorData.userId, code);
      completeLoginWithToken(res.token, res.user);
      navigate("/");
    } catch (err) {
      setTwoFactorError(err.message);
    } finally {
      setVerifying2FA(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-73px)] flex items-center justify-center px-4 bg-slate-950">
      {twoFactorData && (
        <TwoFactorModal
          email={twoFactorData.email}
          onVerify={handleVerify2FA}
          onCancel={() => setTwoFactorData(null)}
          loading={verifying2FA}
          error={twoFactorError}
        />
      )}

      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-3xl font-extrabold text-white text-center mb-2">Iniciar Sesión</h2>
        <p className="text-slate-400 text-sm text-center mb-6">Accedé a tu cuenta en TurnoFlex</p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-2 text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Email</label>
            <div className="relative">
              <Mail className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-5 h-5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 text-white text-sm focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-xl text-sm transition shadow-lg mt-2 disabled:opacity-50"
          >
            {loading ? "Comprobando..." : "Continuar"}
          </button>
        </form>

        <p className="text-center text-sm text-slate-400 mt-6">
          ¿No tenés cuenta?{" "}
          <Link to="/register" className="text-indigo-400 hover:text-indigo-300 font-medium">Registrate acá</Link>
        </p>
      </div>
    </div>
  );
}
