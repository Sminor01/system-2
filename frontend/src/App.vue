<template>
  <div id="app">
    <app-layout v-if="isAuthenticated" />
    <router-view v-else />
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import AppLayout from './components/layout/AppLayout.vue';

export default {
  name: 'App',

  components: {
    AppLayout
  },

  computed: {
    ...mapGetters(['isAuthenticated'])
  },

  created() {
    // Initialize app data if authenticated
    if (this.isAuthenticated) {
      this.initializeAppData();
    }
  },

  methods: {
    async initializeAppData() {
      try {
        // Fetch initial data needed for the app
        await Promise.all([
          this.$store.dispatch('fetchTaskMetadata'),
          this.$store.dispatch('fetchDepartments'),
          this.$store.dispatch('fetchPositions')
        ]);
      } catch (error) {
        console.error('Failed to initialize app data:', error);
      }
    }
  },

  watch: {
    isAuthenticated(newValue) {
      if (newValue) {
        this.initializeAppData();
      }
    }
  }
};
</script>

<style>
#app {
  font-family: 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  height: 100vh;
}

/* Global styles */
.v-application {
  font-family: 'Roboto', sans-serif !important;
}

.v-application .headline {
  font-family: 'Roboto', sans-serif !important;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}
</style> 