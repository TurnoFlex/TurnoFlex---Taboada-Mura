<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAppointmentsStore } from '../stores/appointments';
import { formatCurrency } from '../utils/constants';

const router = useRouter();
const appointmentsStore = useAppointmentsStore();

const appointments = computed(() => appointmentsStore.appointments);

const cancelTurno = (id) => {
  if (confirm('¿Estás seguro de que querés cancelar este turno?')) {
    appointmentsStore.cancelAppointment(id);
  }
};

const goToCatalog = () => router.push('/catalog');
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-5xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Mis Turnos Agendados</h1>
          <p class="text-gray-600 mt-1">Revisá el estado de tus reservas activas e historial.</p>
        </div>
        <button 
          @click="goToCatalog" 
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg text-sm shadow"
        >
          + Reservar Nuevo Turno
        </button>
      </div>

      <!-- Si no hay reservas -->
      <div v-if="appointments.length === 0" class="bg-white rounded-xl p-12 text-center border border-gray-200">
        <p class="text-gray-500 text-lg mb-4">No tenés reservas agendadas en este momento.</p>
        <button 
          @click="goToCatalog" 
          class="text-blue-600 hover:underline font-semibold"
        >
          Explorar el catálogo y sacar un turno
        </button>
      </div>

      <!-- Lista de Turnos Agendados -->
      <div v-else class="space-y-4">
        <div 
          v-for="item in appointments" 
          :key="item.id"
          class="bg-white rounded-xl p-6 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div class="flex items-center space-x-4 w-full md:w-auto">
            <img 
              :src="item.image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80'" 
              alt="Servicio"
              class="w-16 h-16 rounded-lg object-cover flex-shrink-0"
            />
            <div>
              <span class="text-xs font-semibold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full inline-block mb-1">
                {{ item.category || 'General' }}
              </span>
              <h3 class="text-lg font-bold text-gray-900">{{ item.service_name }}</h3>
              <p class="text-sm text-gray-500">
                📅 <strong>{{ item.date }}</strong> a las ⏰ <strong>{{ item.time }}</strong>
              </p>
            </div>
          </div>

          <div class="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0">
            <div class="text-right">
              <span class="block text-xl font-bold text-gray-900">${{ formatCurrency(item.price) }}</span>
              <span class="inline-block px-3 py-1 text-xs rounded-full bg-amber-100 text-amber-800 font-semibold mt-1">
                {{ item.status || 'Pendiente' }}
              </span>
            </div>

            <button 
              @click="cancelTurno(item.id)" 
              class="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition border border-red-200"
            >
              Cancelar Turno
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>