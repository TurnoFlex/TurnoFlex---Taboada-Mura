import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";
import { Navigate } from "react-router-dom";
import ServiceForm from "../components/ServiceForm";
import ServicesAdminTable from "../components/ServicesAdminTable";
import AppointmentsTable from "../components/AppointmentsTable";
import { CheckCircle2, AlertCircle } from "lucide-react";

export default function AdminDashboard() {
  const { user, token } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  if (user?.role !== "ADMIN") {
    return <Navigate to="/" replace />;
  }

  const loadData = async () => {
    try {
      const [appData, srvData] = await Promise.all([
        api.getAllAppointments(token),
        api.getServices(token),
      ]);
      setAppointments(appData);
      setServices(srvData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [token]);

  const handleSaveService = async (serviceData) => {
    setMessage(null);
    setError(null);
    try {
      if (editingService) {
        await api.updateService(token, editingService.id, serviceData);
        setMessage(`¡Servicio "${serviceData.name}" modificado exitosamente!`);
        setEditingService(null);
      } else {
        await api.createService(token, serviceData);
        setMessage(`¡Servicio "${serviceData.name}" creado exitosamente!`);
      }
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("¿Estás seguro de que deseás eliminar este servicio?")) return;
    setMessage(null);
    setError(null);
    try {
      await api.deleteService(token, id);
      setMessage("Servicio eliminado del catálogo.");
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.updateAppointmentStatus(token, id, status);
      setMessage(`Turno #${id} actualizado a ${status}.`);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-white">Panel de Administración</h1>
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

      <ServiceForm
        onSave={handleSaveService}
        editingService={editingService}
        onCancelEdit={() => setEditingService(null)}
      />

      <ServicesAdminTable
        services={services}
        onEdit={(srv) => {
          setEditingService(srv);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        onDelete={handleDeleteService}
      />

      <AppointmentsTable
        appointments={appointments}
        loading={loading}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}