<template>
  <v-app>
    <v-main>
      <v-container
        fluid
        fill-height
        class="auth-container"
      >
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            cols="12"
            sm="8"
            md="6"
            lg="4"
          >
            <v-card class="elevation-12">
              <v-toolbar
                color="primary"
                dark
                flat
              >
                <v-toolbar-title>
                  {{ $route.meta.title }}
                </v-toolbar-title>
              </v-toolbar>
              <v-card-text>
                <v-alert
                  v-if="error"
                  type="error"
                  dismissible
                  @input="clearError"
                >
                  {{ error }}
                </v-alert>
                <router-view />
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'AuthLayout',

  computed: {
    ...mapState(['error'])
  },

  methods: {
    ...mapActions(['clearError'])
  }
};
</script>

<style scoped>
.auth-container {
  background: linear-gradient(to right, #1976d2, #64b5f6);
}
</style> 