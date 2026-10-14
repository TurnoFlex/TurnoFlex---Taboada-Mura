import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Calendar as CalendarIcon, Clock, DollarSign, CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function Home() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingServices, setFetchingServices] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

  useEffect(() => {
    fetchServices();
  }, [token]);

  const fetchServices = async () => {
    try {
      const res = await fetch(`${API_URL}/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setServices(data);
        if (data.length > 0) setSelectedService(data[0].id);
      }
    } catch (err) {
      console.error("Error al cargar servicios:", err);
    } finally {
      setFetchingServices(false);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (!selectedService || !startTime) {
      setError("Por favor seleccioná un servicio y un horario.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          service_id: Number(selectedService),
          start_time: new Date(startTime).toISOString(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo reservar el turno.");
      }

      setMessage("¡Turno reservado exitosamente! Podés revisarlo en la sección Mis Turnos.");
      setStartTime("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase tracking-wider px-3.5 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Agenda Online</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">Reservá tu Turno</h1>
        <p className="text-slate-400 text-sm md:text-base mt-2 max-w-xl mx-auto">
          Elegí el servicio que necesitás, seleccioná fecha y horario disponible y confirmá tu cita en segundos.
        </p>
      </div>

      {message && (
        <div className="mb-8 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm max-w-2xl mx-auto shadow-lg">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm max-w-2xl mx-auto shadow-lg">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <span>1. Seleccioná un Servicio</span>
          </h2>

          {fetchingServices ? (
            <div className="py-12 text-center text-slate-400">Cargando catálogo...</div>
          ) : services.length === 0 ? (
            <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-slate-400 text-center">
              No hay servicios registrados en la base de datos.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((srv) => {
                const isSelected = Number(selectedService) === srv.id;
                return (
                  <div
                    key={srv.id}
                    onClick={() => setSelectedService(srv.id)}
                    className={`cursor-pointer p-5 rounded-2xl border transition relative ${
                      isSelected
                        ? "bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10"
                        : "bg-slate-900 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-white text-base">{srv.name}</h3>
                      <span className="text-indigo-400 font-extrabold text-lg flex items-center">
                        <DollarSign className="w-4 h-4 -mr-1" />
                        {Number(srv.price).toLocaleString("es-AR")}
                      </span>
                    </div>
                    <p className="text-slate-400 text-xs line-clamp-2 mb-3">{srv.description || "Servicio profesional garantizado."}</p>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md w-fit border border-slate-800">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{srv.duration_minutes} minutos</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-fit">
          <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-indigo-400" />
            <span>2. Fecha y Horario</span>
          </h2>

          <form onSubmit={handleBooking} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                Día y Hora del Turno
              </label>
              <input
                type="datetime-local"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-3 px-3.5 text-white text-sm focus:outline-none focus:border-indigo-500 transition"
              />
              <p className="text-slate-500 text-xs mt-1.5">No se admiten fechas pasadas ni horarios ocupados.</p>
            </div>

            <button
              type="submit"
              disabled={loading || fetchingServices || services.length === 0}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
            >
              {loading ? "Verificando disponibilidad..." : "Confirmar Reserva"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}