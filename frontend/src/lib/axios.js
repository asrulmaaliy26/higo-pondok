import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const baseApiUrl = window.location.hostname === 'localhost' 
  ? 'http://localhost:8000' 
  : ''; // Jika production, gunakan relative path agar sesuai dengan domain saat ini

const baseURL = `${baseApiUrl}/api`;

export const getStorageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${baseApiUrl}/storage/${path}`;
};

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    const store = useAuthStore.getState();
    if (store.token) {
        config.headers.Authorization = `Bearer ${store.token}`;
    }
    if (store.originalAdmin && store.user) {
        config.headers['X-Impersonate-User-Id'] = store.user.id;
    }
    return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global Error Handling
    if (error.response && error.response.status === 401) {
      // Token tidak valid atau sesi habis
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('impersonated_user');
      
      // Redirect ke login hanya jika bukan sudah di halaman login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
