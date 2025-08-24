import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { apiService, formatCurrency, formatNumber, formatDate } from '../services/api'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Package,
  Calendar,
  Phone,
  Mail,
  MapPin,
  Store
} from 'lucide-react'

const VendorProfile = () => {
  const { id } = useParams()
  const [vendor, setVendor] = useState(null)
  const [metrics, setMetrics] = useState({})
  const [chartData, setChartData] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState('last_6_months')
  const [selectedMonth, setSelectedMonth] = useState('')
  const [selectedYear, setSelectedYear] = useState('')

  const fetchVendorData = async () => {
    try {
      setLoading(true)
      
      // Fetch vendor details
      const vendorData = await apiService.getVendor(id)
      setVendor(vendorData)

      // Fetch vendor metrics
      const metricsData = await apiService.getVendorMetrics(id)
      setMetrics(metricsData?.data || {})

      // Fetch monthly revenue data
      const revenueData = await apiService.getVendorMonthlyRevenueData(id, dateRange)
      setChartData(revenueData?.data || [])

    } catch (error) {
      console.error('Error fetching vendor data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      fetchVendorData()
    }
  }, [id, dateRange])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
          <span className="text-lg">Loading vendor profile...</span>
        </div>
      </div>
    )
  }

  if (!vendor) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Vendor not found</p>
        <Button onClick={() => window.history.back()}>
          Go Back
        </Button>
      </div>
    )
  }

  const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#6B7280']

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{vendor.name}</h1>
          <p className="text-gray-600">{vendor.shop_name}</p>
        </div>
        <Button onClick={() => window.history.back()}>
          Back to Vendors
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Vendor Details Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Vendor Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{vendor.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{vendor.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Store className="h-4 w-4 text-gray-400" />
                <span className="text-sm">{vendor.category}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <span className="text-sm">Member since {formatDate(vendor.created_at)}</span>
              </div>
              <div className="pt-4 border-t">
                <div className="flex items-center space-x-1">
                  <span className="text-sm font-medium">Rating:</span>
                  <span className="text-sm">{vendor.rating || 4.0} ⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Performance Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <ShoppingCart className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <p className="text-xl font-bold">{formatNumber(metrics.totalOrders || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <p className="text-xl font-bold">{formatCurrency(metrics.totalRevenue || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Order Value</p>
                    <p className="text-xl font-bold">{formatCurrency(metrics.avgOrderValue || 0)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Growth Rate</p>
                    <p className="text-xl font-bold">{metrics.growthRate || 0}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Date Range:</label>
                  <select
                    value={dateRange}
                    onChange={(e) => {
                      setDateRange(e.target.value)
                      setSelectedMonth('')
                      setSelectedYear('')
                    }}
                    className="w-40 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="last_month">Last Month</option>
                    <option value="last_3_months">Last 3 Months</option>
                    <option value="last_6_months">Last 6 Months</option>
                    <option value="last_year">Last Year</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Month:</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="01">January</option>
                    <option value="02">February</option>
                    <option value="03">March</option>
                    <option value="04">April</option>
                    <option value="05">May</option>
                    <option value="06">June</option>
                    <option value="07">July</option>
                    <option value="08">August</option>
                    <option value="09">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                    <option value="12">December</option>
                  </select>
                </div>

                <div className="flex items-center space-x-2">
                  <label className="text-sm font-medium">Year:</label>
                  <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All</option>
                    <option value="2024">2024</option>
                    <option value="2023">2023</option>
                    <option value="2022">2022</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Revenue Trend Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Revenue']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#10B981" 
                    strokeWidth={2}
                    dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default VendorProfile
