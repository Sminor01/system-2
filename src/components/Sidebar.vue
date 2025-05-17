<template>
  <aside class="sidebar">
    <nav>
      <router-link to="/" class="nav-item">
        <span class="icon">⏱️</span>
        <span>Time Tracker</span>
      </router-link>
      <router-link to="/profile" class="nav-item">
        <span class="icon">👤</span>
        <span>Profile</span>
      </router-link>
      <router-link to="/tasks" class="nav-item">
        <span class="icon">📝</span>
        <span>Tasks</span>
      </router-link>
      <router-link to="/statistics" class="nav-item">
        <span class="icon">📊</span>
        <span>Statistics</span>
      </router-link>
    </nav>
  </aside>
</template>

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
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  transition: background 0.3s;
}

.nav-item:hover {
  background: #34495e;
}

.nav-item.router-link-active {
  background: #3498db;
}

.icon {
  font-size: 1.2rem;
}
</style> 