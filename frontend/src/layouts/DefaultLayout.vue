<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      app
      clipped
      :permanent="$vuetify.breakpoint.mdAndUp"
    >
      <v-list>
        <v-list-item
          v-for="item in menuItems"
          :key="item.path"
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
      <v-app-bar-nav-icon
        v-if="$vuetify.breakpoint.smAndDown"
        @click="drawer = !drawer"
      />
      <v-toolbar-title>Task Management System</v-toolbar-title>
      <v-spacer />
      <v-menu
        v-if="currentUser"
        offset-y
        left
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            text
            v-bind="attrs"
            v-on="on"
          >
            {{ currentUser.fullName }}
            <v-icon right>mdi-chevron-down</v-icon>
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
      <span>&copy; {{ new Date().getFullYear() }} Task Management System</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';

export default {
  name: 'DefaultLayout',

  data: () => ({
    drawer: null,
    menuItems: [
      { title: 'Dashboard', path: '/', icon: 'mdi-view-dashboard' },
      { title: 'Employees', path: '/workers', icon: 'mdi-account-group' },
      { title: 'Departments', path: '/departments', icon: 'mdi-domain' },
      { title: 'Positions', path: '/positions', icon: 'mdi-briefcase' },
      { title: 'Tasks', path: '/tasks', icon: 'mdi-clipboard-list' },
      { title: 'Time Entries', path: '/time-entries', icon: 'mdi-clock' }
    ]
  }),

  computed: {
    ...mapGetters(['isAuthenticated']),
    ...mapState(['error', 'user']),
    currentUser() {
      return this.user;
    }
  },

  methods: {
    ...mapActions(['logout', 'clearError']),
    async handleLogout() {
      await this.logout();
      this.$router.push('/auth/login');
    }
  }
};
</script> 