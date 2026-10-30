<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
const user = JSON.parse(localStorage.getItem('user') || '{}');

const handleLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>

<template>
  <nav class="bg-slate-800 text-white px-6 py-4 flex justify-between items-center shadow-md mb-6">
    <div class="flex items-center space-x-6">
      <span class="font-bold text-xl tracking-wide text-indigo-400">TurnoFlex</span>
      <router-link to="/" class="hover:text-indigo-300 font-medium">Catálogo</router-link>
      <router-link to="/my-appointments" class="hover:text-indigo-300 font-medium">Mis Turnos</router-link>
      <router-link 
        v-if="user.role === 'ADMIN'" 
        to="/admin" 
        class="hover:text-yellow-300 font-semibold text-yellow-400 border border-yellow-400 px-2 py-0.5 rounded text-sm"
      >
        Panel Admin
      </router-link>
    </div>

    <div class="flex items-center space-x-4">
      <span class="text-sm text-gray-300">{{ user.email }}</span>
      <button 
        @click="handleLogout" 
        class="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm font-medium transition"
      >
        Cerrar Sesión
      </button>
    </div>
  </nav>
</template>