const API_BASE = 'http://localhost:5000/api';

let auth_token: string | null = null;

export const setAuthToken = (token: string | null) => {
  auth_token = token;
};

const authHeaders = (extra: Record<string, string> = {}) => {
  const headers: Record<string, string> = { ...extra };
  if (auth_token) headers['Authorization'] = `Bearer ${auth_token}`;
  return headers;
};

export const api = {
  // Vendors
  vendors: {
    create: async (data: any) => {
      const response = await fetch(`${API_BASE}/vendors`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create vendor');
      return response.json();
    },
    getAll: async () => {
      const response = await fetch(`${API_BASE}/vendors`);
      if (!response.ok) throw new Error('Failed to fetch vendors');
      return response.json();
    },
    getById: async (id: string, opts?: { includePassword?: boolean }) => {
      const params = new URLSearchParams();
      if (opts?.includePassword) params.append('includePassword', 'true');
      const suffix = params.toString() ? `?${params.toString()}` : '';
      const response = await fetch(`${API_BASE}/vendors/${id}${suffix}`);
      if (!response.ok) throw new Error('Failed to fetch vendor');
      return response.json();
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE}/vendors/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update vendor');
      return response.json();
    },
    forceLogout: async (id: string) => {
      const response = await fetch(`${API_BASE}/vendors/${id}/force-logout`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to force logout vendor');
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE}/vendors/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete vendor');
      return response.json();
    },
  },

  // Auth
  auth: {
    register: async (data: any) => {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || 'Failed to register');
      return body;
    },
    login: async (data: any) => {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || 'Failed to login');
      return body;
    },
    me: async () => {
      const response = await fetch(`${API_BASE}/auth/me`, {
        headers: authHeaders(),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || 'Failed to fetch user');
      return body;
    },
    changePassword: async (currentPassword: string, newPassword: string) => {
      const response = await fetch(`${API_BASE}/auth/change-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeaders() },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const body = await response.json();
      if (!response.ok) throw new Error(body.message || 'Failed to change password');
      return body;
    },
  },

  // Customers
  customers: {
    create: async (data: any) => {
      const response = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create customer');
      return response.json();
    },
    getAll: async () => {
      const response = await fetch(`${API_BASE}/customers`);
      if (!response.ok) throw new Error('Failed to fetch customers');
      return response.json();
    },
  },

  // Products
  products: {
    create: async (data: any) => {
      const response = await fetch(`${API_BASE}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to create product');
      return response.json();
    },
    getAll: async () => {
      const response = await fetch(`${API_BASE}/products`);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
    getById: async (id: string) => {
      const response = await fetch(`${API_BASE}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    },
    update: async (id: string, data: any) => {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error('Failed to update product');
      return response.json();
    },
    delete: async (id: string) => {
      const response = await fetch(`${API_BASE}/products/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      return response.json();
    },
  },

  // Product Sales Analytics
  productSales: {
    getAnalytics: async (vendorId: string, filters?: {
      startDate?: string;
      endDate?: string;
      search?: string;
      category?: string;
      stockStatus?: string;
      minUnitsSold?: number;
      minRevenue?: number;
      zeroSalesOnly?: boolean;
      page?: number;
      limit?: number;
      sortBy?: string;
      sortOrder?: 'asc' | 'desc';
      productId?: string;
    }) => {
      const params = new URLSearchParams();
      params.append('vendorId', vendorId);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            params.append(key, String(value));
          }
        });
      }
      const response = await fetch(`${API_BASE}/product-sales/analytics?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch product sales analytics');
      return response.json();
    },
    getKPIs: async (vendorId: string, filters?: {
      startDate?: string;
      endDate?: string;
    }) => {
      const params = new URLSearchParams();
      params.append('vendorId', vendorId);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      const response = await fetch(`${API_BASE}/product-sales/kpis?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch KPIs');
      return response.json();
    },
    getProductDetail: async (productId: string, vendorId: string, filters?: {
      startDate?: string;
      endDate?: string;
    }) => {
      const params = new URLSearchParams();
      params.append('vendorId', vendorId);
      if (filters?.startDate) params.append('startDate', filters.startDate);
      if (filters?.endDate) params.append('endDate', filters.endDate);
      const response = await fetch(`${API_BASE}/product-sales/detail/${productId}?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch product detail');
      return response.json();
    },
  },
};
