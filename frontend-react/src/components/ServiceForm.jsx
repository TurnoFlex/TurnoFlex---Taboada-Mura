import React, { useState } from "react";
import { PlusCircle } from "lucide-react";

export default function ServiceForm({ onCreate }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState(30);
  const [price, setPrice] = useState(5000);

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate({ name, description, duration_minutes: Number(duration), price: Number(price) });
    setName("");
    setDescription("");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <PlusCircle className="w-5 h-5 text-indigo-400" />
        <span>Dar de Alta un Nuevo Servicio</span>
      </h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          required
          placeholder="Nombre"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm"
        />
        <input
          type="number"
          required
          placeholder="Duración (min)"
          value={duration}
          onChange={(e) => setDuration(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm"
        />
        <input
          type="number"
          required
          placeholder="Precio ($)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded-xl py-2 px-3 text-white text-sm"
        />
        <div className="md:col-span-4 flex justify-end">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm px-6 py-2.5 rounded-xl transition">
            Guardar Servicio
          </button>
        </div>
      </form>
    </div>
  );
}
