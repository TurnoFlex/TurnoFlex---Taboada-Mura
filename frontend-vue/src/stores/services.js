import { defineStore } from 'pinia';
import api from '../api/axios';

export const useServicesStore = defineStore('services', {
  state: () => ({
    services: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchServices() {
      this.loading = true;
      this.error = null;
      try {
        let res;
        try {
          res = await api.get('/services');
        } catch (e) {
          res = await api.get('/services/');
        }
        
        const data = res.data;
        if (Array.isArray(data)) {
          this.services = data;
        } else if (data && typeof data === 'object') {
          this.services = data.services || data.items || data.data || data.results || [];
        } else {
          this.services = [];
        }
      } catch (err) {
        this.error = err.response?.data?.detail || err.response?.data?.message || err.message;
      } finally {
        this.loading = false;
      }
    },
    async createService(serviceData) {
      await api.post('/services', serviceData);
      await this.fetchServices();
    }
  }
});