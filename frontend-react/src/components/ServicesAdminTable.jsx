import React from "react";
import { Scissors, Edit2, Trash2, Clock, DollarSign } from "lucide-react";

export default function ServicesAdminTable({ services, onEdit, onDelete }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
      <h2 className="text-lg font-bold text-white flex items-center gap-2">
        <Scissors className="w-5 h-5 text-indigo-400" />
        <span>Catálogo de Servicios Registrados</span>
      </h2>

      {services.length === 0 ? (
        <div className="text-center text-slate-400 py-6">No hay servicios creados en el catálogo.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-950/80 text-xs text-slate-400 uppercase border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Servicio</th>
                <th className="py-3 px-4">Descripción</th>
                <th className="py-3 px-4">Duración</th>
                <th className="py-3 px-4">Precio</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {services.map((srv) => (
                <tr key={srv.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 px-4 font-mono text-slate-400">#{srv.id}</td>
                  <td className="py-3 px-4 font-semibold text-white">{srv.name}</td>
                  <td className="py-3 px-4 text-xs text-slate-400 max-w-xs truncate">{srv.description || "-"}</td>
                  <td className="py-3 px-4 text-xs">
                    <span className="flex items-center gap-1 text-slate-300">
                      <Clock className="w-3.5 h-3.5 text-indigo-400" />
                      {srv.duration_minutes} min
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-emerald-400 text-sm">
                    ${Number(srv.price).toLocaleString("es-AR")}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => onEdit(srv)}
                        title="Modificar servicio"
                        className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(srv.id)}
                        title="Eliminar servicio"
                        className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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