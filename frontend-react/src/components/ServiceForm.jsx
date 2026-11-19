import React, { useState, useEffect } from "react";
import { PlusCircle, Edit3, X } from "lucide-react";

export default function ServiceForm({ onSave, editingService, onCancelEdit }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(5000);

  useEffect(() => {
    if (editingService) {
      setName(editingService.name || "");
      setDescription(editingService.description || "");
      setDuration(editingService.duration_minutes || 30);
      setPrice(editingService.price || 5000);
    } else {
      setName("");
      setDescription("");
      setDuration(30);
      setPrice(5000);
    }
  }, [editingService]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      name,
      description,
      duration_minutes: Number(duration),
      price: Number(price),
    });
    if (!editingService) {
      setName("");
      setDescription("");
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-white flex items-center gap-2">
          {editingService ? (
            <>
              <Edit3 className="w-5 h-5 text-amber-400" />
              <span>Modificar Servicio (#{editingService.id})</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              <span>Dar de Alta un Nuevo Servicio</span>
            </>
          )}
        </h2>
        {editingService && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="flex items-center gap-1 text-xs text-slate-400 hover:text-white bg-slate-800 px-3 py-1.5 rounded-lg transition"
          >
            <X className="w-4 h-4" /> Cancelar Edición
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Nombre</label>
          <input
            type="text"
            required
            placeholder="Ej: Corte y Barba"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Descripción</label>
          <input
            type="text"
            placeholder="Opcional"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Duración (min)</label>
          <input
            type="number"
            required
            min="5"
            placeholder="30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Precio ($)</label>
          <input
            type="number"
            required
            min="0"
            placeholder="5000"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="md:col-span-4 flex justify-end">
          <button
            type="submit"
            className={`font-semibold text-sm px-6 py-2.5 rounded-xl shadow-md transition text-white ${
              editingService
                ? "bg-amber-600 hover:bg-amber-500"
                : "bg-indigo-600 hover:bg-indigo-500"
            }`}
          >
            {editingService ? "Actualizar Servicio" : "Guardar Servicio"}
          </button>
        </div>
      </form>
    </div>
  );
}