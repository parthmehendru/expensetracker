import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token if needed
api.interceptors.request.use((config) => {
  // Add idempotency key for POST requests
  if (config.method?.toLowerCase() === 'post' && !config.headers['Idempotency-Key']) {
    const idempotencyKey = localStorage.getItem('lastIdempotencyKey') || crypto.randomUUID();
    config.headers['Idempotency-Key'] = idempotencyKey;
    localStorage.setItem('lastIdempotencyKey', idempotencyKey);
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      throw new Error('Request timeout. Please check your connection.');
    }
    if (!error.response) {
      throw new Error('Network error. Please check your connection.');
    }
    throw error;
  }
);

export const expenseApi = {
  create: (data: any) => api.post('/expenses', data),
  getAll: (params?: { category?: string; sort?: string }) => 
    api.get('/expenses', { params }),
  getCategories: () => api.get('/expenses/categories'),
};