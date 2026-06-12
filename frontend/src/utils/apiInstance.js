import axios from 'axios';
import API_URL from './api';

const api = axios.create({
  baseURL: API_URL,
});

// Interceptor to inject JWT token in every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
