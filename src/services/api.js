import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async register(userData) {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
};

export const taskService = {
  async getAllTasks() {
    const response = await api.get('/tasks');
    return response.data;
  },

  async createTask(taskData) {
    const response = await api.post('/tasks', taskData);
    return response.data;
  },

  async updateTask(id, taskData) {
    const response = await api.put(`/tasks/${id}`, taskData);
    return response.data;
  },

  async deleteTask(id) {
    const response = await api.delete(`/tasks/${id}`);
    return response.data;
  }
};

export const timeEntryService = {
  async getAllTimeEntries() {
    const response = await api.get('/time-entries');
    return response.data;
  },

  async createTimeEntry(entryData) {
    const response = await api.post('/time-entries', entryData);
    return response.data;
  },

  async updateTimeEntry(id, entryData) {
    const response = await api.put(`/time-entries/${id}`, entryData);
    return response.data;
  },

  async deleteTimeEntry(id) {
    const response = await api.delete(`/time-entries/${id}`);
    return response.data;
  },

  async getTimeEntriesByTask(taskId) {
    const response = await api.get(`/time-entries/task/${taskId}`);
    return response.data;
  }
};

export const workerService = {
  async getAllWorkers() {
    const response = await api.get('/workers');
    return response.data;
  },

  async createWorker(workerData) {
    const response = await api.post('/workers', workerData);
    return response.data;
  },

  async updateWorker(id, workerData) {
    const response = await api.put(`/workers/${id}`, workerData);
    return response.data;
  },

  async deleteWorker(id) {
    const response = await api.delete(`/workers/${id}`);
    return response.data;
  }
};

export default api; 