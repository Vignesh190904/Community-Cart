import { useEffect, useState, useMemo, useCallback } from 'react';
import { useToast } from '../../components/ui/ToastProvider';

type OrderStatus = 'completed' | 'cancelled' | 'processing' | 'pending' | 'all';

interface Order {
  _id: string;
  orderNumber: string;
  vendorId: { _id: string; name: string; email?: string } | null;
  pricing: {
    totalAmount: number;
  };
  status: 'completed' | 'cancelled' | 'processing' | 'pending';
  createdAt?: string;
}

interface Vendor {
  _id: string;
  name: string;
  email?: string;
}

type DatePreset = 'today' | 'week' | 'month' | 'all';

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [vendorSearch, setVendorSearch] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<Set<Exclude<OrderStatus, 'all'>>>(new Set(['completed', 'cancelled', 'processing', 'pending']));
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customDateFrom, setCustomDateFrom] = useState<string>('');
  const [customDateTo, setCustomDateTo] = useState<string>('');
  const [minOrderValue, setMinOrderValue] = useState<string>('');
  
  const { pushToast } = useToast();

  useEffect(() => {
    loadVendors();
    loadOrders();
  }, []);

  const loadVendors = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/vendors');
      if (!res.ok) throw new Error('Failed to fetch vendors');
      const data = await res.json();
      setVendors(data);
    } catch (error: any) {
      console.error('Failed to load vendors:', error);
    }
  };

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Load all orders - fetch completed, cancelled, processing, and pending
      const res = await fetch('http://localhost:5000/api/orders?status=completed,cancelled,processing,pending');
      if (!res.ok) throw new Error('Failed to fetch orders');
      const data = await res.json();
      // Ensure we have an array and filter out any invalid entries
      const validOrders = Array.isArray(data) ? data.filter(order => 
        order && order.status && ['completed', 'cancelled', 'processing', 'pending'].includes(order.status)
      ) : [];
      setAllOrders(validOrders);
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Error', message: error.message || 'Failed to load orders' });
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Debounced vendor search
  const [debouncedVendorSearch, setDebouncedVendorSearch] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedVendorSearch(vendorSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [vendorSearch]);

  // Filter orders based on all criteria
  const filteredOrders = useMemo(() => {
    let filtered = [...allOrders];

    // Vendor search (name or email)
    if (debouncedVendorSearch.trim()) {
      const search = debouncedVendorSearch.toLowerCase();
      filtered = filtered.filter(order => {
        const vendorName = order.vendorId?.name?.toLowerCase() || '';
        const vendorEmail = order.vendorId?.email?.toLowerCase() || '';
        return vendorName.includes(search) || vendorEmail.includes(search);
      });
    }

    // Status filter
    if (statusFilter.size > 0) {
      filtered = filtered.filter(order => statusFilter.has(order.status as any));
    }

    // Date filter
    const now = new Date();
    if (datePreset !== 'all') {
      filtered = filtered.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);
        
        if (datePreset === 'today') {
          return orderDate.toDateString() === now.toDateString();
        } else if (datePreset === 'week') {
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          return orderDate >= weekAgo;
        } else if (datePreset === 'month') {
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= monthAgo;
        }
        return true;
      });
    }

    // Custom date range
    if (customDateFrom) {
      const fromDate = new Date(customDateFrom);
      filtered = filtered.filter(order => {
        if (!order.createdAt) return false;
        return new Date(order.createdAt) >= fromDate;
      });
    }
    if (customDateTo) {
      const toDate = new Date(customDateTo);
      toDate.setHours(23, 59, 59, 999);
      filtered = filtered.filter(order => {
        if (!order.createdAt) return false;
        return new Date(order.createdAt) <= toDate;
      });
    }

    // Min order value
    if (minOrderValue) {
      const minValue = parseFloat(minOrderValue);
      if (!isNaN(minValue)) {
        filtered = filtered.filter(order => order.pricing.totalAmount >= minValue);
      }
    }

    return filtered;
  }, [allOrders, debouncedVendorSearch, statusFilter, datePreset, customDateFrom, customDateTo, minOrderValue]);

  // Compute stats
  const stats = useMemo(() => {
    const completed = filteredOrders.filter(o => o.status === 'completed');
    const cancelled = filteredOrders.filter(o => o.status === 'cancelled');
    
    const totalEarnings = completed.reduce((sum, o) => sum + o.pricing.totalAmount, 0);
    const totalOrders = filteredOrders.length;
    const completionRate = totalOrders > 0 ? (completed.length / totalOrders) * 100 : 0;
    const cancellationRate = totalOrders > 0 ? (cancelled.length / totalOrders) * 100 : 0;
    const avgOrderValue = completed.length > 0 ? totalEarnings / completed.length : 0;

    return {
      totalEarnings,
      totalOrders,
      completionRate,
      cancellationRate,
      avgOrderValue
    };
  }, [filteredOrders]);

  const handleDatePresetChange = (preset: DatePreset) => {
    setDatePreset(preset);
    if (preset !== 'all') {
      setCustomDateFrom('');
      setCustomDateTo('');
    }
  };

  const toggleStatus = (status: Exclude<OrderStatus, 'all'>) => {
    const newSet = new Set(statusFilter);
    if (newSet.has(status)) {
      newSet.delete(status);
    } else {
      newSet.add(status);
    }
    setStatusFilter(newSet);
  };

  const setAllStatuses = () => {
    setStatusFilter(new Set(['completed', 'cancelled', 'processing', 'pending']));
  };

  const isAllSelected = statusFilter.size === 4;

  if (loading) {
    return (
      <div className="admin-orders-container">
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading orders...
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders-container">
      <header className="page-header">
        <h1 className="page-title">Orders</h1>
        <p className="page-subtitle">View and analyze orders across all vendors</p>
      </header>

      {/* FILTERS SECTION - 2 ROWS */}
      <div className="filters-section">
        {/* ROW 1: Vendor Search + Status Tabs */}
        <div className="filters-row-1">
          <div className="vendor-search-wrapper">
            <input
              type="text"
              className="vendor-search-input"
              placeholder="Search by vendor name or email..."
              value={vendorSearch}
              onChange={(e) => setVendorSearch(e.target.value)}
            />
          </div>
          
          <div className="status-tabs">
            <button
              className={`status-tab ${isAllSelected ? 'active' : ''}`}
              onClick={setAllStatuses}
            >
              All
            </button>
            <button
              className={`status-tab ${statusFilter.has('completed') ? 'active' : ''}`}
              onClick={() => toggleStatus('completed')}
            >
              Completed
            </button>
            <button
              className={`status-tab ${statusFilter.has('cancelled') ? 'active' : ''}`}
              onClick={() => toggleStatus('cancelled')}
            >
              Cancelled
            </button>
            <button
              className={`status-tab ${statusFilter.has('processing') ? 'active' : ''}`}
              onClick={() => toggleStatus('processing')}
            >
              Processing
            </button>
            <button
              className={`status-tab ${statusFilter.has('pending') ? 'active' : ''}`}
              onClick={() => toggleStatus('pending')}
            >
              Pending
            </button>
          </div>
        </div>

        {/* ROW 2: Date Presets + Custom Range + Min Value */}
        <div className="filters-row-2">
          <div className="date-presets">
            <button
              className={`date-preset-btn ${datePreset === 'today' ? 'active' : ''}`}
              onClick={() => handleDatePresetChange('today')}
            >
              Today
            </button>
            <button
              className={`date-preset-btn ${datePreset === 'week' ? 'active' : ''}`}
              onClick={() => handleDatePresetChange('week')}
            >
              This Week
            </button>
            <button
              className={`date-preset-btn ${datePreset === 'month' ? 'active' : ''}`}
              onClick={() => handleDatePresetChange('month')}
            >
              This Month
            </button>
            <button
              className={`date-preset-btn ${datePreset === 'all' ? 'active' : ''}`}
              onClick={() => handleDatePresetChange('all')}
            >
              All Time
            </button>
          </div>

          <div className="custom-date-range">
            <input
              type="date"
              className="date-input"
              value={customDateFrom}
              onChange={(e) => {
                setCustomDateFrom(e.target.value);
                setDatePreset('all');
              }}
              placeholder="From"
            />
            <span className="date-separator">—</span>
            <input
              type="date"
              className="date-input"
              value={customDateTo}
              onChange={(e) => {
                setCustomDateTo(e.target.value);
                setDatePreset('all');
              }}
              placeholder="To"
            />
          </div>

          <div className="min-order-value">
            <input
              type="number"
              className="min-value-input"
              placeholder="Min Order Value"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
              min="0"
              step="1"
            />
          </div>

          <button
            type="button"
            className="clear-filters-btn"
            onClick={() => {
              setVendorSearch('');
              setStatusFilter(new Set(['completed', 'cancelled', 'processing', 'pending']));
              setDatePreset('all');
              setCustomDateFrom('');
              setCustomDateTo('');
              setMinOrderValue('');
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* STATS CARDS SECTION */}
      <div className="stats-section">
        <div className="stat-card">
          <span className="stat-label">Total Earnings</span>
          <span className="stat-value">₹{stats.totalEarnings.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{stats.totalOrders}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Completion Rate</span>
          <span className="stat-value">{stats.completionRate.toFixed(1)}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Cancellation Rate</span>
          <span className="stat-value">{stats.cancellationRate.toFixed(1)}%</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg Order Value</span>
          <span className="stat-value">₹{stats.avgOrderValue.toFixed(2)}</span>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order Number</th>
              <th>Vendor</th>
              <th>Order Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.orderNumber || order._id}>
                <td className="order-id-cell">{order.orderNumber || '—'}</td>
                <td className="vendor-name-cell">{order.vendorId?.name || '—'}</td>
                <td className="value-cell">₹{order.pricing.totalAmount.toFixed(2)}</td>
                <td className="status-cell">
                  <span className={`order-status-badge ${order.status}`}>
                    {order.status === 'completed' ? 'Completed' : 
                     order.status === 'cancelled' ? 'Cancelled' : 
                     order.status === 'processing' ? 'Processing' : 'Pending'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filteredOrders.length === 0 && !loading && (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No orders match the selected filters
        </div>
      )}
    </div>
  );
}
