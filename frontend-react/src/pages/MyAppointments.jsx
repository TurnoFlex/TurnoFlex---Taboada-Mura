import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Calendar, XCircle, CheckCircle2, AlertCircle } from "lucide-react";

export default function MyAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const loadAppointments = async () => {
    try {
      const data = await api.getMyAppointments(token);
      setAppointments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, [token]);

  const handleCancel = async (id) => {
    if (!window.confirm("¿Seguro que deseás cancelar este turno?")) return;
    setMessage(null);
    setError(null);
    try {
      await api.updateAppointmentStatus(token, id, "CANCELADO");
      setMessage("Turno cancelado correctamente.");
      loadAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-extrabold text-white mb-6">Mis Turnos</h1>

      {message && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="py-12 text-center text-slate-400">Cargando tus citas...</div>
      ) : appointments.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-10 text-center text-slate-400">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p>No tenés turnos reservados.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => (
            <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex justify-between items-center shadow-lg">
              <div>
                <h3 className="font-bold text-white text-lg">{app.service_name}</h3>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(app.start_time).toLocaleString("es-AR")} - ${Number(app.price).toLocaleString("es-AR")}
                </p>
                <span className="inline-block mt-2 text-xs font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                  {app.status}
                </span>
              </div>
              {app.status !== "CANCELADO" && (
                <button
                  onClick={() => handleCancel(app.id)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 bg-rose-500/10 px-3.5 py-2 rounded-xl border border-rose-500/20 hover:bg-rose-500/20 transition"
                >
                  <XCircle className="w-4 h-4" /> Cancelar
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}