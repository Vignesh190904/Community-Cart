import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000' // Hardcoded to backend port 8000

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 second timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use(async (config) => {
  try {
    // Get the current session from Supabase
    const { data: { session } } = await import('../lib/supabase').then(m => m.supabase.auth.getSession())
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`
    }
  } catch (error) {
    console.warn('Failed to get auth token:', error)
  }
  return config
})

export const apiService = {
  // Auth
  loginVendor: async (email, password) => {
    const response = await api.post('/auth/vendor/login', { email, password })
    return response.data
  },

  // Products
  getProducts: async () => {
    const response = await api.get('/vendor/products')
    return response.data
  },

  addProduct: async (data) => {
    const response = await api.post('/vendor/products', data)
    return response.data
  },

  updateProduct: async (id, data) => {
    const response = await api.put(`/vendor/products/${id}`, data)
    return response.data
  },

  toggleProductAvailability: async (id) => {
    const response = await api.patch(`/vendor/products/${id}/toggle`)
    return response.data
  },

  getCategories: async (communityId) => {
    const response = await api.get(`/categories?community_id=${communityId}`)
    return response.data
  },

  // Orders
  getOrders: async () => {
    const response = await api.get('/vendor/orders')
    return response.data
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/vendor/orders/${orderId}/status`, { status })
    return response.data
  },
}
