import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import { Calendar, PlusCircle, CheckCircle2, AlertCircle, Clock, DollarSign } from "lucide-react";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Formulario nuevo servicio
  const [newServiceName, setNewServiceName] = useState("");
  const [newServiceDesc, setNewServiceDesc] = useState("");
  const [newServiceDuration, setNewServiceDuration] = useState(30);
  const [newServicePrice, setNewServicePrice] = useState(5000);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api/v1";

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  useEffect(() => {
    loadData();
  }, [token]);

  const loadData = async () => {
    try {
      const [resApp, resSrv] = await Promise.all([
        fetch(`${API_URL}/appointments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/services`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const [dataApp, dataSrv] = await Promise.all([resApp.json(), resSrv.json()]);

      if (resApp.ok) setAppointments(dataApp);
      if (resSrv.ok) setServices(dataSrv);
    } catch (err) {
      console.error("Error al cargar datos de admin:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_URL}/appointments/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage(`Turno #${id} actualizado a ${newStatus}.`);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCreateService = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/services`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: newServiceName,
          description: newServiceDesc,
          duration_minutes: Number(newServiceDuration),
          price: Number(newServicePrice),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("¡Servicio agregado exitosamente al catálogo!");
      setNewServiceName("");
      setNewServiceDesc("");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-12">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-white">Panel de Administración</h1>
        <p className="text-slate-400 text-sm mt-1">Control de la agenda de turnos y catálogo de servicios del local.</p>
      </div>

      {message && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3 text-emerald-400 text-sm">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center gap-3 text-rose-400 text-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* SECCIÓN 1: AGREGAR SERVICIO */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <PlusCircle className="w-5 h-5 text-indigo-400" />
          <span>Dar de Alta un Nuevo Servicio</span>
        </h2>
        <form onSubmit={handleCreateService} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Nombre</label>
            <input
              type="text"
              required
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Ej: Afeitado Premium"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Descripción</label>
            <input
              type="text"
              value={newServiceDesc}
              onChange={(e) => setNewServiceDesc(e.target.value)}
              placeholder="Opcional"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Duración (min)</label>
            <input
              type="number"
              required
              value={newServiceDuration}
              onChange={(e) => setNewServiceDuration(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase mb-1">Precio ($)</label>
            <input
              type="number"
              required
              value={newServicePrice}
              onChange={(e) => setNewServicePrice(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="md:col-span-4 flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition"
            >
              Guardar Servicio
            </button>
          </div>
        </form>
      </div>

      {/* SECCIÓN 2: GRILLA GENERAL DE TURNOS */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          <span>Agenda Global de Turnos</span>
        </h2>

        {loading ? (
          <div className="py-12 text-center text-slate-400">Cargando agenda...</div>
        ) : appointments.length === 0 ? (
          <div className="text-center text-slate-400 py-8">No hay turnos registrados en el sistema.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Cliente</th>
                  <th className="py-3 px-4">Servicio</th>
                  <th className="py-3 px-4">Fecha y Hora</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-mono text-slate-400">#{app.id}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{app.user_name}</div>
                      <div className="text-xs text-slate-500">{app.user_email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-white">{app.service_name}</span>
                      <div className="text-xs text-emerald-400 font-bold">${Number(app.price).toLocaleString("es-AR")}</div>
                    </td>
                    <td className="py-3 px-4 text-xs">
                      {new Date(app.start_time).toLocaleString("es-AR", {
                        day: "2-digit",
                        month: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                      })} hs
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-bold ${
                          app.status === "CONFIRMADO"
                            ? "bg-emerald-500/20 text-emerald-400"
                            : app.status === "COMPLETADO"
                            ? "bg-indigo-500/20 text-indigo-400"
                            : app.status === "CANCELADO"
                            ? "bg-rose-500/20 text-rose-400"
                            : "bg-amber-500/20 text-amber-400"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value)}
                        className="bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                      >
                        <option value="PENDIENTE">PENDIENTE</option>
                        <option value="CONFIRMADO">CONFIRMADO</option>
                        <option value="COMPLETADO">COMPLETADO</option>
                        <option value="CANCELADO">CANCELADO</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}