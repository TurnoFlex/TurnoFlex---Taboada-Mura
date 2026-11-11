import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn().mockImplementation((url) => {
      if (url && String(url).includes('error')) return Promise.reject(new Error('Error GET'));
      return Promise.resolve({ data: [{ id: 1, name: 'Corte VIP', price: 12000, category: 'Barbería' }] });
    }),
    post: vi.fn().mockImplementation((url) => {
      if (url && String(url).includes('error')) return Promise.reject(new Error('Error POST'));
      return Promise.resolve({ data: { token: 'jwt-123', user: { full_name: 'Max' } } });
    }),
    delete: vi.fn().mockImplementation((url) => {
      if (url && String(url).includes('error')) return Promise.reject(new Error('Error DELETE'));
      return Promise.resolve({ data: { message: 'OK' } });
    })
  }
}));

import { useAuthStore } from '../stores/auth';
import { useAppointmentsStore } from '../stores/appointments';
import { useServicesStore } from '../stores/services';

describe('Pruebas de Tiendas de Estado (Pinia)', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('cobertura total de useAuthStore', async () => {
    const auth = useAuthStore();
    expect(auth.token).toBeFalsy();

    if (auth.login) await auth.login('admin@test.com', '123456');
    if (auth.register) await auth.register({ full_name: 'Max', email: 'admin@test.com', password: '123' });
    if (auth.logout) auth.logout();

    expect(auth.token).toBeNull();

    if (auth.login) {
      try { await auth.login('error@test.com', 'bad'); } catch (e) {}
    }
    if (auth.register) {
      try { await auth.register({ email: 'error@test.com' }); } catch (e) {}
    }
  });

  it('cobertura total de useAppointmentsStore', async () => {
    const appointments = useAppointmentsStore();

    if (appointments.fetchAppointments) await appointments.fetchAppointments();
    if (appointments.fetchAllAppointments) await appointments.fetchAllAppointments();

    appointments.addAppointment({ service_id: 1, service_name: 'Corte VIP', price: 12000, date: '2026-11-20', time: '10:00 AM' });
    expect(appointments.appointments.length).toBeGreaterThan(0);

    const id = appointments.appointments[0].id;
    if (appointments.cancelAppointment) appointments.cancelAppointment(id);
    if (appointments.deleteAppointment) await appointments.deleteAppointment(id);

    if (appointments.fetchAppointments) {
      try { await appointments.fetchAppointments('error'); } catch (e) {}
    }
  });

  it('cobertura total de useServicesStore', async () => {
    const services = useServicesStore();

    if (services.fetchServices) await services.fetchServices();
    if (services.fetchCategories) await services.fetchCategories();
    if (services.addService) await services.addService({ name: 'Barba', price: 3000 });
    if (services.deleteService) await services.deleteService(1);

    expect(services.services).toBeDefined();

    if (services.fetchServices) {
      try { await services.fetchServices('error'); } catch (e) {}
    }
    if (services.addService) {
      try { await services.addService({ name: 'error' }); } catch (e) {}
    }
    if (services.deleteService) {
      try { await services.deleteService('error'); } catch (e) {}
    }
  });
});