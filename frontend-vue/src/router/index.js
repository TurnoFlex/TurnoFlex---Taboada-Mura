import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import CatalogView from '../views/CatalogView.vue'
import MyAppointmentsView from '../views/MyAppointmentsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/dashboard', name: 'dashboard', component: DashboardView },
    { path: '/catalog', name: 'catalog', component: CatalogView },
    { path: '/services', redirect: '/catalog' },
    { path: '/my-appointments', name: 'my-appointments', component: MyAppointmentsView }
  ]
})

export default router