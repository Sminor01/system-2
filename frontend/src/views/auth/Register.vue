<template>
  <v-form
    ref="form"
    v-model="valid"
    @submit.prevent="handleSubmit"
  >
    <v-text-field
      v-model="firstName"
      label="First Name"
      :rules="nameRules"
      required
      autocomplete="given-name"
    />

    <v-text-field
      v-model="lastName"
      label="Last Name"
      :rules="nameRules"
      required
      autocomplete="family-name"
    />

    <v-text-field
      v-model="secondName"
      label="Second Name"
      autocomplete="additional-name"
    />

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
      autocomplete="new-password"
    />

    <v-text-field
      v-model="confirmPassword"
      label="Confirm Password"
      type="password"
      :rules="confirmPasswordRules"
      required
      autocomplete="new-password"
    />

    <v-btn
      type="submit"
      color="primary"
      block
      :loading="loading"
      :disabled="!valid || loading"
    >
      Register
    </v-btn>

    <v-card-text class="text-center pt-4">
      <router-link
        :to="{ name: 'login' }"
        class="text-decoration-none"
      >
        Already have an account? Login
      </router-link>
    </v-card-text>
  </v-form>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Register',

  data: () => ({
    valid: false,
    firstName: '',
    lastName: '',
    secondName: '',
    email: '',
    password: '',
    confirmPassword: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => v.length >= 2 || 'Name must be at least 2 characters'
    ],
    emailRules: [
      v => !!v || 'Email is required',
      v => /.+@.+\..+/.test(v) || 'Email must be valid'
    ],
    passwordRules: [
      v => !!v || 'Password is required',
      v => v.length >= 6 || 'Password must be at least 6 characters'
    ],
    confirmPasswordRules: [
      v => !!v || 'Please confirm your password',
      v => v === this.password || 'Passwords do not match'
    ]
  }),

  computed: {
    ...mapState(['loading', 'error'])
  },

  methods: {
    ...mapActions(['register']),

    async handleSubmit() {
      if (!this.$refs.form.validate()) return;

      try {
        await this.register({
          firstName: this.firstName,
          lastName: this.lastName,
          secondName: this.secondName,
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