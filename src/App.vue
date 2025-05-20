<template>
  <div id="app">
    <Sidebar v-if="isAuthenticated" />
    <router-view />
  </div>
</template>

<script setup>
import Sidebar from '@/components/Sidebar.vue';
import { computed } from 'vue';
import { useStore } from 'vuex';

const store = useStore();
const isAuthenticated = computed(() => store.getters.isAuthenticated);
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  min-height: 100vh;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  margin: 0;
  padding: 0;
  background-color: #f5f5f5;
}
</style>
