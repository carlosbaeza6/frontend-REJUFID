import AppLayout from '@/layout/AppLayout.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    component: AppLayout,
    children: [
      { path: '', redirect: { name: 'expedientes' } },

      {
        path: 'expedientes',
        name: 'expedientes',
        component: () => import('@/views/expedientes/ExpedientesList.vue')
      },
      {
        path: 'verificacion',
        name: 'verificacion',
        component: () => import('@/views/Documentos/VerificarDocumento.vue')
      },
      {
        path: 'usuarios',
        name: 'usuarios',
        component: () => import('@/views/Usuarios/UsuariosList.vue')
      }
    ]
  },
  {
    path: '/auth/login',
    name: 'login',
    component: () => import('@/views/pages/auth/Login.vue')
  },
  {
    path: '/auth/access',
    name: 'accessDenied',
    component: () => import('@/views/pages/auth/Access.vue')
  },
  {
    path: '/auth/error',
    name: 'error',
    component: () => import('@/views/pages/auth/Error.vue')
  },

  {
    path: '/:pathMatch(.*)*',
    redirect: '/expedientes'
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
