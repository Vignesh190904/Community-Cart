import axios from 'axios'

// Use environment variable for API base URL with fallback
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'

console.log('API Base URL:', API_BASE_URL) // Debug log

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // Increased timeout to 15 seconds
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add auth token to requests
api.interceptors.request.use((config) => {
  // Get admin token from localStorage
  const token = localStorage.getItem('admin_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  
  // Log request for debugging
  console.log(`API Request: ${config.method?.toUpperCase()} ${config.url}`, {
    headers: config.headers,
    data: config.data
  })
  
  return config
}, (error) => {
  console.error('Request interceptor error:', error)
  return Promise.reject(error)
})

// Add response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`, response.data)
    return response
  },
  (error) => {
    console.error('API Error:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method,
      data: error.response?.data,
      headers: error.response?.headers
    })
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      console.error('Authentication failed - redirecting to login')
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      window.location.href = '/login'
    }
    
    if (error.code === 'ECONNABORTED') {
      console.error('Request timeout - server may be down')
    }
    
    if (!error.response) {
      console.error('Network error - check if backend is running')
    }
    
    return Promise.reject(error)
  }
)

// Utility function to format currency in INR
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount || 0);
};

// Utility function to format numbers with Indian numbering system
export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num || 0);
};

// Utility function to format dates
export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const apiService = {
  // Auth - Use backend admin auth instead of Supabase directly
  loginAdmin: async (email, password) => {
    const response = await api.post('/auth/admin/login', { email, password })
    return response.data
  },

  // Dashboard Stats
  getDashboardStats: async () => {
    const response = await api.get('/admin/dashboard/stats')
    return response.data?.data
  },

  getVendorStats: async (vendorId, dateRange = 'last_3_months') => {
    const response = await api.get(`/admin/vendors/${vendorId}/stats?dateRange=${dateRange}`)
    return response.data?.data || response.data
  },

  getVendorMetrics: async (vendorId) => {
    const response = await api.get(`/admin/vendors/${vendorId}/metrics`)
    return response.data
  },

  getVendorOrderStatus: async (vendorId, dateRange = 'last_3_months') => {
    const response = await api.get(`/admin/vendors/${vendorId}/orders/status?dateRange=${dateRange}`)
    return response.data
  },

  getVendorMonthlyRevenue: async (vendorId, dateRange = 'last_6_months') => {
    const response = await api.get(`/admin/vendors/${vendorId}/revenue/monthly?dateRange=${dateRange}`)
    return response.data
  },

  // Vendors
  getVendors: async (searchQuery = '') => {
    const url = searchQuery ? `/admin/vendors?q=${encodeURIComponent(searchQuery)}` : '/admin/vendors'
    const response = await api.get(url)
    return response.data?.vendors || response.data?.data || []
  },

  getVendor: async (id) => {
    const response = await api.get(`/admin/vendors/${id}`)
    return response.data?.data || response.data
  },

  createVendor: async (data) => {
    const response = await api.post('/admin/vendors/create', data)
    return response.data
  },

  updateVendor: async (id, data) => {
    const response = await api.put(`/admin/vendors/${id}`, data)
    return response.data
  },

  deleteVendor: async (id) => {
    const response = await api.delete(`/admin/vendors/${id}`)
    return response.data
  },

  // Vendor Profile specific endpoints
  getVendorPerformance: async (vendorId, month = null, year = null) => {
    const params = {}
    if (month && year) {
      params.month = month
      params.year = year
    }
    const response = await api.get(`/admin/vendors/${vendorId}/performance`, { params })
    return response.data
  },

  getVendorOrders: async (vendorId, page = 1, limit = 20, status = null) => {
    const params = { page, limit }
    if (status) {
      params.status = status
    }
    const response = await api.get(`/admin/vendors/${vendorId}/orders`, { params })
    return response.data
  },

  getVendorMonthlyRevenueData: async (vendorId, dateRange = 'last_6_months') => {
    const response = await api.get(`/admin/vendors/${vendorId}/revenue/monthly`, {
      params: { dateRange }
    })
    return response.data
  }
}
