import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    error: null,
  }),
  actions: {
    async login(credentials) {
      this.error = null;
      try {
        const response = await api.post('/auth/login', credentials);
        this.token = response.data.access_token || response.data.token;
        
        localStorage.setItem('token', this.token);

        // Guardar la información del usuario logueado
        this.user = response.data.user || {
          email: credentials.email || credentials.username,
          full_name: 'Máximo Mura'
        };

        localStorage.setItem('user', JSON.stringify(this.user));
        return true;
      } catch (err) {
        this.error = err.response?.data?.detail || 'Error de conexión con el servidor.';
        throw err;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});