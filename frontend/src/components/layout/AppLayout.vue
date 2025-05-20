<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :to="item.path"
          link
        >
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      clipped-left
      color="primary"
      dark
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
      <v-toolbar-title>Time Tracker</v-toolbar-title>
      <v-spacer />
      <v-menu
        v-if="isAuthenticated"
        offset-y
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar size="32">
              <v-img
                :src="userAvatar"
                :alt="currentUser?.fullName || 'User'"
              />
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item to="/profile">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Profile</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          <v-list-item @click="logout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Logout</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <v-alert
          v-if="error"
          type="error"
          dismissible
          @input="clearError"
        >
          {{ error }}
        </v-alert>
        <router-view />
      </v-container>
    </v-main>

    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }} Time Tracker</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'AppLayout',

  data: () => ({
    drawer: null,
    menuItems: [
      {
        title: 'Dashboard',
        path: '/',
        icon: 'mdi-view-dashboard'
      },
      {
        title: 'Tasks',
        path: '/tasks',
        icon: 'mdi-format-list-checks'
      },
      {
        title: 'Workers',
        path: '/workers',
        icon: 'mdi-account-group'
      },
      {
        title: 'Departments',
        path: '/departments',
        icon: 'mdi-domain'
      },
      {
        title: 'Positions',
        path: '/positions',
        icon: 'mdi-badge-account'
      }
    ]
  }),

  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser']),
    ...mapState(['error']),

    userAvatar() {
      // You can implement user avatar logic here
      // For now, return a default avatar
      return 'https://www.gravatar.com/avatar/default?s=200&d=mp';
    }
  },

  methods: {
    ...mapActions(['logout', 'clearError']),

    async handleLogout() {
      try {
        await this.logout();
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    }
  }
};
</script>

<style scoped>
.v-main {
  background-color: #f5f5f5;
}
</style> 