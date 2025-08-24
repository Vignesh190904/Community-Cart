import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { apiService, formatCurrency, formatNumber } from '../services/api'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts'
import { RefreshCw, TrendingUp, Users, ShoppingCart, DollarSign, Package, AlertCircle, WifiOff } from 'lucide-react'

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalRevenue: 0,
    monthlyGrowth: 0
  })
  const [chartData, setChartData] = useState({
    monthlyOrders: [],
    vendorPerformance: [],
    ordersByStatus: []
  })
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [isOffline, setIsOffline] = useState(false)

  const fetchDashboardData = async () => {
    try {
      setRefreshing(true)
      setError(null)
      setIsOffline(false)
      
      console.log('Fetching dashboard data...')
      
      // Fetch dashboard stats from backend
      const statsData = await apiService.getDashboardStats()
      
      if (statsData) {
        console.log('Dashboard stats received:', statsData)
        setStats({
          totalVendors: statsData.totalVendors || 0,
          totalOrders: statsData.totalOrders || 0,
          totalCustomers: statsData.totalCustomers || 0,
          totalRevenue: statsData.totalRevenue || 0,
          monthlyGrowth: statsData.monthlyGrowth || 0
        })
      } else {
        console.warn('No stats data received from API')
        setError('No data received from server')
      }

      // For now, set some default chart data since backend doesn't have these endpoints yet
      setChartData({
        monthlyOrders: [
          { month: 'Jan', orders: 120, revenue: 15000 },
          { month: 'Feb', orders: 140, revenue: 18000 },
          { month: 'Mar', orders: 160, revenue: 22000 },
          { month: 'Apr', orders: 180, revenue: 25000 },
          { month: 'May', orders: 200, revenue: 28000 },
          { month: 'Jun', orders: 220, revenue: 32000 }
        ],
        vendorPerformance: [
          { name: 'John\'s Market', orders: 45, revenue: 8500 },
          { name: 'Jane\'s Bakery', orders: 38, revenue: 7200 },
          { name: 'Mike\'s Dairy', orders: 32, revenue: 6800 },
          { name: 'Fresh Foods', orders: 28, revenue: 5400 },
          { name: 'Local Grocery', orders: 25, revenue: 4800 }
        ],
        ordersByStatus: [
          { name: 'Completed', value: 65, color: '#10B981' },
          { name: 'Processing', value: 20, color: '#F59E0B' },
          { name: 'Pending', value: 10, color: '#EF4444' },
          { name: 'Cancelled', value: 5, color: '#6B7280' }
        ]
      })
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      
      // Handle specific error types
      if (error.code === 'ECONNABORTED' || !error.response) {
        setIsOffline(true)
        setError('Unable to connect to server. Please check your internet connection.')
      } else if (error.response?.status === 401) {
        setError('Authentication failed. Please log in again.')
      } else if (error.response?.status >= 500) {
        setError('Server error. Please try again later.')
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to load dashboard data')
      }
      
      // Set fallback data
      setStats({
        totalVendors: 0,
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        monthlyGrowth: 0
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading dashboard...</span>
        </div>
      </div>
    )
  }

  if (error && !isOffline) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">Error Loading Dashboard</h2>
          <p className="text-gray-600 max-w-md">{error}</p>
          <Button onClick={fetchDashboardData} disabled={refreshing}>
            {refreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Retrying...
              </>
            ) : (
              'Try Again'
            )}
          </Button>
        </div>
      </div>
    )
  }

  if (isOffline) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <WifiOff className="h-12 w-12 text-orange-500 mx-auto" />
          <h2 className="text-xl font-semibold text-gray-900">Connection Lost</h2>
          <p className="text-gray-600 max-w-md">
            Unable to connect to the server. Please check your internet connection and try again.
          </p>
          <Button onClick={fetchDashboardData} disabled={refreshing}>
            {refreshing ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                Connecting...
              </>
            ) : (
              'Reconnect'
            )}
          </Button>
        </div>
      </div>
    )
  }

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Overview of your platform performance</p>
        </div>
        <Button 
          onClick={fetchDashboardData} 
          disabled={refreshing}
          className="flex items-center space-x-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Vendors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalVendors)}</div>
            <p className="text-xs text-muted-foreground">
              Active vendors on platform
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalOrders)}</div>
            <p className="text-xs text-muted-foreground">
              All time orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatNumber(stats.totalCustomers)}</div>
            <p className="text-xs text-muted-foreground">
              Registered customers
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {stats.monthlyGrowth > 0 ? '+' : ''}{stats.monthlyGrowth}% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Orders & Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Orders & Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData.monthlyOrders}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'orders' ? value : formatCurrency(value),
                    name === 'orders' ? 'Orders' : 'Revenue'
                  ]}
                />
                <Bar yAxisId="left" dataKey="orders" fill="#3B82F6" name="orders" />
                <Bar yAxisId="right" dataKey="revenue" fill="#10B981" name="revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Orders by Status */}
        <Card>
          <CardHeader>
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData.ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [value, 'Orders']} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Vendor Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Top Vendor Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.vendorPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip 
                formatter={(value, name) => [
                  name === 'orders' ? value : formatCurrency(value),
                  name === 'orders' ? 'Orders' : 'Revenue'
                ]}
              />
              <Bar dataKey="orders" fill="#3B82F6" name="orders" />
              <Bar dataKey="revenue" fill="#10B981" name="revenue" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

export default Dashboard
