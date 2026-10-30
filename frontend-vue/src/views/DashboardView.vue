<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = useRouter();
const authStore = useAuthStore();

// Información del usuario logueado
const currentUser = computed(() => {
  if (authStore.user) return authStore.user;
  const saved = localStorage.getItem('user');
  return saved ? JSON.parse(saved) : null;
});

const userName = computed(() => {
  if (currentUser.value?.full_name) return currentUser.value.full_name;
  if (currentUser.value?.name) return currentUser.value.name;
  return 'Máximo Mura';
});

const userEmail = computed(() => currentUser.value?.email || 'ms.mura@alumno.etec.um.edu.ar');

// Métricas de Turnos (Inician en 0)
const turnosReservados = computed(() => 0);
const turnosPendientes = computed(() => 0);
const turnosCompletados = computed(() => 0);

const goToCatalog = () => {
  router.push('/catalog');
};
</script>

<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Sidebar Lateral -->
    <aside class="w-64 bg-white border-r border-gray-200 p-4 flex flex-col justify-between">
      <div>
        <div class="flex items-center space-x-2 mb-8">
          <span class="text-2xl font-bold text-emerald-600">TurnoFlex</span>
        </div>
        <nav class="space-y-2">
          <router-link to="/dashboard" class="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-lg font-medium">
            Panel
          </router-link>
          <router-link to="/catalog" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            Catálogo
          </router-link>
          <router-link to="/my-appointments" class="flex items-center px-4 py-2 text-gray-600 hover:bg-gray-50 rounded-lg">
            Mis Turnos
          </router-link>
        </nav>
      </div>
    </aside>

    <!-- Contenido Principal -->
    <main class="flex-1 p-8 space-y-6">
      
      <!-- Cabecera de Bienvenida y Botón de Reserva -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <span class="text-xs font-semibold uppercase text-emerald-600 tracking-wider">BIENVENIDO</span>
          <h1 class="text-2xl font-bold text-gray-900">¡Hola, {{ userName }}!</h1>
          <p class="text-gray-500 text-sm">{{ userEmail }}</p>
        </div>
        <button 
          @click="goToCatalog"
          class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-5 py-2.5 rounded-lg shadow transition flex items-center gap-2 notranslate"
          translate="no"
        >
          + Reservar un Turno
        </button>
      </div>

      <!-- Resumen de Turnos -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Resumen de Mis Turnos</h2>
        <div class="grid grid-cols-3 gap-4 border-t border-gray-100 pt-4 text-center">
          <div>
            <p class="text-sm text-gray-500 notranslate" translate="no">Turnos Reservados</p>
            <p class="text-3xl font-bold text-gray-800">{{ turnosReservados }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 notranslate" translate="no">Pendientes</p>
            <p class="text-3xl font-bold text-amber-600">{{ turnosPendientes }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 notranslate" translate="no">Completados</p>
            <p class="text-3xl font-bold text-emerald-600">{{ turnosCompletados }}</p>
          </div>
        </div>
      </div>

      <!-- Sección de Próximos Turnos -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 class="text-lg font-bold text-gray-900 mb-4">Próximos Turnos</h2>
        <div class="text-center py-8 text-gray-500">
          <p class="mb-3">Aún no has realizado ninguna reserva de turno.</p>
          <button 
            @click="goToCatalog"
            class="text-blue-600 hover:underline font-medium text-sm"
          >
            Explorar Catálogo y Reservar
          </button>
        </div>
      </div>

    </main>
  </div>
</template>