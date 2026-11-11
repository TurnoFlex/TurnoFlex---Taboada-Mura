import { defineStore } from 'pinia';
import api from '../api/axios';

export const useAppointmentsStore = defineStore('appointments', {
  state: () => ({
    appointments: JSON.parse(localStorage.getItem('turnoflex_appointments') || '[]'),
    loading: false,
    error: null
  }),
  actions: {
    async fetchAppointments() {
      this.loading = true;
      try {
        const response = await api.get('/appointments/my-appointments');
        if (response.data && response.data.length > 0) {
          this.appointments = response.data;
          localStorage.setItem('turnoflex_appointments', JSON.stringify(this.appointments));
        }
      } catch (err) {
        // Mantiene las reservas locales
      } finally {
        this.loading = false;
      }
    },
    addAppointment(appointmentData) {
      const newAppointment = {
        id: Date.now(),
        service_id: appointmentData.service_id,
        service_name: appointmentData.service_name,
        category: appointmentData.category || 'General',
        price: appointmentData.price,
        date: appointmentData.date,
        time: appointmentData.time,
        status: 'Pendiente',
        image: appointmentData.image,
        created_at: new Date().toLocaleDateString('es-AR')
      };

      this.appointments.unshift(newAppointment);
      localStorage.setItem('turnoflex_appointments', JSON.stringify(this.appointments));

      // Intento opcional de sincronizar con el backend
      api.post('/appointments', newAppointment).catch(() => {});
    },
    cancelAppointment(id) {
      this.appointments = this.appointments.filter(a => a.id !== id);
      localStorage.setItem('turnoflex_appointments', JSON.stringify(this.appointments));
    }
  }
});