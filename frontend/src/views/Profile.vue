<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="6" offset-md="3">
        <v-card>
          <v-card-title class="headline">
            Profile
          </v-card-title>

          <v-card-text>
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
                :disabled="loading"
              />

              <v-text-field
                v-model="lastName"
                label="Last Name"
                :rules="nameRules"
                required
                :disabled="loading"
              />

              <v-text-field
                v-model="secondName"
                label="Second Name"
                :disabled="loading"
              />

              <v-text-field
                v-model="email"
                label="Email"
                type="email"
                :rules="emailRules"
                required
                :disabled="loading"
              />

              <v-divider class="my-4" />

              <v-card-title class="subtitle-1">
                Change Password
              </v-card-title>

              <v-text-field
                v-model="currentPassword"
                label="Current Password"
                type="password"
                :rules="passwordRules"
                :disabled="loading"
              />

              <v-text-field
                v-model="newPassword"
                label="New Password"
                type="password"
                :rules="newPasswordRules"
                :disabled="loading"
              />

              <v-text-field
                v-model="confirmPassword"
                label="Confirm New Password"
                type="password"
                :rules="confirmPasswordRules"
                :disabled="loading"
              />

              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="!valid || loading"
              >
                Save Changes
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapActions, mapState } from 'vuex';

export default {
  name: 'Profile',

  data: () => ({
    valid: false,
    firstName: '',
    lastName: '',
    secondName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
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
      v => !v || v.length >= 6 || 'Password must be at least 6 characters'
    ],
    newPasswordRules: [
      v => !v || v.length >= 6 || 'Password must be at least 6 characters'
    ],
    confirmPasswordRules: [
      v => !v || v === this.newPassword || 'Passwords do not match'
    ]
  }),

  computed: {
    ...mapState(['loading', 'error', 'user'])
  },

  watch: {
    user: {
      immediate: true,
      handler(user) {
        if (user) {
          this.firstName = user.firstName;
          this.lastName = user.lastName;
          this.secondName = user.secondName || '';
          this.email = user.email;
        }
      }
    }
  },

  methods: {
    ...mapActions(['updateProfile']),

    async handleSubmit() {
      if (!this.$refs.form.validate()) return;

      const updateData = {
        firstName: this.firstName,
        lastName: this.lastName,
        secondName: this.secondName,
        email: this.email
      };

      if (this.newPassword) {
        if (!this.currentPassword) {
          this.$store.commit('SET_ERROR', 'Current password is required to change password');
          return;
        }
        updateData.currentPassword = this.currentPassword;
        updateData.newPassword = this.newPassword;
      }

      try {
        await this.updateProfile(updateData);
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.$store.commit('SET_ERROR', null);
      } catch (error) {
        // Error is handled by the store
      }
    }
  }
};
</script> 