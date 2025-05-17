<template>
  <div class="app">
    <Sidebar />
    <div class="main-content">
      <header>
        <h1>Time Tracker</h1>
      </header>
      <main>
        <router-view></router-view>
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue';
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f0f2f5;
}

.app {
  display: flex;
}

.main-content {
  flex: 1;
  margin-left: 250px;
  padding: 20px;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  color: #2c3e50;
  font-size: 2.5rem;
}

main {
  max-width: 1200px;
  margin: 0 auto;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
  
  .sidebar {
    transform: translateX(-100%);
    transition: transform 0.3s;
  }
  
  .sidebar.open {
    transform: translateX(0);
  }
}
</style>
