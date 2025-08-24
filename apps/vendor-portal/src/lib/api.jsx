/**
 * Enhanced API client for vendor portal
 * Handles all HTTP requests with authentication and error handling
 */

import axios from 'axios';
import toast from 'react-hot-toast';
import { supabase } from './supabase';

const API_BASE_URL = 'http://localhost:8000'; // Hardcoded to backend port 8000

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    // Always read the latest session from Supabase
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      // Unauthorized - redirect to login
      window.location.href = '/login';
      return Promise.reject(error);
    }
    
    if (response?.status === 403) {
      toast.error('Access denied. You do not have permission to perform this action.');
    } else if (response?.status === 429) {
      toast.error('Too many requests. Please try again later.');
    } else if (response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (response?.data?.message) {
      toast.error(response.data.message);
    } else {
      toast.error('An unexpected error occurred');
    }
    
    return Promise.reject(error);
  }
);

// ========================================
// VENDOR API METHODS
// ========================================

export const vendorApi = {
  // Profile Management
  getProfile: () => api.get('/vendor/profile'),
  updateProfile: (data) => api.put('/vendor/profile', data),
  
  // Settings
  getSettings: () => api.get('/vendor/settings'),
  updateSettings: (data) => api.put('/vendor/settings', data),
  
  // Dashboard
  getDashboard: () => api.get('/vendor/dashboard'),
  getAnalytics: (params) => api.get('/vendor/analytics', { params }),
  
  // Products
  getProducts: (params) => api.get('/vendor/products', { params }),
  getProduct: (id) => api.get(`/vendor/products/${id}`),
  createProduct: (data) => api.post('/vendor/products', data),
  updateProduct: (id, data) => api.put(`/vendor/products/${id}`, data),
  deleteProduct: (id) => api.delete(`/vendor/products/${id}`),
  toggleProductAvailability: (id) => api.patch(`/vendor/products/${id}/toggle`),
  
  // Bulk Operations
  bulkUploadProducts: (data) => api.post('/vendor/products/bulk-upload', data),
  
  // Image Upload
  uploadProductImage: (formData) => api.post('/vendor/products/upload-image', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  }),
  
  // Categories
  getCategories: () => api.get('/vendor/categories'),
  
  // Orders
  getOrders: (params) => api.get('/vendor/orders', { params }),
  getOrder: (id) => api.get(`/vendor/orders/${id}`),
  updateOrderStatus: (id, data) => api.put(`/vendor/orders/${id}/status`, data),
  getOrderTimeline: (id) => api.get(`/vendor/orders/${id}/timeline`),
  
  // Health Check
  healthCheck: () => api.get('/vendor/health'),
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Handle API response and extract data
 */
export const handleApiResponse = (response) => {
  if (response.data?.success) {
    return response.data.data;
  }
  throw new Error(response.data?.message || 'API request failed');
};

/**
 * Handle API error and show appropriate message
 */
export const handleApiError = (error) => {
  console.error('API Error:', error);
  
  if (error.response?.data?.message) {
    throw new Error(error.response.data.message);
  } else if (error.message) {
    throw new Error(error.message);
  } else {
    throw new Error('An unexpected error occurred');
  }
};

/**
 * Create FormData for file uploads
 */
export const createFormData = (data) => {
  const formData = new FormData();
  
  Object.keys(data).forEach(key => {
    if (data[key] !== null && data[key] !== undefined) {
      if (data[key] instanceof File) {
        formData.append(key, data[key]);
      } else if (typeof data[key] === 'object') {
        formData.append(key, JSON.stringify(data[key]));
      } else {
        formData.append(key, data[key]);
      }
    }
  });
  
  return formData;
};

/**
 * Build query string from params object
 */
export const buildQueryString = (params) => {
  const searchParams = new URLSearchParams();
  
  Object.keys(params).forEach(key => {
    if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
      if (Array.isArray(params[key])) {
        params[key].forEach(value => searchParams.append(key, value));
      } else {
        searchParams.append(key, params[key]);
      }
    }
  });
  
  return searchParams.toString();
};

export default api;
