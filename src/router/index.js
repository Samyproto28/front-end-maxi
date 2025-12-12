import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: () => import('../pages/DashboardPage.vue')
    },
    {
      path: '/cargar-telegrama',
      name: 'CargaTelegrama',
      component: () => import('../pages/CargaTelegramaPage.vue')
    },
    {
      path: '/resultados/provincial',
      name: 'ResultadosProvincial',
      component: () => import('../views/ResultadosProvincial.vue')
    },
    {
      path: '/resultados/nacional',
      name: 'ResultadosNacional',
      component: () => import('../views/ResultadosNacional.vue')
    },
    {
      path: '/configuracion',
      name: 'Configuracion',
      component: () => import('../pages/ConfiguracionPage.vue')
    }
  ],
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

export default router
