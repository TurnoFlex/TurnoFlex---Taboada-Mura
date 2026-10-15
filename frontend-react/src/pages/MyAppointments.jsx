import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar, Clock, DollarSign, XCircle, CheckCircle2, AlertCircle } from "lucide-react";

export default function MyAppointments() {
  const { token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

  useEffect(() => {
    fetchMyAppointments();
  }, [token]);

  const fetchMyAppointments = async () => {
    try {
      const res = await fetch(`${API_URL}/appointments/my-appointments`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setAppointments(data);
      }
    } catch (err) {
      console.error("Error al cargar turnos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm("¿Seguro que deseás cancelar este turno?")) return;
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "CANCELADO" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "No se pudo cancelar el turno.");

      setMessage("Turno cancelado correctamente.");
      fetchMyAppointments();
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "CONFIRMADO":
        return <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-bold">CONFIRMADO</span>;
      case "COMPLETADO":
        return <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs px-2.5 py-1 rounded-full font-bold">COMPLETADO</span>;
      case "CANCELADO":
        return <span className="bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs px-2.5 py-1 rounded-full font-bold">CANCELADO</span>;
      default:
        return <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs px-2.5 py-1 rounded-full font-bold">{status}</span>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white">Mis Turnos</h1>
        <p className="text-slate-400 text-sm mt-1">Consultá tu historial de turnos o cancelá citas pendientes.</p>
      </div>

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
          <p className="text-base font-medium text-slate-300">Todavía no tenés ningún turno reservado.</p>
          <p className="text-xs text-slate-500 mt-1">Andá a la pestaña Reservar Turno para agendar tu primera cita.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((app) => {
            const startDate = new Date(app.start_time);
            return (
              <div key={app.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-bold text-white text-lg">{app.service_name}</h3>
                    {getStatusBadge(app.status)}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-indigo-400" />
                      {startDate.toLocaleDateString("es-AR", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-indigo-400" />
                      {startDate.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} hs
                    </span>
                    <span className="flex items-center text-emerald-400 font-bold">
                      <DollarSign className="w-3.5 h-3.5 -mr-1" />
                      {Number(app.price).toLocaleString("es-AR")}
                    </span>
                  </div>
                </div>

                {app.status !== "CANCELADO" && app.status !== "COMPLETADO" && (
                  <button
                    onClick={() => handleCancel(app.id)}
                    className="flex items-center justify-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-3.5 py-2 rounded-xl transition w-fit"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancelar Turno
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}