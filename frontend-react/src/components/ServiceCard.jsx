import React from "react";
import { Clock, DollarSign } from "lucide-react";

export default function ServiceCard({ service, isSelected, onSelect }) {
  return (
    <div
      onClick={() => onSelect(service.id)}
      className={`cursor-pointer p-5 rounded-2xl border transition relative ${
        isSelected
          ? "bg-indigo-600/15 border-indigo-500 shadow-lg shadow-indigo-500/10"
          : "bg-slate-900 border-slate-800 hover:border-slate-700"
      }`}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-bold text-white text-base">{service.name}</h3>
        <span className="text-indigo-400 font-extrabold text-lg flex items-center">
          <DollarSign className="w-4 h-4 -mr-1" />
          {Number(service.price).toLocaleString("es-AR")}
        </span>
      </div>
      <p className="text-slate-400 text-xs line-clamp-2 mb-3">{service.description || "Servicio profesional garantizado."}</p>
      <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/60 px-2.5 py-1 rounded-md w-fit border border-slate-800">
        <Clock className="w-3.5 h-3.5 text-indigo-400" />
        <span>{service.duration_minutes} minutos</span>
      </div>
    </div>
  );
}
