/**
 * Enhanced Dashboard page for vendor portal
 * Shows key metrics, recent orders, and quick actions
 */

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  ShoppingBagIcon, 
  ClipboardDocumentListIcon, 
  ClockIcon, 
  CurrencyDollarIcon,
  EyeIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';
import { vendorApi } from '../lib/api.jsx';
import { queryKeys } from '../lib/queryClient.jsx';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();

  // Fetch dashboard data
  const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useQuery({
    queryKey: queryKeys.vendor.dashboard,
    queryFn: async () => {
      try {
        const res = await vendorApi.getDashboard()
        return res.data?.data || res.data || {}
      } catch (error) {
        console.error('Dashboard API error:', error)
        return {}
      }
    },
    refetchInterval: 30000, // Refetch every 30 seconds
    retry: 2,
    retryDelay: 1000,
  });

  // Fetch recent orders
  const { data: ordersData, isLoading: ordersLoading } = useQuery({
    queryKey: queryKeys.orders.list({ limit: 5, sort: 'created_at', order: 'desc' }),
    queryFn: async () => {
      try {
        const res = await vendorApi.getOrders({ limit: 5, sort: 'created_at', order: 'desc' })
        return res.data?.data || res.data || { orders: [] }
      } catch (error) {
        console.error('Orders API error:', error)
        return { orders: [] }
      }
    },
    retry: 2,
    retryDelay: 1000,
  });

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading dashboard..." />
      </div>
    );
  }

  if (dashboardError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 mb-4">Failed to load dashboard data</p>
        <Button onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  const stats = dashboardData || {};
  const recentOrders = ordersData?.orders || [];

  const statCards = [
    {
      title: 'Total Products',
      value: stats.total_products || 0,
      icon: ShoppingBagIcon,
      color: 'blue',
      change: '+12.5%',
      trend: 'up'
    },
    {
      title: 'Total Orders',
      value: stats.total_orders || 0,
      icon: ClipboardDocumentListIcon,
      color: 'green',
      change: '+8.2%',
      trend: 'up'
    },
    {
      title: 'Pending Orders',
      value: stats.pending_orders || 0,
      icon: ClockIcon,
      color: 'yellow',
      change: '-5.1%',
      trend: 'down'
    },
    {
      title: 'Today\'s Revenue',
      value: `$${(stats.revenue_today || 0).toFixed(2)}`,
      icon: CurrencyDollarIcon,
      color: 'green',
      change: '+15.3%',
      trend: 'up'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Welcome back! Here's what's happening with your store.</p>
        </div>
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            onClick={() => navigate('/products/new')}
          >
            Add Product
          </Button>
          <Button onClick={() => navigate('/orders')}>
            View All Orders
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <ArrowTrendingUpIcon className="h-4 w-4 text-green-500 mr-1" />
                  ) : (
                    <ArrowTrendingDownIcon className="h-4 w-4 text-red-500 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">vs last week</span>
                </div>
              </div>
              <div className="p-3 rounded-full bg-blue-100">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Recent Orders and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders */}
        <Card 
          title="Recent Orders" 
          subtitle="Latest orders from your customers"
          headerAction={
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate('/orders')}
              rightIcon={<EyeIcon className="h-4 w-4" />}
            >
              View All
            </Button>
          }
          className="lg:col-span-2"
        >
          {ordersLoading ? (
            <div className="flex justify-center py-8">
              <LoadingSpinner />
            </div>
          ) : recentOrders.length > 0 ? (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50">
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        Order #{order.id?.slice(-8)}
                      </p>
                      <Badge variant={order.status}>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {order.customer_name} • ${order.total_amount?.toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate(`/orders/${order.id}`)}
                  >
                    View
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <ClipboardDocumentListIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No recent orders</p>
              <p className="text-sm text-gray-400 mt-1">Orders will appear here when customers place them</p>
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <Card title="Quick Actions" subtitle="Common tasks">
          <div className="space-y-3">
            <Button 
              fullWidth 
              variant="outline"
              onClick={() => navigate('/products/new')}
              leftIcon={<ShoppingBagIcon className="h-4 w-4" />}
            >
              Add New Product
            </Button>
            <Button 
              fullWidth 
              variant="outline"
              onClick={() => navigate('/products/bulk-upload')}
            >
              Bulk Upload Products
            </Button>
            <Button 
              fullWidth 
              variant="outline"
              onClick={() => navigate('/orders?status=pending')}
              leftIcon={<ClockIcon className="h-4 w-4" />}
            >
              View Pending Orders
            </Button>
            <Button 
              fullWidth 
              variant="outline"
              onClick={() => navigate('/analytics')}
            >
              View Analytics
            </Button>
            <Button 
              fullWidth 
              variant="outline"
              onClick={() => navigate('/settings')}
            >
              Store Settings
            </Button>
          </div>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.low_stock_products > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-full">
                <ShoppingBagIcon className="h-5 w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-yellow-800">
                  Low Stock Alert
                </p>
                <p className="text-sm text-yellow-700">
                  {stats.low_stock_products} product{stats.low_stock_products > 1 ? 's' : ''} running low on stock
                </p>
              </div>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/products?filter=low-stock')}
            >
              Review Products
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Dashboard;
