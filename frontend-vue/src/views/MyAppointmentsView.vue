<script setup>
import { onMounted } from 'vue';
import { useAppointmentsStore } from '../stores/appointments';

const appointmentsStore = useAppointmentsStore();

onMounted(() => {
  appointmentsStore.fetchMyAppointments();
});

const getServiceName = (app) => {
  if (app.service && typeof app.service === 'object') {
    return app.service.name || app.service.title || 'Servicio';
  }
  return app.service_name || app.service_title || (app.service_id ? `Servicio #${app.service_id}` : 'Servicio');
};

const formatDate = (app) => {
  const rawDate = app.appointment_date || app.date_time || app.start_time || app.date || app.datetime || app.created_at;
  if (!rawDate) return 'Fecha no especificada';
  
  const d = new Date(rawDate);
  if (isNaN(d.getTime())) return String(rawDate);
  
  return d.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const getStatusBadge = (status) => {
  const s = String(status || 'PENDING').toUpperCase();
  if (s === 'CONFIRMED' || s === 'CONFIRMADO') return { label: 'Confirmado', class: 'bg-green-100 text-green-800' };
  if (s === 'CANCELLED' || s === 'CANCELADO') return { label: 'Cancelado', class: 'bg-red-100 text-red-800' };
  return { label: 'Pendiente', class: 'bg-yellow-100 text-yellow-800' };
};
</script>

<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Mis Turnos</h1>

    <div v-if="appointmentsStore.loading" class="text-gray-500">Cargando mis turnos...</div>

    <div v-else-if="appointmentsStore.myAppointments.length === 0" class="text-gray-500 border p-6 rounded bg-white text-center">
      No tenés reservas agendadas.
    </div>

    <div v-else class="space-y-4">
      <div 
        v-for="app in appointmentsStore.myAppointments" 
        :key="app.id" 
        class="border p-4 rounded-lg shadow-sm bg-white flex justify-between items-center"
      >
        <div>
          <h2 class="text-lg font-bold text-gray-900">{{ getServiceName(app) }}</h2>
          <p class="text-gray-600 text-sm mt-1">📅 {{ formatDate(app) }}</p>
        </div>
        <span :class="['px-3 py-1 rounded-full text-xs font-semibold', getStatusBadge(app.status).class]">
          {{ getStatusBadge(app.status).label }}
        </span>
      </div>
    </div>
  </div>
</template>