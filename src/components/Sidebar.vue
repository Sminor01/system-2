<template>
  <aside class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="title-project">
      <span class="hide-title">TT</span>
      <h1 class="title" v-show="!isCollapsed">Time Tracker</h1>
    </div>
    <button class="toggle-btn" @click="toggleSidebar">
      {{ isCollapsed ? '→' : '←' }}
    </button>
    <nav>
      <router-link to="/" class="nav-item" :title="isCollapsed ? 'Time Tracker' : ''">
        <span class="icon">⏱️</span>
        <span class="nav-text" v-show="!isCollapsed">Time Tracker</span>
      </router-link>
      <router-link to="/profile" class="nav-item" :title="isCollapsed ? 'Profile' : ''">
        <span class="icon">👤</span>
        <span class="nav-text" v-show="!isCollapsed">Profile</span>
      </router-link>
      <router-link to="/tasks" class="nav-item" :title="isCollapsed ? 'Tasks' : ''">
        <span class="icon">📝</span>
        <span class="nav-text" v-show="!isCollapsed">Tasks</span>
      </router-link>
      <router-link to="/statistics" class="nav-item" :title="isCollapsed ? 'Statistics' : ''">
        <span class="icon">📊</span>
        <span class="nav-text" v-show="!isCollapsed">Statistics</span>
      </router-link>
      <button @click="handleLogout" class="nav-item logout-btn" :title="isCollapsed ? 'Logout' : ''">
        <span class="icon">🚪</span>
        <span class="nav-text" v-show="!isCollapsed">Logout</span>
      </button>
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const router = useRouter()
const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const handleLogout = () => {
  store.dispatch('logout')
  router.push('/login')
}
</script>

<style scoped>
.sidebar {
  width: 250px;
  background: #2c3e50;
  color: white;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  padding: 20px 0;
  transition: width 0.3s ease;
  overflow-x: hidden;
}

.sidebar.collapsed {
  width: 70px;
}

.title-project {
  display: flex;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
  align-items: center;
  text-align: center;
  gap: 10px;
  color: white;
  text-decoration: none;
  transition: background 0.3s;
  border: 5px solid #185fa7;
  border-radius: 6px;
  margin: 5px;
}

.title {
  margin: 10px 0px;
  color: white;
  transition: opacity 0.2s;
  font-size: 20px;
}

.toggle-btn {
  position: absolute;
  right: -12px;
  top: 20px;
  background: #2c3e50;
  border: 2px solid #185fa7;
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
  padding: 0;
  z-index: 1;
}

.toggle-btn:hover {
  background: #34495e;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  color: white;
  text-decoration: none;
  transition: background 0.3s;
  border-radius: 6px;
  white-space: nowrap;
}

.nav-item:hover {
  background: #34495e;
}

.nav-item.router-link-active {
  background: #3498db;
}

.icon {
  font-size: 1.2rem;
  min-width: 24px;
  text-align: center;
}

.nav-text {
  transition: opacity 0.2s;
}

.logout-btn {
  margin-top: auto;
  background: none;
  border: none;
  cursor: pointer;
  width: 100%;
  text-align: left;
  color: #e74c3c;
}

.logout-btn:hover {
  background: #34495e;
}
</style> 