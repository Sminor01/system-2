import { createRouter, createWebHistory } from 'vue-router'
import store from '../store'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: () => import('../views/Tasks.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: () => import('../views/Statistics.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = store.getters.isAuthenticated
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (!requiresAuth && isAuthenticated) {
    next('/')
  } else {
    next()
  }
})

export default router
