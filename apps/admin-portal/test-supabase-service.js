import { supabase } from './test-supabase-config.js'

// Utility functions
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR'
  }).format(amount || 0)
}

export const formatNumber = (num) => {
  return new Intl.NumberFormat('en-IN').format(num || 0)
}

// Error handling utility
const handleSupabaseError = (error, operation) => {
  console.error(`Supabase ${operation} error:`, error)
  throw new Error(error.message || `Failed to ${operation}`)
}

// Authentication service
export const authService = {
  // Get current session
  getSession: async () => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      return session
    } catch (error) {
      handleSupabaseError(error, 'get session')
    }
  }
}

// Dashboard service
export const dashboardService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      // Get total vendors
      const { count: totalVendors, error: vendorsError } = await supabase
        .from('vendors')
        .select('*', { count: 'exact', head: true })

      if (vendorsError) throw vendorsError

      // Get total orders
      const { count: totalOrders, error: ordersError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true })

      if (ordersError) throw ordersError

      // Get total customers
      const { count: totalCustomers, error: customersError } = await supabase
        .from('customers')
        .select('*', { count: 'exact', head: true })

      if (customersError) throw customersError

      // Get total revenue
      const { data: revenueData, error: revenueError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')

      if (revenueError) throw revenueError

      const totalRevenue = revenueData.reduce((sum, order) => sum + (order.total_amount || 0), 0)

      // Calculate monthly growth (simplified)
      const currentMonth = new Date().getMonth()
      const lastMonth = new Date().getMonth() - 1
      
      const { data: currentMonthOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('created_at', new Date(new Date().getFullYear(), currentMonth, 1).toISOString())
        .lt('created_at', new Date(new Date().getFullYear(), currentMonth + 1, 1).toISOString())

      const { data: lastMonthOrders } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('created_at', new Date(new Date().getFullYear(), lastMonth, 1).toISOString())
        .lt('created_at', new Date(new Date().getFullYear(), lastMonth + 1, 1).toISOString())

      const currentMonthRevenue = currentMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      const lastMonthRevenue = lastMonthOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0)
      
      const monthlyGrowth = lastMonthRevenue > 0 
        ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
        : 0

      return {
        totalVendors: totalVendors || 0,
        totalOrders: totalOrders || 0,
        totalCustomers: totalCustomers || 0,
        totalRevenue,
        monthlyGrowth: Math.round(monthlyGrowth * 100) / 100
      }
    } catch (error) {
      handleSupabaseError(error, 'get stats')
    }
  },

  // Get monthly orders data
  getMonthlyOrders: async (months = 6) => {
    try {
      const monthlyData = []
      const currentDate = new Date()

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
        const monthStart = date.toISOString()
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString()

        const { count: ordersCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .gte('created_at', monthStart)
          .lt('created_at', monthEnd)

        if (ordersError) throw ordersError

        const { data: revenueData, error: revenueError } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('status', 'completed')
          .gte('created_at', monthStart)
          .lt('created_at', monthEnd)

        if (revenueError) throw revenueError

        const revenue = revenueData.reduce((sum, order) => sum + (order.total_amount || 0), 0)

        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          orders: ordersCount || 0,
          revenue
        })
      }

      return monthlyData
    } catch (error) {
      handleSupabaseError(error, 'get monthly orders')
    }
  },

  // Get vendor performance
  getVendorPerformance: async (limit = 5) => {
    try {
      const { data, error } = await supabase
        .from('vendor_metrics')
        .select('*')
        .order('total_revenue', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data || []
    } catch (error) {
      handleSupabaseError(error, 'get vendor performance')
    }
  },

  // Get orders by status
  getOrdersByStatus: async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')

      if (error) throw error

      const statusCounts = data.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      }, {})

      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      }))
    } catch (error) {
      handleSupabaseError(error, 'get orders by status')
    }
  }
}

// Vendors service
export const vendorsService = {
  // Get all vendors
  getVendors: async (searchQuery = '') => {
    try {
      let query = supabase
        .from('vendors')
        .select(`
          *,
          communities:community_id (
            name
          )
        `)
        .order('created_at', { ascending: false })

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,shop_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query

      if (error) throw error

      return data || []
    } catch (error) {
      handleSupabaseError(error, 'get vendors')
    }
  },

  // Get single vendor
  getVendor: async (id) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .select(`
          *,
          communities:community_id (
            name
          )
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      handleSupabaseError(error, 'get vendor')
    }
  },

  // Create vendor
  createVendor: async (vendorData) => {
    try {
      // First, ensure community exists
      let communityId = null
      if (vendorData.community_name) {
        const { data: existingCommunity } = await supabase
          .from('communities')
          .select('id')
          .eq('name', vendorData.community_name)
          .single()

        if (existingCommunity) {
          communityId = existingCommunity.id
        } else {
          const { data: newCommunity, error: communityError } = await supabase
            .from('communities')
            .insert([{ name: vendorData.community_name }])
            .select()
            .single()

          if (communityError) throw communityError
          communityId = newCommunity.id
        }
      }

      // Create vendor
      const vendorPayload = {
        name: vendorData.name,
        email: vendorData.email,
        shop_name: vendorData.shop_name,
        phone: vendorData.phone,
        business_name: vendorData.business_name,
        category: vendorData.category,
        address: vendorData.address,
        description: vendorData.description,
        community_id: communityId,
        status: true
      }

      const { data, error } = await supabase
        .from('vendors')
        .insert([vendorPayload])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        vendor: data
      }
    } catch (error) {
      handleSupabaseError(error, 'create vendor')
    }
  },

  // Update vendor
  updateVendor: async (id, vendorData) => {
    try {
      const { data, error } = await supabase
        .from('vendors')
        .update(vendorData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        vendor: data
      }
    } catch (error) {
      handleSupabaseError(error, 'update vendor')
    }
  },

  // Delete vendor
  deleteVendor: async (id) => {
    try {
      const { error } = await supabase
        .from('vendors')
        .delete()
        .eq('id', id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      handleSupabaseError(error, 'delete vendor')
    }
  },

  // Toggle vendor status
  toggleVendorStatus: async (id) => {
    try {
      // First get current status
      const { data: currentVendor, error: fetchError } = await supabase
        .from('vendors')
        .select('status')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      // Toggle status
      const { data, error } = await supabase
        .from('vendors')
        .update({ status: !currentVendor.status })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        vendor: data
      }
    } catch (error) {
      handleSupabaseError(error, 'toggle vendor status')
    }
  }
}

// Vendor analytics service
export const vendorAnalyticsService = {
  // Get vendor metrics
  getVendorMetrics: async (vendorId) => {
    try {
      const { data, error } = await supabase
        .from('vendor_metrics')
        .select('*')
        .eq('vendor_id', vendorId)
        .single()

      if (error) throw error

      return data
    } catch (error) {
      handleSupabaseError(error, 'get vendor metrics')
    }
  },

  // Get vendor monthly revenue
  getVendorMonthlyRevenue: async (vendorId, months = 6) => {
    try {
      const monthlyData = []
      const currentDate = new Date()

      for (let i = months - 1; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
        const monthStart = date.toISOString()
        const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 1).toISOString()

        const { count: ordersCount, error: ordersError } = await supabase
          .from('orders')
          .select('*', { count: 'exact', head: true })
          .eq('vendor_id', vendorId)
          .gte('created_at', monthStart)
          .lt('created_at', monthEnd)

        if (ordersError) throw ordersError

        const { data: revenueData, error: revenueError } = await supabase
          .from('orders')
          .select('total_amount')
          .eq('vendor_id', vendorId)
          .eq('status', 'completed')
          .gte('created_at', monthStart)
          .lt('created_at', monthEnd)

        if (revenueError) throw revenueError

        const revenue = revenueData.reduce((sum, order) => sum + (order.total_amount || 0), 0)

        monthlyData.push({
          month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          orders: ordersCount || 0,
          revenue
        })
      }

      return monthlyData
    } catch (error) {
      handleSupabaseError(error, 'get vendor monthly revenue')
    }
  },

  // Get vendor orders by status
  getVendorOrdersByStatus: async (vendorId) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('status')
        .eq('vendor_id', vendorId)

      if (error) throw error

      const statusCounts = data.reduce((acc, order) => {
        acc[order.status] = (acc[order.status] || 0) + 1
        return acc
      }, {})

      return Object.entries(statusCounts).map(([status, count]) => ({
        status,
        count
      }))
    } catch (error) {
      handleSupabaseError(error, 'get vendor orders by status')
    }
  }
}

// Real-time service
export const realtimeService = {
  // Subscribe to vendors changes
  subscribeToVendors: (callback) => {
    return supabase
      .channel('vendors_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'vendors' }, callback)
      .subscribe()
  },

  // Subscribe to orders changes
  subscribeToOrders: (callback) => {
    return supabase
      .channel('orders_changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, callback)
      .subscribe()
  },

  // Unsubscribe from all channels
  unsubscribe: () => {
    return supabase.removeAllChannels()
  }
}

// Export the complete service
export const supabaseService = {
  auth: authService,
  dashboard: dashboardService,
  vendors: vendorsService,
  analytics: vendorAnalyticsService,
  realtime: realtimeService,
  utils: { formatCurrency, formatNumber }
}
