<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

const router = useRouter();
const services = ref([]);
const loading = ref(true);
const selectedService = ref(null);
const isModalOpen = ref(false);

// Lista por defecto de Barbería
const fallbackServices = [
  {
    id: 1,
    name: 'Corte de Pelo Clásico / Fade',
    description: 'Corte personalizado según estilo, degradado a elección, perfilado a navaja y peinado profesional.',
    price: 8000,
    duration: '30 min',
    image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80'
  },
  {
    id: 2,
    name: 'Perfilado y Cuidado de Barba',
    description: 'Afeitado y perfilado con toalla caliente, aceites hidratantes y alineación de contornos.',
    price: 5000,
    duration: '20 min',
    image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&q=80'
  },
  {
    id: 3,
    name: 'Combo Barbería VIP (Corte + Barba)',
    description: 'Servicio completo: corte de pelo, arreglo de barba, lavado con masaje capilar y acabado con bálsamo.',
    price: 12000,
    duration: '50 min',
    image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=500&q=80'
  },
  {
    id: 4,
    name: 'Coloración / Global o Mechas',
    description: 'Decoloración, reflejos platinados o tintura uniforme utilizando productos protectores de alta gama.',
    price: 15000,
    duration: '60 min',
    image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=500&q=80'
  }
];

const fetchServices = async () => {
  loading.value = true;
  try {
    const response = await api.get('/services');
    if (response.data && response.data.length > 0) {
      services.value = response.data;
    } else {
      services.value = fallbackServices;
    }
  } catch (err) {
    services.value = fallbackServices;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchServices();
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
  alert(`¡Turno reservado con éxito para: ${selectedService.value.name}!`);
  closeModal();
  router.push('/my-appointments');
};
</script>

<template>
  <div class="min-h-screen bg-gray-100 p-8">
    <div class="max-w-6xl mx-auto">
      
      <!-- Encabezado -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Catálogo de Barbería</h1>
        <p class="text-gray-600 mt-1">Elegí tu servicio preferido y asegurá tu turno en TurnoFlex.</p>
      </div>

      <!-- Cargando -->
      <div v-if="loading" class="text-center py-12">
        <p class="text-gray-500 font-medium">Cargando catálogo...</p>
      </div>

      <!-- Grid de Servicios -->
      <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div 
          v-for="service in services" 
          :key="service.id" 
          class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition flex flex-col justify-between"
        >
          <img 
            :src="service.image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=500&q=80'" 
            :alt="service.name"
            class="w-full h-48 object-cover"
          />
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex justify-between items-start mb-2">
                <h3 class="font-bold text-lg text-gray-900">{{ service.name }}</h3>
                <span class="text-xs bg-emerald-100 text-emerald-800 font-semibold px-2.5 py-1 rounded-full whitespace-nowrap ml-2">
                  {{ service.duration || '30 min' }}
                </span>
              </div>
              <p class="text-gray-600 text-sm mb-4">
                {{ service.description }}
              </p>
            </div>

            <div class="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
              <span class="text-2xl font-bold text-gray-900">
                ${{ Number(service.price).toLocaleString('es-AR') }}
              </span>
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

    <!-- Modal de Reserva -->
    <div v-if="isModalOpen" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
        <h3 class="text-xl font-bold text-gray-900 mb-2">Reservar Turno</h3>
        <p class="text-sm text-gray-600 mb-4">
          Servicio: <strong>{{ selectedService?.name }}</strong><br>
          Precio: <strong>${{ Number(selectedService?.price).toLocaleString('es-AR') }}</strong>
        </p>

        <div class="space-y-4 mb-6">
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Seleccionar Fecha</label>
            <input type="date" class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label class="block text-xs font-semibold text-gray-600 mb-1">Horario Disponible</label>
            <select class="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-blue-500">
              <option>09:00 AM</option>
              <option>10:30 AM</option>
              <option>02:00 PM</option>
              <option>04:30 PM</option>
              <option>06:00 PM</option>
            </select>
          </div>
        </div>

        <div class="flex justify-end space-x-3">
          <button 
            @click="closeModal" 
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
          >
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