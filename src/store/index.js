import { authService, taskService, timeEntryService, workerService } from '@/services/api';
import { createStore } from 'vuex';

export default createStore({
  state: {
    user: null,
    token: localStorage.getItem('token') || null,
    tasks: [],
    timeEntries: [],
    workers: [],
    loading: false,
    error: null
  },

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    getTasks: state => state.tasks,
    getTimeEntries: state => state.timeEntries,
    getWorkers: state => state.workers,
    isLoading: state => state.loading,
    getError: state => state.error
  },

  mutations: {
    SET_USER(state, user) {
      state.user = user;
    },
    SET_TOKEN(state, token) {
      state.token = token;
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    SET_TIME_ENTRIES(state, entries) {
      state.timeEntries = entries;
    },
    SET_WORKERS(state, workers) {
      state.workers = workers;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_AUTH(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    }
  },

  actions: {
    async login({ commit }, credentials) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const data = await authService.login(credentials.email, credentials.password);
        commit('SET_USER', data.user);
        commit('SET_TOKEN', data.token);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Login failed');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async register({ commit }, userData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const data = await authService.register(userData);
        commit('SET_USER', data.user);
        commit('SET_TOKEN', data.token);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Registration failed');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    logout({ commit }) {
      authService.logout();
      commit('CLEAR_AUTH');
    },

    // Tasks
    async fetchTasks({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const tasks = await taskService.getAllTasks();
        commit('SET_TASKS', tasks);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch tasks');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createTask({ commit, dispatch }, taskData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        await taskService.createTask(taskData);
        await dispatch('fetchTasks');
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Failed to create task');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateTask({ commit, dispatch }, { id, taskData }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        await taskService.updateTask(id, taskData);
        await dispatch('fetchTasks');
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Failed to update task');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteTask({ commit, dispatch }, id) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        await taskService.deleteTask(id);
        await dispatch('fetchTasks');
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Failed to delete task');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Time Entries
    async fetchTimeEntries({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const entries = await timeEntryService.getAllTimeEntries();
        commit('SET_TIME_ENTRIES', entries);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch time entries');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createTimeEntry({ commit, dispatch }, entryData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        await timeEntryService.createTimeEntry(entryData);
        await dispatch('fetchTimeEntries');
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Failed to create time entry');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Workers
    async fetchWorkers({ commit }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        const workers = await workerService.getAllWorkers();
        commit('SET_WORKERS', workers);
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Failed to fetch workers');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createWorker({ commit, dispatch }, workerData) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        await workerService.createWorker(workerData);
        await dispatch('fetchWorkers');
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Failed to create worker');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateWorker({ commit, dispatch }, { id, workerData }) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        await workerService.updateWorker(id, workerData);
        await dispatch('fetchWorkers');
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Failed to update worker');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteWorker({ commit, dispatch }, id) {
      try {
        commit('SET_LOADING', true);
        commit('SET_ERROR', null);
        await workerService.deleteWorker(id);
        await dispatch('fetchWorkers');
      } catch (error) {
        commit('SET_ERROR', error.response?.data?.error || 'Failed to delete worker');
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  },

  modules: {
  }
})
