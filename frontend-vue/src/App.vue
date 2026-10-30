<template>
  <div>
    <!-- Barra superior activa -->
    <nav v-if="showNavbar" class="bg-slate-900 text-white px-6 py-3 flex justify-between items-center shadow-md">
      <div class="flex items-center space-x-6">
        <router-link to="/dashboard" class="text-xl font-bold tracking-wide hover:text-emerald-400">TurnoFlex</router-link>
        <router-link to="/catalog" class="text-sm font-medium hover:text-emerald-400 transition-colors">Catálogo</router-link>
        <router-link to="/my-appointments" class="text-sm font-medium hover:text-emerald-400 transition-colors">Mis Turnos</router-link>
      </div>
      <button @click="handleLogout" class="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
        Cerrar Sesión
      </button>
    </nav>

    <!-- Contenido dinámico según la ruta activa -->
    <router-view />
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const showNavbar = computed(() => route.path !== '/login');

const handleLogout = () => {
  authStore.logout();
  router.push('/login');
};
</script>