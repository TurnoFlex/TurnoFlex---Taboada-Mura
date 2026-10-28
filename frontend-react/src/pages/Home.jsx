import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import ServiceCard from "../components/ServiceCard";
import BookingForm from "../components/BookingForm";
import { CheckCircle2, AlertCircle, Sparkles } from "lucide-react";

export default function Home() {
  const { token } = useAuth();
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [startTime, setStartTime] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetchingServices, setFetchingServices] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.getServices(token);
        setServices(data);
        if (data.length > 0) setSelectedService(data[0].id);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchingServices(false);
      }
    };
    load();
  }, [token]);

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
      await api.createAppointment(token, {
        service_id: Number(selectedService),
        start_time: new Date(startTime).toISOString(),
      });
      setMessage("¡Turno reservado exitosamente! Podés revisarlo en Mis Turnos.");
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
        <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold uppercase px-3.5 py-1.5 rounded-full mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Agenda Online</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold text-white">Reservá tu Turno</h1>
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
          <h2 className="text-lg font-bold text-white">1. Seleccioná un Servicio</h2>
          {fetchingServices ? (
            <div className="py-12 text-center text-slate-400">Cargando catálogo...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map((srv) => (
                <ServiceCard
                  key={srv.id}
                  service={srv}
                  isSelected={Number(selectedService) === srv.id}
                  onSelect={setSelectedService}
                />
              ))}
            </div>
          )}
        </div>

        <BookingForm
          startTime={startTime}
          setStartTime={setStartTime}
          onBooking={handleBooking}
          loading={loading}
          disabled={fetchingServices || services.length === 0}
        />
      </div>
    </div>
  );
}