import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '../../components/ui/ToastProvider';
import { aggregateOrderItems } from '../../utils/orderAggregation';
import { getVendorToken, getVendorId, getVendorAuthHeaders } from '../../utils/vendorAuth';

type OrderStatus = 'completed' | 'cancelled' | 'processing' | 'pending' | 'all';

interface OrderResponse {
  order_id: string;
  order_number: string;
  status: 'completed' | 'cancelled' | 'processing' | 'pending';
  created_at: string;
  customer: {
    name: string;
    phone: string;
  };
  delivery_address_snapshot: {
    community?: string;
    block?: string;
    floor?: string;
    flat_number?: string;
  };
  items: Array<{
    product_id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  total_amount: number;
  payment_method: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  items?: Array<{ quantity: number }>;
  pricing: {
    totalAmount: number;
  };
  paymentMethod?: string;
  status: 'completed' | 'cancelled' | 'processing' | 'pending';
  createdAt?: string;
}

type DatePreset = 'today' | 'month' | 'all';
const ALLOWED_STATUSES: Array<Exclude<OrderStatus, 'all'>> = ['completed', 'cancelled', 'processing', 'pending'];

export default function VendorOrderHistory() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [statusFilter, setStatusFilter] = useState<Set<Exclude<OrderStatus, 'all'>>>(
    new Set(ALLOWED_STATUSES)
  );
  const [datePreset, setDatePreset] = useState<DatePreset>('all');
  const [customDateFrom, setCustomDateFrom] = useState<string>('');
  const [customDateTo, setCustomDateTo] = useState<string>('');
  const [minOrderValue, setMinOrderValue] = useState<string>('');
  const [minUnits, setMinUnits] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearch, setDebouncedSearch] = useState<string>('');

  const { pushToast } = useToast();

  // Get vendorId from localStorage
  const vendorId = getVendorId();

  useEffect(() => {
    if (vendorId) {
      loadOrders();
    } else {
      pushToast({ type: 'error', message: 'Vendor not logged in' });
      setLoading(false);
    }
  }, [vendorId]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchTerm), 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadOrders = async () => {
    try {
      setLoading(true);

      // Get vendor JWT token using utility
      const token = getVendorToken();

      if (!token) {
        pushToast({ type: 'error', message: 'No authentication token found. Please login again.' });
        router.push('/login');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:5000/api/vendors/orders', {
        headers: getVendorAuthHeaders(),
      });

      if (res.status === 401) {
        pushToast({ type: 'error', message: 'Session expired. Please login again.' });
        router.push('/login');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data: OrderResponse[] = await res.json();

      // Map snapshot-based response to UI format
      const validOrders = data
        .filter(orderResponse =>
          orderResponse && orderResponse.status &&
          ['completed', 'cancelled', 'processing', 'pending'].includes(orderResponse.status)
        )
        .map((orderResponse): Order => ({
          _id: orderResponse.order_id,
          orderNumber: orderResponse.order_number,
          customerName: orderResponse.customer.name || 'Unknown',
          customerPhone: orderResponse.customer.phone || 'N/A',
          items: orderResponse.items.map(item => ({ quantity: item.quantity })),
          pricing: {
            totalAmount: orderResponse.total_amount,
          },
          paymentMethod: orderResponse.payment_method || 'COD',
          status: orderResponse.status,
          createdAt: orderResponse.created_at,
        }));

      setAllOrders(validOrders);
    } catch (error: any) {
      pushToast({ type: 'error', message: error.message || 'Failed to load orders' });
      setAllOrders([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter orders based on all criteria
  const filteredOrders = useMemo(() => {
    let filtered = [...allOrders];

    // Search by order id or customer name
    if (debouncedSearch.trim()) {
      const search = debouncedSearch.trim().toLowerCase();
      filtered = filtered.filter(order => {
        const orderId = (order.orderNumber || '').toLowerCase();
        const customerName = (order.customerName || '').toLowerCase();
        return orderId.includes(search) || customerName.includes(search);
      });
    }

    // Status filter (robust: normalize and compare)
    const activeStatuses = statusFilter.size === ALLOWED_STATUSES.length
      ? ALLOWED_STATUSES
      : Array.from(statusFilter).map((s) => s.toLowerCase() as Exclude<OrderStatus, 'all'>);

    if (activeStatuses.length < ALLOWED_STATUSES.length) {
      filtered = filtered.filter(order => activeStatuses.includes((order.status || '').toLowerCase() as any));
    }

    // Date filter
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    if (datePreset !== 'all') {
      filtered = filtered.filter(order => {
        if (!order.createdAt) return false;
        const orderDate = new Date(order.createdAt);

        if (datePreset === 'today') {
          return orderDate >= startOfToday && orderDate <= endOfToday;
        } else if (datePreset === 'month') {
          return orderDate >= startOfMonth && orderDate < startOfNextMonth;
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

    // Min units per order
    if (minUnits) {
      const minUnitsValue = parseInt(minUnits, 10);
      if (!isNaN(minUnitsValue)) {
        filtered = filtered.filter(order => {
          const units = (order.items || []).reduce((sum, item) => sum + (item?.quantity || 0), 0);
          return units >= minUnitsValue;
        });
      }
    }

    // Sort by date descending (newest first)
    filtered.sort((a, b) => {
      if (!a.createdAt || !b.createdAt) return 0;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return filtered;
  }, [allOrders, statusFilter, datePreset, customDateFrom, customDateTo, minOrderValue, minUnits, debouncedSearch]);

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
    setStatusFilter(new Set(ALLOWED_STATUSES));
  };

  const isAllSelected = statusFilter.size === ALLOWED_STATUSES.length;

  const handleOrderClick = (orderId: string) => {
    router.push(`/vendor/orderdetails?orderId=${orderId}`);
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="vendor-order-history-container">
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          Loading order history...
        </div>
      </div>
    );
  }

  return (
    <div className="vendor-order-history-container">
      <header className="page-header">
        <h1 className="page-title">Order History</h1>
        <p className="page-subtitle">Review past orders and performance</p>
      </header>

      {/* FILTERS SECTION */}
      <div className="filters-section">
        <div className="filters-row">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Order ID or Customer name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <div className="status-tabs">
            <button
              className={`status-tab ${isAllSelected ? 'active' : ''}`}
              onClick={setAllStatuses}
            >
              All
            </button>
            <button
              className={`status-tab ${statusFilter.has('pending') ? 'active' : ''}`}
              onClick={() => toggleStatus('pending')}
            >
              Pending
            </button>
            <button
              className={`status-tab ${statusFilter.has('processing') ? 'active' : ''}`}
              onClick={() => toggleStatus('processing')}
            >
              Processing
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
          </div>
        </div>

        <div className="filters-row">
          <div className="date-presets">
            <button
              className={`date-preset-btn ${datePreset === 'today' ? 'active' : ''}`}
              onClick={() => handleDatePresetChange('today')}
            >
              Today
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

          <div className="numeric-filters">
            <input
              type="number"
              className="numeric-input"
              placeholder="Min order value"
              value={minOrderValue}
              onChange={(e) => setMinOrderValue(e.target.value)}
              min="0"
            />
            <input
              type="number"
              className="numeric-input"
              placeholder="Min units per order"
              value={minUnits}
              onChange={(e) => setMinUnits(e.target.value)}
              min="0"
              step="1"
            />
          </div>

          <button
            type="button"
            className="clear-filters-btn"
            onClick={() => {
              setStatusFilter(new Set(ALLOWED_STATUSES));
              setDatePreset('all');
              setCustomDateFrom('');
              setCustomDateTo('');
              setMinOrderValue('');
              setMinUnits('');
              setSearchTerm('');
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Order Date</th>
              <th>Total Amount</th>
              <th>Payment Method</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr
                key={order.orderNumber || order._id}
                onClick={() => handleOrderClick(order._id)}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <td className="order-id-cell">{order.orderNumber || '—'}</td>
                <td className="customer-name-cell">
                  <div>{order.customerName || '—'}</div>
                </td>
                <td className="date-cell">{formatDate(order.createdAt)}</td>
                <td className="amount-cell">₹{order.pricing.totalAmount.toFixed(2)}</td>
                <td className="payment-cell">{order.paymentMethod || 'Cash'}</td>
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
