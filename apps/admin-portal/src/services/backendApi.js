import axios from 'axios'

// Backend API configuration
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

// Create axios instance with default config
const backendApi = axios.create({
  baseURL: BACKEND_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor to add auth token
backendApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
backendApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('admin_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Vendor Profile API functions
export const vendorProfileApi = {
  // Get vendor performance with optional month/year filters
  getVendorPerformance: async (vendorId, month = null, year = null) => {
    try {
      const params = {}
      if (month && year) {
        params.month = month
        params.year = year
      }
      
      const response = await backendApi.get(`/admin/vendors/${vendorId}/performance`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching vendor performance:', error)
      throw error
    }
  },

  // Get all orders for a vendor with pagination and filters
  getVendorOrders: async (vendorId, page = 1, limit = 20, status = null) => {
    try {
      const params = { page, limit }
      if (status) {
        params.status = status
      }
      
      const response = await backendApi.get(`/admin/vendors/${vendorId}/orders`, { params })
      return response.data
    } catch (error) {
      console.error('Error fetching vendor orders:', error)
      throw error
    }
  },

  // Get comprehensive vendor metrics
  getVendorMetrics: async (vendorId) => {
    try {
      const response = await backendApi.get(`/admin/vendors/${vendorId}/metrics`)
      return response.data
    } catch (error) {
      console.error('Error fetching vendor metrics:', error)
      throw error
    }
  },

  // Get vendor monthly revenue trend
  getVendorMonthlyRevenue: async (vendorId, dateRange = 'last_6_months') => {
    try {
      const response = await backendApi.get(`/admin/vendors/${vendorId}/revenue/monthly`, {
        params: { dateRange }
      })
      return response.data
    } catch (error) {
      console.error('Error fetching vendor monthly revenue:', error)
      throw error
    }
  }
}

// Utility functions for formatting
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount || 0)
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num || 0)
}

export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString) => {
  return new Date(dateString).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export default backendApi
