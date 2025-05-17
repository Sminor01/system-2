import { createRouter, createWebHistory } from 'vue-router'
import Statistics from '../components/Statistics.vue'
import TaskList from '../components/TaskList.vue'
import Timer from '../components/Timer.vue'
import WorkerProfile from '../components/WorkerProfile.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Timer
  },
  {
    path: '/profile',
    name: 'Profile',
    component: WorkerProfile
  },
  {
    path: '/tasks',
    name: 'Tasks',
    component: TaskList
  },
  {
    path: '/statistics',
    name: 'Statistics',
    component: Statistics
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
