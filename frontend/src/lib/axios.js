import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import { useLoadingStore } from '../store/loadingStore';

// Gunakan hostname yang sama dengan frontend tapi arahkan ke port 8000 (backend Laravel)
// Jika diakses dari HP via IP lokal (misal: 192.168.x.x), ini akan otomatis mengarah ke 192.168.x.x:8000
const baseApiUrl = window.location.hostname === 'localhost' || window.location.hostname.match(/^[0-9.]+$/)
  ? `http://${window.location.hostname}:8000` 
  : ''; // Jika production di hosting, gunakan relative path

const baseURL = `${baseApiUrl}/api`;

export const getStorageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  const cleanPath = path.startsWith('/storage/')
    ? path.substring(9)
    : path.startsWith('storage/')
    ? path.substring(8)
    : path.startsWith('/')
    ? path.substring(1)
    : path;
  return `${baseApiUrl}/storage/${cleanPath}`;
};

export const getPublicUrl = (path) => {
  if (!path) return null;
  return `${baseApiUrl}/${path}`;
};

const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

api.interceptors.request.use((config) => {
    useLoadingStore.getState().startLoading();
    const store = useAuthStore.getState();
    if (store.token) {
        config.headers.Authorization = `Bearer ${store.token}`;
    }
    if (store.originalAdmin && store.user) {
        config.headers['X-Impersonate-User-Id'] = store.user.id;
    }
    return config;
}, (error) => {
  useLoadingStore.getState().stopLoading();
  return Promise.reject(error);
});

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    useLoadingStore.getState().stopLoading();
    return response;
  },
  (error) => {
    useLoadingStore.getState().stopLoading();
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
