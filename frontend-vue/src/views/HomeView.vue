<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-3xl font-bold text-gray-800">Panel Principal</h1>
        <button
          @click="handleLogout"
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition"
        >
          Cerrar Sesión
        </button>
      </div>

      <div class="bg-blue-50 p-4 rounded-md border border-blue-200">
        <h2 class="text-xl font-semibold text-blue-900 mb-2">Bienvenido/a</h2>
        <p class="text-blue-800"><strong>Email:</strong> {{ authStore.user?.email }}</p>
        <p class="text-blue-800"><strong>Rol:</strong> {{ authStore.user?.role }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>