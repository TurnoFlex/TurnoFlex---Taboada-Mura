import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { jwtDecode } from 'jwt-decode'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user')) || null)

  const isAuthenticated = computed(() => !!token.value)
  const isAdmin = computed(() => user.value?.role === 'ADMIN')

  function setAuthData(newToken, userData) {
    token.value = newToken
    user.value = userData
    localStorage.setItem('token', newToken)
    localStorage.setItem('user', JSON.stringify(userData))
  }

  function logout() {
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return {
    token,
    user,
    isAuthenticated,
    isAdmin,
    setAuthData,
    logout
  }
})