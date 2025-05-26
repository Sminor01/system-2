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
      placeholder="Введите ваш email"
    />

    <v-text-field
      v-model="password"
      label="Пароль"
      type="password"
      :rules="passwordRules"
      required
      autocomplete="current-password"
      placeholder="Введите ваш пароль"
    />

    <v-btn
      type="submit"
      color="primary"
      block
      :loading="loading"
      :disabled="!valid || loading"
    >
      {{ loading ? 'Вход...' : 'Войти' }}
    </v-btn>

    <v-card-text class="text-center pt-4">
      <router-link
        :to="{ name: 'register' }"
        class="text-decoration-none"
      >
        Нет аккаунта? Зарегистрироваться
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
      v => !!v || 'Email обязателен',
      v => /.+@.+\..+/.test(v) || 'Email должен быть действительным'
    ],
    passwordRules: [
      v => !!v || 'Пароль обязателен',
      v => v.length >= 6 || 'Пароль должен содержать минимум 6 символов'
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