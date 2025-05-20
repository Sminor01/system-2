import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor for authentication
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response.data,
  error => {
    const message = error.response?.data?.message || 'An error occurred';
    return Promise.reject(new Error(message));
  }
);

export default {
  auth: {
    login: credentials => api.post('/api/auth/login', credentials),
    register: userData => api.post('/api/auth/register', userData),
    getProfile: () => api.get('/api/auth/profile')
  },

  workers: {
    getAll: (params = {}) => api.get('/api/workers', { params }),
    getById: id => api.get(`/api/workers/${id}`),
    create: workerData => api.post('/api/workers', workerData),
    update: (id, data) => api.put(`/api/workers/${id}`, data),
    delete: id => api.delete(`/api/workers/${id}`)
  },

  departments: {
    getAll: (params = {}) => api.get('/api/departments', { params }),
    getById: id => api.get(`/api/departments/${id}`),
    create: departmentData => api.post('/api/departments', departmentData),
    update: (id, data) => api.put(`/api/departments/${id}`, data),
    delete: id => api.delete(`/api/departments/${id}`)
  },

  positions: {
    getAll: (params = {}) => api.get('/api/positions', { params }),
    getById: id => api.get(`/api/positions/${id}`),
    create: positionData => api.post('/api/positions', positionData),
    update: (id, data) => api.put(`/api/positions/${id}`, data),
    delete: id => api.delete(`/api/positions/${id}`)
  },

  users: {
    getAll: (params = {}) => api.get('/api/users', { params }),
    getById: id => api.get(`/api/users/${id}`),
    create: userData => api.post('/api/users', userData),
    update: (id, data) => api.put(`/api/users/${id}`, data),
    delete: id => api.delete(`/api/users/${id}`)
  },

  tasks: {
    getAll: (params = {}) => api.get('/api/tasks', { params }),
    getById: id => api.get(`/api/tasks/${id}`),
    create: taskData => api.post('/api/tasks', taskData),
    update: (id, data) => api.put(`/api/tasks/${id}`, data),
    delete: id => api.delete(`/api/tasks/${id}`),
    updateStatus: (id, statusId) => api.put(`/api/tasks/${id}/status`, { statusId }),
    getMetadata: () => api.get('/api/tasks/metadata')
  },

  timeEntries: {
    getAll: (params = {}) => api.get('/api/time-entries', { params }),
    getById: id => api.get(`/api/time-entries/${id}`),
    create: timeEntryData => api.post('/api/time-entries', timeEntryData),
    update: (id, data) => api.put(`/api/time-entries/${id}`, data),
    delete: id => api.delete(`/api/time-entries/${id}`),
    stopTimer: id => api.post(`/api/time-entries/${id}/stop`)
  }
}; 