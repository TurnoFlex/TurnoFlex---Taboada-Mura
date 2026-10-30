import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAppointmentsStore = defineStore('appointments', {
  state: () => ({
    myAppointments: [],
    allAppointments: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchMyAppointments() {
      this.loading = true;
      try {
        const res = await api.get('/appointments/my-appointments');
        this.myAppointments = res.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al obtener mis turnos';
      } finally {
        this.loading = false;
      }
    },
    async fetchAllAppointments() {
      this.loading = true;
      try {
        const res = await api.get('/appointments');
        this.allAppointments = res.data;
      } catch (err) {
        this.error = err.response?.data?.message || 'Error al cargar la agenda global';
      } finally {
        this.loading = false;
      }
    },
    async bookAppointment(appointmentData) {
      await api.post('/appointments', appointmentData);
    },
    async updateStatus(id, status) {
      await api.patch(`/appointments/${id}/status`, { status });
      await this.fetchAllAppointments();
    }
  }
});