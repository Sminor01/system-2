<template>
  <v-form
    ref="form"
    v-model="valid"
    @submit.prevent="handleSubmit"
  >
    <v-text-field
      v-model="email"
      label="Email"
      type="email"
      :rules="emailRules"
      required
      autocomplete="email"
    />

    <v-text-field
      v-model="password"
      label="Password"
      type="password"
      :rules="passwordRules"
      required
      autocomplete="current-password"
    />

    <v-btn
      type="submit"
      color="primary"
      block
      :loading="loading"
      :disabled="!valid || loading"
    >
      Login
    </v-btn>

    <v-card-text class="text-center pt-4">
      <router-link
        :to="{ name: 'register' }"
        class="text-decoration-none"
      >
        Don't have an account? Register
      </router-link>
    </v-card-text>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Login',

  data: () => ({
    valid: false,
    email: '',
    password: '',
    emailRules: [
      v => !!v || 'Email is required',
      v => /.+@.+\..+/.test(v) || 'Email must be valid'
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => v.length >= 6 || 'Password must be at least 6 characters'
    ]
  }),

  computed: {
    ...mapState(['loading', 'error'])
  },

  methods: {
    ...mapActions(['login']),

    async handleSubmit() {
      if (!this.$refs.form.validate()) return;

      try {
        await this.login({
          email: this.email,
          password: this.password
        });

        const redirect = this.$route.query.redirect || '/';
        this.$router.push(redirect);
      } catch (error) {
        // Error is handled by the store
      }
    }
  }
};
</script> 