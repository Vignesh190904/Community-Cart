import { supabase } from '../lib/supabase.js'

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
  // Login admin using Supabase Auth
  loginAdmin: async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      // Get admin profile from admins table
      const { data: adminProfile, error: profileError } = await supabase
        .from('admins')
        .select('*')
        .eq('id', data.user.id)
        .single()

      if (profileError) throw profileError

      return {
        success: true,
        token: data.session.access_token,
        user: {
          id: data.user.id,
          email: data.user.email,
          name: adminProfile.name,
          phone: adminProfile.phone
        }
      }
    } catch (error) {
      handleSupabaseError(error, 'login')
    }
  },

  // Logout admin
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      return { success: true }
    } catch (error) {
      handleSupabaseError(error, 'logout')
    }
  },

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

      // Get total revenue from completed orders
      const { data: revenueData, error: revenueError } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')

      if (revenueError) throw revenueError

      const totalRevenue = revenueData?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0

      // Calculate monthly growth
      const currentMonth = new Date()
      const lastMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
      const thisMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)

      const { data: thisMonthRevenue } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('created_at', thisMonth.toISOString())

      const { data: lastMonthRevenue } = await supabase
        .from('orders')
        .select('total_amount')
        .eq('status', 'completed')
        .gte('created_at', lastMonth.toISOString())
        .lt('created_at', thisMonth.toISOString())

      const thisMonthTotal = thisMonthRevenue?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0
      const lastMonthTotal = lastMonthRevenue?.reduce((sum, order) => sum + parseFloat(order.total_amount || 0), 0) || 0

      let monthlyGrowth = 0
      if (lastMonthTotal > 0) {
        monthlyGrowth = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
      }

      return {
        totalVendors: totalVendors || 0,
        totalOrders: totalOrders || 0,
        totalCustomers: totalCustomers || 0,
        totalRevenue: totalRevenue,
        monthlyGrowth: parseFloat(monthlyGrowth.toFixed(1))
      }
    } catch (error) {
      handleSupabaseError(error, 'get dashboard stats')
    }
  },

  // Get monthly orders data for charts
  getMonthlyOrders: async (months = 6) => {
    try {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - months)

      const { data, error } = await supabase
        .from('orders')
        .select('total_amount, created_at')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Group by month
      const monthlyData = {}
      data?.forEach(order => {
        const date = new Date(order.created_at)
        const monthKey = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
        
        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = { orders: 0, revenue: 0 }
        }
        monthlyData[monthKey].orders++
        monthlyData[monthKey].revenue += parseFloat(order.total_amount || 0)
      })

      return Object.entries(monthlyData).map(([month, data]) => ({
        month,
        orders: data.orders,
        revenue: data.revenue
      }))
    } catch (error) {
      handleSupabaseError(error, 'get monthly orders')
    }
  },

  // Get vendor performance data
  getVendorPerformance: async (limit = 5) => {
    try {
      const { data, error } = await supabase
        .from('vendor_metrics')
        .select('*')
        .order('total_revenue', { ascending: false })
        .limit(limit)

      if (error) throw error

      return data?.map(vendor => ({
        name: vendor.vendor_name,
        orders: vendor.total_orders || 0,
        revenue: vendor.total_revenue || 0
      })) || []
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

      const statusCounts = { completed: 0, pending: 0, cancelled: 0, processing: 0 }
      data?.forEach(order => {
        if (statusCounts.hasOwnProperty(order.status)) {
          statusCounts[order.status]++
        }
      })

      return [
        { name: 'Completed', value: statusCounts.completed, color: '#10B981' },
        { name: 'Processing', value: statusCounts.processing, color: '#F59E0B' },
        { name: 'Pending', value: statusCounts.pending, color: '#EF4444' },
        { name: 'Cancelled', value: statusCounts.cancelled, color: '#6B7280' }
      ]
    } catch (error) {
      handleSupabaseError(error, 'get orders by status')
    }
  }
}

// Vendors service
export const vendorsService = {
  // Get all vendors with optional search
  getVendors: async (searchQuery = '') => {
    try {
      let query = supabase
        .from('vendors')
        .select(`
          id,
          name,
          email,
          shop_name,
          phone,
          business_name,
          category,
          address,
          description,
          rating,
          total_orders,
          total_revenue,
          status,
          created_at,
          communities(name)
        `)

      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,shop_name.ilike.%${searchQuery}%,phone.ilike.%${searchQuery}%`)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) throw error

      return data?.map(vendor => ({
        id: vendor.id,
        name: vendor.name,
        email: vendor.email || 'N/A',
        shop_name: vendor.shop_name,
        phone: vendor.phone,
        business_name: vendor.business_name,
        category: vendor.category,
        address: vendor.address,
        description: vendor.description,
        rating: vendor.rating,
        total_orders: vendor.total_orders,
        total_revenue: vendor.total_revenue,
        status: vendor.status,
        community_name: vendor.communities?.name || 'Unknown',
        created_at: vendor.created_at
      })) || []
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
          id,
          name,
          email,
          shop_name,
          phone,
          business_name,
          category,
          address,
          description,
          rating,
          total_orders,
          total_revenue,
          status,
          created_at,
          communities(name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      return {
        id: data.id,
        name: data.name,
        email: data.email || 'N/A',
        shop_name: data.shop_name,
        phone: data.phone,
        business_name: data.business_name,
        category: data.category,
        address: data.address,
        description: data.description,
        rating: data.rating,
        total_orders: data.total_orders,
        total_revenue: data.total_revenue,
        status: data.status,
        community_name: data.communities?.name || 'Unknown',
        created_at: data.created_at
      }
    } catch (error) {
      handleSupabaseError(error, 'get vendor')
    }
  },

  // Create vendor
  createVendor: async (vendorData) => {
    try {
      // First, get or create community
      let { data: community, error: communityError } = await supabase
        .from('communities')
        .select('id')
        .eq('name', vendorData.community_name || 'Default Community')
        .single()

      if (communityError && communityError.code === 'PGRST116') {
        // Community doesn't exist, create it
        const { data: newCommunity, error: createCommunityError } = await supabase
          .from('communities')
          .insert([{ 
            name: vendorData.community_name || 'Default Community', 
            address: 'Address to be updated' 
          }])
          .select('id')
          .single()

        if (createCommunityError) throw createCommunityError
        community = newCommunity
      } else if (communityError) {
        throw communityError
      }

      // Create vendor
      const { data, error } = await supabase
        .from('vendors')
        .insert([{
          community_id: community.id,
          name: vendorData.name,
          email: vendorData.email,
          shop_name: vendorData.shop_name,
          phone: vendorData.phone,
          business_name: vendorData.business_name,
          category: vendorData.category,
          address: vendorData.address,
          description: vendorData.description,
          status: true
        }])
        .select(`
          id,
          name,
          email,
          shop_name,
          phone,
          business_name,
          category,
          address,
          description,
          rating,
          total_orders,
          total_revenue,
          status,
          created_at,
          communities(name)
        `)
        .single()

      if (error) throw error

      return {
        success: true,
        vendor: {
          id: data.id,
          name: data.name,
          email: data.email || 'N/A',
          shop_name: data.shop_name,
          phone: data.phone,
          business_name: data.business_name,
          category: data.category,
          address: data.address,
          description: data.description,
          rating: data.rating,
          total_orders: data.total_orders,
          total_revenue: data.total_revenue,
          status: data.status,
          community_name: data.communities?.name || 'Unknown',
          created_at: data.created_at
        }
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
        .select(`
          id,
          name,
          email,
          shop_name,
          phone,
          business_name,
          category,
          address,
          description,
          rating,
          total_orders,
          total_revenue,
          status,
          created_at,
          communities(name)
        `)
        .single()

      if (error) throw error

      return {
        success: true,
        vendor: {
          id: data.id,
          name: data.name,
          email: data.email || 'N/A',
          shop_name: data.shop_name,
          phone: data.phone,
          business_name: data.business_name,
          category: data.category,
          address: data.address,
          description: data.description,
          rating: data.rating,
          total_orders: data.total_orders,
          total_revenue: data.total_revenue,
          status: data.status,
          community_name: data.communities?.name || 'Unknown',
          created_at: data.created_at
        }
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
      const { data: currentVendor, error: getError } = await supabase
        .from('vendors')
        .select('status')
        .eq('id', id)
        .single()

      if (getError) throw getError

      // Toggle status
      const { data, error } = await supabase
        .from('vendors')
        .update({ status: !currentVendor.status })
        .eq('id', id)
        .select('status')
        .single()

      if (error) throw error

      return { success: true, status: data.status }
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

      return {
        totalOrders: data.total_orders || 0,
        totalRevenue: data.total_revenue || 0,
        avgOrderValue: data.avg_order_value || 0,
        customerRating: data.rating || 4.0,
        totalProducts: data.total_products || 0,
        activeProducts: data.active_products || 0,
        totalProfit: data.total_profit || 0
      }
    } catch (error) {
      handleSupabaseError(error, 'get vendor metrics')
    }
  },

  // Get vendor monthly revenue
  getVendorMonthlyRevenue: async (vendorId, months = 6) => {
    try {
      const startDate = new Date()
      startDate.setMonth(startDate.getMonth() - months)

      const { data, error } = await supabase
        .from('monthly_revenue')
        .select('*')
        .eq('vendor_id', vendorId)
        .gte('month', startDate.toISOString())
        .order('month', { ascending: true })

      if (error) throw error

      return data?.map(item => ({
        month: new Date(item.month).toLocaleDateString('en-US', { month: 'short' }),
        orders: item.orders_count || 0,
        revenue: item.revenue || 0
      })) || []
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

      const statusCounts = { completed: 0, pending: 0, cancelled: 0, processing: 0 }
      data?.forEach(order => {
        if (statusCounts.hasOwnProperty(order.status)) {
          statusCounts[order.status]++
        }
      })

      return [
        { name: 'Completed', value: statusCounts.completed, color: '#10B981' },
        { name: 'Processing', value: statusCounts.processing, color: '#F59E0B' },
        { name: 'Pending', value: statusCounts.pending, color: '#EF4444' },
        { name: 'Cancelled', value: statusCounts.cancelled, color: '#6B7280' }
      ]
    } catch (error) {
      handleSupabaseError(error, 'get vendor orders by status')
    }
  }
}

// Real-time subscriptions
export const realtimeService = {
  // Subscribe to vendor changes
  subscribeToVendors: (callback) => {
    return supabase
      .channel('vendors_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'vendors' }, 
        callback
      )
      .subscribe()
  },

  // Subscribe to order changes
  subscribeToOrders: (callback) => {
    return supabase
      .channel('orders_changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'orders' }, 
        callback
      )
      .subscribe()
  },

  // Unsubscribe from all channels
  unsubscribe: () => {
    supabase.removeAllChannels()
  }
}

// Export all services
export const supabaseService = {
  auth: authService,
  dashboard: dashboardService,
  vendors: vendorsService,
  analytics: vendorAnalyticsService,
  realtime: realtimeService,
  utils: {
    formatCurrency,
    formatNumber
  }
}
