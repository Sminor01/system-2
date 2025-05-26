<template>
  <div class="register-container">
    <div class="register-form">
      <h2>Регистрация</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label for="firstName">Имя</label>
          <input
            type="text"
            id="firstName"
            v-model="firstName"
            required
            placeholder="Введите ваше имя"
          />
        </div>
        <div class="form-group">
          <label for="lastName">Фамилия</label>
          <input
            type="text"
            id="lastName"
            v-model="lastName"
            required
            placeholder="Введите вашу фамилию"
          />
        </div>
        <div class="form-group">
          <label for="secondName">Отчество</label>
          <input
            type="text"
            id="secondName"
            v-model="secondName"
            placeholder="Введите ваше отчество (необязательно)"
          />
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            required
            placeholder="Введите ваш email"
          />
        </div>
        <div class="form-group">
          <label for="password">Пароль</label>
          <input
            type="password"
            id="password"
            v-model="password"
            required
            placeholder="Введите пароль"
          />
        </div>
        <div class="form-group">
          <label for="confirmPassword">Подтверждение пароля</label>
          <input
            type="password"
            id="confirmPassword"
            v-model="confirmPassword"
            required
            placeholder="Подтвердите пароль"
          />
        </div>
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Регистрация...' : 'Зарегистрироваться' }}
        </button>
        <p class="login-link">
          Уже есть аккаунт?
          <router-link to="/login">Войти</router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const store = useStore();
const router = useRouter();

const firstName = ref('');
const lastName = ref('');
const secondName = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const loading = ref(false);
const error = ref('');

const handleRegister = async () => {
  if (password.value !== confirmPassword.value) {
    error.value = 'Пароли не совпадают';
    return;
  }

  try {
    loading.value = true;
    error.value = '';
    await store.dispatch('register', {
      firstName: firstName.value,
      lastName: lastName.value,
      secondName: secondName.value,
      email: email.value,
      password: password.value
    });
    router.push('/');
  } catch (err) {
    error.value = err.response?.data?.error || 'Ошибка при регистрации';
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.register-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-form h2 {
  text-align: center;
  color: #333;
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-group input:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

button:hover {
  background-color: #1565c0;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.error-message {
  color: #d32f2f;
  margin-bottom: 1rem;
  text-align: center;
}

.login-link {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.login-link a {
  color: #1976d2;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style> 