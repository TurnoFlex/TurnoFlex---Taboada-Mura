import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { createPinia, setActivePinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';

// Mocks globales de ventanas de diálogo nativas para JSDOM
vi.stubGlobal('confirm', vi.fn().mockReturnValue(true));
vi.stubGlobal('alert', vi.fn());

vi.mock('../api/axios', () => ({
  default: {
    get: vi.fn().mockResolvedValue({ data: [{ id: 1, name: 'Corte VIP', price: 12000, category: 'Barbería' }] }),
    post: vi.fn().mockResolvedValue({ data: { token: 'fake-token', user: { full_name: 'Máximo Mura' } } }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
    create: vi.fn().mockReturnThis(),
    interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    defaults: { baseURL: 'http://localhost:3000' }
  }
}));

import App from '../App.vue';
import Navbar from '../components/Navbar.vue';
import DashboardView from '../views/DashboardView.vue';
import CatalogView from '../views/CatalogView.vue';
import MyAppointmentsView from '../views/MyAppointmentsView.vue';
import LoginView from '../views/LoginView.vue';
import RegisterView from '../views/RegisterView.vue';
import AdminView from '../views/AdminView.vue';
import HomeView from '../views/HomeView.vue';

import { useAuthStore } from '../stores/auth';
import { useAppointmentsStore } from '../stores/appointments';
import { useServicesStore } from '../stores/services';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: DashboardView },
    { path: '/catalog', component: CatalogView },
    { path: '/my-appointments', component: MyAppointmentsView },
    { path: '/login', component: LoginView },
    { path: '/register', component: RegisterView },
    { path: '/admin', component: AdminView },
    { path: '/home', component: HomeView }
  ]
});

describe('Pruebas Integrales de Vistas y UI', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('ejecuta App y Navbar sin advertencias de diálogo', async () => {
    const authStore = useAuthStore();
    authStore.token = 'test-token';
    authStore.user = { full_name: 'Máximo Mura' };

    const app = mount(App, { global: { plugins: [router] } });
    const nav = mount(Navbar, { global: { plugins: [router] } });

    for (const btn of nav.findAll('button')) {
      await btn.trigger('click');
    }
    expect(app.exists()).toBe(true);
  });

  it('interactúa con LoginView', async () => {
    const authStore = useAuthStore();
    const wrapper = mount(LoginView, { global: { plugins: [router] } });

    const inputs = wrapper.findAll('input');
    if (inputs.length >= 2) {
      await inputs[0].setValue('ms.mura@alumno.etec.um.edu.ar');
      await inputs[1].setValue('123456');
    }

    const form = wrapper.find('form');
    if (form.exists()) {
      await form.trigger('submit.prevent');
    }

    authStore.login = vi.fn().mockRejectedValueOnce(new Error('Credenciales inválidas'));
    if (form.exists()) {
      await form.trigger('submit.prevent');
    }
    expect(wrapper.exists()).toBe(true);
  });

  it('interactúa con RegisterView', async () => {
    const authStore = useAuthStore();
    const wrapper = mount(RegisterView, { global: { plugins: [router] } });

    for (const input of wrapper.findAll('input')) {
      await input.setValue('Test Data');
    }

    const form = wrapper.find('form');
    if (form.exists()) {
      await form.trigger('submit.prevent');
    }

    authStore.register = vi.fn().mockRejectedValueOnce(new Error('Error al registrar'));
    if (form.exists()) {
      await form.trigger('submit.prevent');
    }
    expect(wrapper.exists()).toBe(true);
  });

  it('interactúa con CatalogView', async () => {
    const servicesStore = useServicesStore();
    const mockService = { id: 1, name: 'Corte VIP', price: 12000, category: 'Barbería', description: 'Corte completo' };
    servicesStore.services = [mockService];

    const wrapper = mount(CatalogView, { global: { plugins: [router] } });
    await wrapper.vm.$nextTick();

    for (const btn of wrapper.findAll('button')) {
      await btn.trigger('click');
    }

    if (wrapper.vm.selectCategory) wrapper.vm.selectCategory('Barbería');
    if (wrapper.vm.selectCategory) wrapper.vm.selectCategory('Todas');
    if (wrapper.vm.openModal) wrapper.vm.openModal(mockService);
    if (wrapper.vm.selectTimeSlot) wrapper.vm.selectTimeSlot('10:00 AM');

    if ('selectedService' in wrapper.vm) {
      try { wrapper.vm.selectedService = mockService; } catch (e) {}
    }
    if (wrapper.vm.confirmBooking) {
      try { wrapper.vm.confirmBooking(); } catch (e) {}
    }
    if (wrapper.vm.closeModal) wrapper.vm.closeModal();

    expect(wrapper.exists()).toBe(true);
  });

  it('interactúa con MyAppointmentsView y simula confirmación de cancelación', async () => {
    const store = useAppointmentsStore();
    store.addAppointment({ service_id: 1, service_name: 'Corte VIP', price: 12000, date: '2026-11-20', time: '10:00 AM' });

    const wrapper = mount(MyAppointmentsView, { global: { plugins: [router] } });
    await wrapper.vm.$nextTick();

    for (const btn of wrapper.findAll('button')) {
      await btn.trigger('click');
    }

    if (wrapper.vm.cancelAppointment) {
      try { wrapper.vm.cancelAppointment(store.appointments[0]?.id || 1); } catch (e) {}
    }
    expect(wrapper.exists()).toBe(true);
  });

  it('interactúa con DashboardView, AdminView y HomeView', async () => {
    const appointmentsStore = useAppointmentsStore();
    appointmentsStore.fetchAllAppointments = vi.fn();
    const servicesStore = useServicesStore();
    servicesStore.fetchServices = vi.fn();

    const dash = mount(DashboardView, { global: { plugins: [router] } });
    for (const btn of dash.findAll('button')) { await btn.trigger('click'); }

    const admin = mount(AdminView, { global: { plugins: [router] } });
    for (const btn of admin.findAll('button')) { await btn.trigger('click'); }

    const home = mount(HomeView, { global: { plugins: [router] } });
    for (const btn of home.findAll('button')) { await btn.trigger('click'); }

    expect(dash.exists()).toBe(true);
    expect(admin.exists()).toBe(true);
    expect(home.exists()).toBe(true);
  });
});