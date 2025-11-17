// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/api/auth/login', credentials),
  register: (userData) => api.post('/api/auth/register', userData),
  getMe: () => api.get('/api/auth/me'),
};

// Products API
export const productsAPI = {
  getAll: (params = {}) => api.get('/api/products', { params }),
  getById: (id) => api.get(`/api/products/${id}`),
  getRelated: (id) => api.get(`/api/productdetails/${id}/related`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/api/categories'),
};

// Cart API
export const cartAPI = {
  get: () => api.get('/api/cart'),
  addItem: (item) => api.post('/api/cart/items', item),
  updateItem: (id, quantity) => api.put(`/api/cart/items/${id}`, { quantity }),
  removeItem: (id) => api.delete(`/api/cart/items/${id}`),
  clear: () => api.delete('/api/cart'),
};

// Orders API
export const ordersAPI = {
  create: () => api.post('/api/checkout'),
  getAll: () => api.get('/api/orders'),
  getById: (id) => api.get(`/api/orders/${id}`),
};

export default api;