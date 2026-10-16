<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 p-4">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center text-gray-800">Crear Cuenta</h2>

      <div v-if="errorMessage" class="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
        {{ errorMessage }}
      </div>

      <div v-if="successMessage" class="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
        {{ successMessage }}
      </div>

      <form @submit.prevent="handleRegister" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nombre Completo</label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="Juan Pérez"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Correo Electrónico</label>
          <input
            v-model="email"
            type="email"
            required
            placeholder="ejemplo@correo.com"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <input
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Confirmar Contraseña</label>
          <input
            v-model="confirmPassword"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50"
        >
          {{ loading ? 'Registrando...' : 'Registrarse' }}
        </button>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        ¿Ya tienes cuenta?
        <router-link to="/login" class="text-blue-600 hover:underline">Inicia sesión</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const errorMessage = ref('')
const successMessage = ref('')
const loading = ref(false)

const handleRegister = async () => {
  errorMessage.value = ''
  successMessage.value = ''

  if (password.value !== confirmPassword.value) {
    errorMessage.value = 'Las contraseñas no coinciden.'
    return
  }

  loading.value = true
  try {
    await api.post('/auth/register', {
      name: name.value,
      email: email.value,
      password: password.value
    })

    successMessage.value = 'Registro exitoso. Redirigiendo al inicio de sesión...'
    setTimeout(() => {
      router.push('/login')
    }, 1500)
  } catch (error) {
    errorMessage.value = error.response?.data?.message || 'Error al registrar el usuario.'
  } finally {
    loading.value = false
  }
}
</script>