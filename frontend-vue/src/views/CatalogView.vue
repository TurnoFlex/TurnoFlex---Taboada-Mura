<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';
import { useAppointmentsStore } from '../stores/appointments';
import { FALLBACK_SERVICES, TIME_SLOTS, formatCurrency } from '../utils/constants';

const router = useRouter();
const appointmentsStore = useAppointmentsStore();

const services = ref([]);
const loading = ref(true);
const selectedCategory = ref('Todas');
const selectedService = ref(null);
const isModalOpen = ref(false);

const selectedDate = ref(new Date().toISOString().split('T')[0]);
const selectedTime = ref(TIME_SLOTS[0]);

const categories = ['Todas', 'Barbería', 'Salud', 'Estética', 'Servicios'];

const fetchServices = async () => {
  loading.value = true;
  try {
    const response = await api.get('/services');
    services.value = response.data?.length ? response.data : FALLBACK_SERVICES;
  } catch (err) {
    services.value = FALLBACK_SERVICES;
  } finally {
    loading.value = false;
  }
};

onMounted(fetchServices);

const filteredServices = computed(() => {
  if (selectedCategory.value === 'Todas') return services.value;
  return services.value.filter(s => s.category === selectedCategory.value);
});

const openReservationModal = (service) => {
  selectedService.value = service;
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  selectedService.value = null;
};

const confirmBooking = () => {
  if (!selectedDate.value || !selectedTime.value) {
    alert('Por favor elegí una fecha y un horario válido.');
    return;
  }

  appointmentsStore.addAppointment({
    service_id: selectedService.value.id,
    service_name: selectedService.value.name,
    category: selectedService.value.category,
    price: selectedService.value.price,
    image: selectedService.value.image,
    date: selectedDate.value,
    time: selectedTime.value
  });

  closeModal();
  router.push('/my-appointments');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      
      <!-- Encabezado y Filtros por Categoría -->
      <div class="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Catálogo de Turnos & Servicios</h1>
          <p class="text-gray-600 mt-1">Elegí tu especialidad, selecciona el horario que prefieras y agenda tu cita.</p>
        </div>

        <div class="flex flex-wrap gap-2">
          <button 
            v-for="cat in categories" 
            :key="cat"
            @click="selectedCategory = cat"
            :class="[
              'px-4 py-2 rounded-lg text-sm font-semibold transition',
              selectedCategory === cat 
                ? 'bg-blue-600 text-white shadow' 
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            ]"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- Spinner -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500 font-medium">Cargando catálogo...</p>
      </div>

      <!-- Grilla de Servicios -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="service in filteredServices" 
          :key="service.id" 
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between"
        >
          <img :src="service.image" :alt="service.name" class="w-full h-48 object-cover" />
          
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <span class="text-xs bg-blue-100 text-blue-800 font-semibold px-2.5 py-0.5 rounded-full mb-2 inline-block">
                  {{ service.category || 'General' }}
                </span>
                <span class="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-0.5 rounded-full">
                  {{ service.duration }}
                </span>
              </div>
              <h3 class="font-bold text-lg text-gray-900 mb-1">{{ service.name }}</h3>
              <p class="text-gray-600 text-sm mb-4">{{ service.description }}</p>
            </div>

            <div class="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
              <span class="text-2xl font-bold text-gray-900">${{ formatCurrency(service.price) }}</span>
              <button 
                @click="openReservationModal(service)" 
                class="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg transition notranslate" 
                translate="no"
              >
                Reservar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Selección de Fecha y Amplios Horarios -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <h3 class="text-xl font-bold text-gray-900 mb-1">Agendar Turno</h3>
        <p class="text-sm text-gray-600 mb-4">
          Servicio: <strong>{{ selectedService?.name }}</strong><br>
          Precio: <strong>${{ formatCurrency(selectedService?.price) }}</strong>
        </p>

        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">1. Seleccionar Fecha</label>
            <input 
              type="date" 
              v-model="selectedDate" 
              class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500" 
            />
          </div>

          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">2. Horario Disponible (22 Turnos)</label>
            <select 
              v-model="selectedTime" 
              class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option v-for="slot in TIME_SLOTS" :key="slot" :value="slot">
                {{ slot }}
              </option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button @click="closeModal" class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium">
            Cancelar
          </button>
          <button 
            @click="confirmBooking" 
            class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium notranslate" 
            translate="no"
          >
            Confirmar Reserva
          </button>
        </div>
      </div>
    </div>
  </div>
</template>