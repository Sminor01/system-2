import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

// Layouts
import AuthLayout from '../layouts/AuthLayout.vue';
import DefaultLayout from '../layouts/DefaultLayout.vue';

// Auth views
import Login from '../views/auth/Login.vue';
import Register from '../views/auth/Register.vue';

// Main views
import Dashboard from '../views/Dashboard.vue';
import DepartmentList from '../views/DepartmentList.vue';
import PositionList from '../views/PositionList.vue';
import Profile from '../views/Profile.vue';
import TaskList from '../views/TaskList.vue';
import TimeEntryList from '../views/TimeEntryList.vue';
import WorkerList from '../views/WorkerList.vue';

const routes = [
  {
    path: '/',
    component: DefaultLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'dashboard',
        component: Dashboard,
        meta: { title: 'Dashboard' }
      },
      {
        path: 'workers',
        name: 'workers',
        component: WorkerList,
        meta: { title: 'Employees' }
      },
      {
        path: 'departments',
        name: 'departments',
        component: DepartmentList,
        meta: { title: 'Departments' }
      },
      {
        path: 'positions',
        name: 'positions',
        component: PositionList,
        meta: { title: 'Positions' }
      },
      {
        path: 'tasks',
        name: 'tasks',
        component: TaskList,
        meta: { title: 'Tasks' }
      },
      {
        path: 'time-entries',
        name: 'time-entries',
        component: TimeEntryList,
        meta: { title: 'Time Entries' }
      },
      {
        path: 'profile',
        name: 'profile',
        component: Profile,
        meta: { title: 'Profile' }
      }
    ]
  },
  {
    path: '/auth',
    component: AuthLayout,
    meta: { guest: true },
    children: [
      {
        path: 'login',
        name: 'login',
        component: Login,
        meta: { title: 'Login' }
      },
      {
        path: 'register',
        name: 'register',
        component: Register,
        meta: { title: 'Register' }
      }
    ]
  }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
});

// Navigation guards
router.beforeEach(async (to, from, next) => {
  // Set page title
  document.title = `${to.meta.title} - Task Management System`;

  // Check if route requires authentication
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Check if user is authenticated
    if (!store.getters.isAuthenticated) {
      // Try to restore session
      const token = localStorage.getItem('token');
      if (token) {
        try {
          await store.dispatch('fetchProfile');
          next();
          return;
        } catch (error) {
          // If token is invalid, clear it and redirect to login
          store.dispatch('logout');
        }
      }
      // Redirect to login if not authenticated
      next({ name: 'login', query: { redirect: to.fullPath } });
      return;
    }
  }

  // Check if route is for guests only
  if (to.matched.some(record => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      // Redirect to dashboard if already authenticated
      next({ name: 'dashboard' });
      return;
    }
  }

  next();
});

export default router; 