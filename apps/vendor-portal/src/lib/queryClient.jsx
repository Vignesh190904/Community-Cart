/**
 * React Query client configuration for vendor portal
 * Handles caching, background updates, and error handling
 */

// Note: vendorApi import removed to avoid circular dependency
import { QueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Create query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale time: 5 minutes
      staleTime: 5 * 60 * 1000,
      // Cache time: 10 minutes
      cacheTime: 10 * 60 * 1000,
      // Retry failed requests 3 times
      retry: 3,
      // Retry delay function (exponential backoff)
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Refetch on window focus
      refetchOnWindowFocus: false,
      // Refetch on reconnect
      refetchOnReconnect: true,
      // Error handling
      onError: (error) => {
        console.error('Query error:', error);
        // Don't show toast for auth errors (handled by interceptor)
        if (error?.response?.status !== 401) {
          toast.error(error?.message || 'Failed to fetch data');
        }
      },
    },
    mutations: {
      // Retry failed mutations once
      retry: 1,
      // Error handling
      onError: (error) => {
        console.error('Mutation error:', error);
        // Don't show toast for auth errors (handled by interceptor)
        if (error?.response?.status !== 401) {
          toast.error(error?.message || 'Operation failed');
        }
      },
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  // Vendor
  vendor: {
    profile: ['vendor', 'profile'],
    settings: ['vendor', 'settings'],
    dashboard: ['vendor', 'dashboard'],
    analytics: (params) => ['vendor', 'analytics', params],
  },
  
  // Products
  products: {
    all: ['products'],
    list: (params) => ['products', 'list', params],
    detail: (id) => ['products', 'detail', id],
  },
  
  // Orders
  orders: {
    all: ['orders'],
    list: (params) => ['orders', 'list', params],
    detail: (id) => ['orders', 'detail', id],
    timeline: (id) => ['orders', 'timeline', id],
  },
  
  // Categories
  categories: {
    all: ['categories'],
  },
};

// Utility functions for cache management
export const invalidateQueries = {
  // Invalidate all vendor data
  vendor: () => {
    queryClient.invalidateQueries({ queryKey: ['vendor'] });
  },
  
  // Invalidate products
  products: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  },
  
  // Invalidate specific product
  product: (id) => {
    queryClient.invalidateQueries({ queryKey: ['products', 'detail', id] });
  },
  
  // Invalidate orders
  orders: () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] });
  },
  
  // Invalidate specific order
  order: (id) => {
    queryClient.invalidateQueries({ queryKey: ['orders', 'detail', id] });
    queryClient.invalidateQueries({ queryKey: ['orders', 'timeline', id] });
  },
  
  // Invalidate dashboard (when orders or products change)
  dashboard: () => {
    queryClient.invalidateQueries({ queryKey: ['vendor', 'dashboard'] });
    queryClient.invalidateQueries({ queryKey: ['vendor', 'analytics'] });
  },
};

// Prefetch functions for better UX (to be implemented with vendorApi)
export const prefetchQueries = {
  // Note: Prefetch functions will be implemented when vendorApi is available
};

export default queryClient;
