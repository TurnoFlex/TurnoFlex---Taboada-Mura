<script setup>
import { ref, onMounted } from 'vue';
import { useAppointmentsStore } from '../stores/appointments';
import { useServicesStore } from '../stores/services';

const appointmentsStore = useAppointmentsStore();
const servicesStore = useServicesStore();

const newService = ref({ name: '', description: '', price: '', duration: '' });

onMounted(() => {
  appointmentsStore.fetchAllAppointments();
  servicesStore.fetchServices();
});

const handleCreateService = async () => {
  await servicesStore.createService({ ...newService.value });
  newService.value = { name: '', description: '', price: '', duration: '' };
};

const changeStatus = async (id, status) => {
  await appointmentsStore.updateStatus(id, status);
};
</script>

<template>
  <div class="p-6 max-w-6xl mx-auto">
    <h1 class="text-3xl font-bold mb-6">Panel de Administración</h1>

    <!-- Crear Servicio -->
    <section class="mb-8 p-4 border rounded bg-white shadow-sm">
      <h2 class="text-xl font-semibold mb-3">Nuevo Servicio</h2>
      <form @submit.prevent="handleCreateService" class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input v-model="newService.name" placeholder="Nombre" required class="border p-2 rounded" />
        <input v-model="newService.description" placeholder="Descripción" class="border p-2 rounded" />
        <input v-model.number="newService.price" type="number" placeholder="Precio" required class="border p-2 rounded" />
        <input v-model.number="newService.duration" type="number" placeholder="Duración (min)" required class="border p-2 rounded" />
        <button type="submit" class="md:col-span-2 bg-indigo-600 text-white py-2 rounded font-medium">Crear Servicio</button>
      </form>
    </section>

    <!-- Agenda Global -->
    <section>
      <h2 class="text-xl font-semibold mb-3">Agenda Global de Turnos</h2>
      <div class="overflow-x-auto">
        <table class="w-full border-collapse border text-left">
          <thead>
            <tr class="bg-gray-100">
              <th class="border p-2">ID</th>
              <th class="border p-2">Cliente</th>
              <th class="border p-2">Servicio</th>
              <th class="border p-2">Fecha/Hora</th>
              <th class="border p-2">Estado</th>
              <th class="border p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="app in appointmentsStore.allAppointments" :key="app.id">
              <td class="border p-2">{{ app.id }}</td>
              <td class="border p-2">{{ app.user_email || app.user_id }}</td>
              <td class="border p-2">{{ app.service_name || app.service_id }}</td>
              <td class="border p-2">{{ new Date(app.date_time).toLocaleString() }}</td>
              <td class="border p-2">{{ app.status }}</td>
              <td class="border p-2 space-x-1">
                <button @click="changeStatus(app.id, 'CONFIRMADO')" class="bg-green-500 text-white px-2 py-1 text-xs rounded">Confirmar</button>
                <button @click="changeStatus(app.id, 'COMPLETADO')" class="bg-blue-500 text-white px-2 py-1 text-xs rounded">Completar</button>
                <button @click="changeStatus(app.id, 'CANCELADO')" class="bg-red-500 text-white px-2 py-1 text-xs rounded">Cancelar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</template>