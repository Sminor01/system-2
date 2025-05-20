import Vue from 'vue';
import Vuex from 'vuex';
import api from '../services/api';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: null,
    token: localStorage.getItem('token'),
    workers: [],
    departments: [],
    positions: [],
    users: [],
    tasks: [],
    timeEntries: [],
    taskStatuses: [],
    taskPriorities: [],
    taskComplexities: [],
    loading: false,
    error: null
  },

  getters: {
    isAuthenticated: state => !!state.token,
    currentUser: state => state.user,
    getWorkerById: state => id => state.workers.find(w => w.id === id),
    getDepartmentById: state => id => state.departments.find(d => d.id === id),
    getPositionById: state => id => state.positions.find(p => p.id === id),
    getTaskById: state => id => state.tasks.find(t => t.id === id),
    getTimeEntryById: state => id => state.timeEntries.find(te => te.id === id)
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
    SET_WORKERS(state, workers) {
      state.workers = workers;
    },
    ADD_WORKER(state, worker) {
      state.workers.push(worker);
    },
    UPDATE_WORKER(state, updatedWorker) {
      const index = state.workers.findIndex(w => w.id === updatedWorker.id);
      if (index !== -1) {
        state.workers.splice(index, 1, updatedWorker);
      }
    },
    DELETE_WORKER(state, workerId) {
      state.workers = state.workers.filter(w => w.id !== workerId);
    },
    SET_DEPARTMENTS(state, departments) {
      state.departments = departments;
    },
    ADD_DEPARTMENT(state, department) {
      state.departments.push(department);
    },
    UPDATE_DEPARTMENT(state, updatedDepartment) {
      const index = state.departments.findIndex(d => d.id === updatedDepartment.id);
      if (index !== -1) {
        state.departments.splice(index, 1, updatedDepartment);
      }
    },
    DELETE_DEPARTMENT(state, departmentId) {
      state.departments = state.departments.filter(d => d.id !== departmentId);
    },
    SET_POSITIONS(state, positions) {
      state.positions = positions;
    },
    ADD_POSITION(state, position) {
      state.positions.push(position);
    },
    UPDATE_POSITION(state, updatedPosition) {
      const index = state.positions.findIndex(p => p.id === updatedPosition.id);
      if (index !== -1) {
        state.positions.splice(index, 1, updatedPosition);
      }
    },
    DELETE_POSITION(state, positionId) {
      state.positions = state.positions.filter(p => p.id !== positionId);
    },
    SET_USERS(state, users) {
      state.users = users;
    },
    SET_TASKS(state, tasks) {
      state.tasks = tasks;
    },
    SET_TIME_ENTRIES(state, timeEntries) {
      state.timeEntries = timeEntries;
    },
    SET_TASK_METADATA(state, { statuses, priorities, complexities }) {
      state.taskStatuses = statuses;
      state.taskPriorities = priorities;
      state.taskComplexities = complexities;
    },
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    }
  },

  actions: {
    // Auth actions
    async login({ commit }, credentials) {
      try {
        commit('SET_LOADING', true);
        const { token, user } = await api.auth.login(credentials);
        commit('SET_TOKEN', token);
        commit('SET_USER', user);
        return user;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async register({ commit }, userData) {
      try {
        commit('SET_LOADING', true);
        const { token, user } = await api.auth.register(userData);
        commit('SET_TOKEN', token);
        commit('SET_USER', user);
        return user;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async logout({ commit }) {
      commit('SET_TOKEN', null);
      commit('SET_USER', null);
    },

    async fetchProfile({ commit }) {
      try {
        commit('SET_LOADING', true);
        const user = await api.auth.getProfile();
        commit('SET_USER', user);
        return user;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Worker actions
    async fetchWorkers({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { workers } = await api.workers.getAll();
        commit('SET_WORKERS', workers);
        return workers;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createWorker({ commit }, workerData) {
      try {
        commit('SET_LOADING', true);
        const worker = await api.workers.create(workerData);
        commit('ADD_WORKER', worker);
        return worker;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateWorker({ commit }, { id, data }) {
      try {
        commit('SET_LOADING', true);
        const worker = await api.workers.update(id, data);
        commit('UPDATE_WORKER', worker);
        return worker;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteWorker({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        await api.workers.delete(id);
        commit('DELETE_WORKER', id);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Department actions
    async fetchDepartments({ commit }) {
      try {
        commit('SET_LOADING', true);
        const departments = await api.departments.getAll();
        commit('SET_DEPARTMENTS', departments);
        return departments;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createDepartment({ commit }, departmentData) {
      try {
        commit('SET_LOADING', true);
        const department = await api.departments.create(departmentData);
        commit('ADD_DEPARTMENT', department);
        return department;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updateDepartment({ commit }, { id, data }) {
      try {
        commit('SET_LOADING', true);
        const department = await api.departments.update(id, data);
        commit('UPDATE_DEPARTMENT', department);
        return department;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deleteDepartment({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        await api.departments.delete(id);
        commit('DELETE_DEPARTMENT', id);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Position actions
    async fetchPositions({ commit }) {
      try {
        commit('SET_LOADING', true);
        const positions = await api.positions.getAll();
        commit('SET_POSITIONS', positions);
        return positions;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async createPosition({ commit }, positionData) {
      try {
        commit('SET_LOADING', true);
        const position = await api.positions.create(positionData);
        commit('ADD_POSITION', position);
        return position;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async updatePosition({ commit }, { id, data }) {
      try {
        commit('SET_LOADING', true);
        const position = await api.positions.update(id, data);
        commit('UPDATE_POSITION', position);
        return position;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async deletePosition({ commit }, id) {
      try {
        commit('SET_LOADING', true);
        await api.positions.delete(id);
        commit('DELETE_POSITION', id);
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // User actions
    async fetchUsers({ commit }) {
      try {
        commit('SET_LOADING', true);
        const users = await api.users.getAll();
        commit('SET_USERS', users);
        return users;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Task actions
    async fetchTasks({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { tasks } = await api.tasks.getAll();
        commit('SET_TASKS', tasks);
        return tasks;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    async fetchTaskMetadata({ commit }) {
      try {
        commit('SET_LOADING', true);
        const metadata = await api.tasks.getMetadata();
        commit('SET_TASK_METADATA', metadata);
        return metadata;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    },

    // Time entry actions
    async fetchTimeEntries({ commit }) {
      try {
        commit('SET_LOADING', true);
        const { timeEntries } = await api.timeEntries.getAll();
        commit('SET_TIME_ENTRIES', timeEntries);
        return timeEntries;
      } catch (error) {
        commit('SET_ERROR', error.message);
        throw error;
      } finally {
        commit('SET_LOADING', false);
      }
    }
  }
}); 