import React from "react";
import { Calendar } from "lucide-react";

export default function AppointmentsTable({ appointments, loading, onStatusChange }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Calendar className="w-5 h-5 text-indigo-400" />
        <span>Agenda Global de Turnos</span>
      </h2>
      {loading ? (
        <div className="py-8 text-center text-slate-400">Cargando...</div>
      ) : appointments.length === 0 ? (
        <div className="text-center text-slate-400 py-6">No hay turnos registrados.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Servicio</th>
                <th className="py-3 px-4">Fecha</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4 text-center">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {appointments.map((app) => (
                <tr key={app.id}>
                  <td className="py-3 px-4">#{app.id}</td>
                  <td className="py-3 px-4">{app.user_name}</td>
                  <td className="py-3 px-4">{app.service_name}</td>
                  <td className="py-3 px-4">{new Date(app.start_time).toLocaleString("es-AR")}</td>
                  <td className="py-3 px-4 font-bold text-xs">{app.status}</td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={app.status}
                      onChange={(e) => onStatusChange(app.id, e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded-lg py-1 px-2 text-xs text-white"
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
  );
}
