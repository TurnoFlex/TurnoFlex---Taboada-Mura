import React from "react";
import { Calendar as CalendarIcon } from "lucide-react";

export default function BookingForm({ startTime, setStartTime, onBooking, loading, disabled }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-fit">
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <CalendarIcon className="w-5 h-5 text-indigo-400" />
        <span>2. Fecha y Horario</span>
      </h2>
      <form onSubmit={onBooking} className="space-y-5">
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
          disabled={loading || disabled}
          className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition shadow-lg shadow-indigo-600/30"
        >
          {loading ? "Verificando disponibilidad..." : "Confirmar Reserva"}
        </button>
      </form>
    </div>
  );
}
