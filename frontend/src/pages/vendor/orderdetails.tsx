import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useToast } from '../../components/ui/ToastProvider';
import { aggregateOrderItems, AggregatedOrderItem } from '../../utils/orderAggregation';
import { getVendorToken, getVendorId, getVendorAuthHeaders } from '../../utils/vendorAuth';

interface OrderItem {
  productId?: { _id?: string; name: string };
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface AggregatedItem extends AggregatedOrderItem {
  lineTotal: number;
  productName: string;
}

interface Order {
  _id: string;
  orderNumber: string;
  customer_snapshot: {
    name: string;
    phone: string;
    email: string;
  };
  vendorId: {
    _id: string;
    storeName: string;
  } | null;
  items: OrderItem[];
  pricing: {
    subtotal: number;
    deliveryFee?: number;
    tax?: number;
    totalAmount: number;
  };
  delivery_address_snapshot?: {
    community?: string;
    block?: string;
    floor?: string;
    flat_number?: string;
  };
  payment: {
    method: string;
    status: string;
    transactionId?: string;
  };
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export default function VendorOrderDetails() {
  const router = useRouter();
  const { orderId } = router.query;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { pushToast } = useToast();

  const vendorId = getVendorId();

  useEffect(() => {
    if (orderId && vendorId) {
      fetchOrderDetails();
    }
  }, [orderId, vendorId]);

  const fetchOrderDetails = async () => {
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

      const res = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        headers: getVendorAuthHeaders(),
      });

      if (res.status === 401) {
        pushToast({ type: 'error', message: 'Session expired. Please login again.' });
        router.push('/login');
        setLoading(false);
        return;
      }

      if (!res.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await res.json();

      // Verify order belongs to this vendor
      if (data.vendorId?._id !== vendorId) {
        pushToast({
          type: 'error',
          message: 'This order does not belong to your store'
        });
        router.push('/vendor/ordershistory');
        return;
      }

      setOrder(data);
    } catch (error: any) {
      pushToast({
        type: 'error',
        message: error.message || 'Failed to load order details'
      });
      router.push('/vendor/ordershistory');
    } finally {
      setLoading(false);
    }
  };

  // Aggregate items by product ID or name
  const aggregatedItems = useMemo<AggregatedItem[]>(() => {
    if (!order || !order.items || order.items.length === 0) {
      return [];
    }

    // Use utility function to aggregate items
    const aggregated = aggregateOrderItems(order.items);

    // Map to AggregatedItem format with lineTotal
    return aggregated.map(item => ({
      ...item,
      lineTotal: item.price * item.quantity,
      productName: item.name // for compatibility with template
    }));
  }, [order]);

  // Calculate subtotal from aggregated items
  const calculatedSubtotal = useMemo(() => {
    return aggregatedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  }, [aggregatedItems]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatShortOrderId = (orderNumber: string) => {
    // Extract last 6 chars for display
    return orderNumber.slice(-6).toUpperCase();
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'Pending',
      processing: 'Processing',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    return labels[status] || status;
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="order-details-container">
        <div className="loading-state">Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="order-details-container">
        <div className="error-state">Order not found</div>
      </div>
    );
  }

  return (
    <div className="order-details-container">
      <div className="order-details-header">
        <button onClick={handleBack} className="back-button">
          ← Back
        </button>
      </div>

      <div className="order-bill-card">
        {/* ORDER HEADER */}
        <div className="bill-header">
          <div className="bill-title-section">
            <h1 className="bill-title">Order Details</h1>
            <div className="order-id-display">
              Order #{formatShortOrderId(order.orderNumber)}
            </div>
          </div>
          <div className={`order-status-badge ${order.status}`}>
            {getStatusLabel(order.status)}
          </div>
        </div>

        {/* ORDER TIMESTAMPS */}
        <div className="bill-section">
          <h2 className="bill-section-title">Order Information</h2>
          <div className="bill-info-grid">
            <div className="bill-info-item">
              <span className="bill-info-label">Ordered:</span>
              <span className="bill-info-value">{formatDate(order.createdAt)}</span>
            </div>
            {order.status === 'completed' && (
              <div className="bill-info-item">
                <span className="bill-info-label">Completed:</span>
                <span className="bill-info-value">{formatDate(order.updatedAt)}</span>
              </div>
            )}
            {order.status === 'cancelled' && (
              <div className="bill-info-item">
                <span className="bill-info-label">Cancelled:</span>
                <span className="bill-info-value">{formatDate(order.updatedAt)}</span>
              </div>
            )}
          </div>
        </div>

        {/* CUSTOMER DETAILS */}
        <div className="bill-section">
          <h2 className="bill-section-title">Customer Details</h2>
          <div className="bill-info-grid">
            <div className="bill-info-item">
              <span className="bill-info-label">Name:</span>
              <span className="bill-info-value">{order.customer_snapshot?.name || '—'}</span>
            </div>
            {order.customer_snapshot?.phone && (
              <div className="bill-info-item">
                <span className="bill-info-label">Phone:</span>
                <span className="bill-info-value">{order.customer_snapshot.phone}</span>
              </div>
            )}
            {order.customer_snapshot?.email && (
              <div className="bill-info-item">
                <span className="bill-info-label">Email:</span>
                <span className="bill-info-value">{order.customer_snapshot.email}</span>
              </div>
            )}
            {order.delivery_address_snapshot && (
              <div className="bill-info-item full-width">
                <span className="bill-info-label">Delivery Address:</span>
                <span className="bill-info-value">
                  {[
                    order.delivery_address_snapshot.flat_number && `Flat ${order.delivery_address_snapshot.flat_number}`,
                    order.delivery_address_snapshot.floor && `Floor ${order.delivery_address_snapshot.floor}`,
                    order.delivery_address_snapshot.block && `Block ${order.delivery_address_snapshot.block}`,
                    order.delivery_address_snapshot.community
                  ].filter(Boolean).join(', ') || 'N/A'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ITEMIZED TABLE - AGGREGATED */}
        <div className="bill-section">
          <h2 className="bill-section-title">Order Items</h2>
          <div className="bill-table-wrapper">
            <table className="bill-table">
              <thead>
                <tr>
                  <th className="item-name-col">Item Name</th>
                  <th className="item-price-col">Price</th>
                  <th className="item-qty-col">Qty</th>
                  <th className="item-total-col">Total</th>
                </tr>
              </thead>
              <tbody>
                {aggregatedItems.map((item) => (
                  <tr key={item.productId}>
                    <td className="item-name-cell">{item.productName}</td>
                    <td className="item-price-cell">₹{item.price.toFixed(2)}</td>
                    <td className="item-qty-cell">{item.quantity}</td>
                    <td className="item-total-cell">₹{item.lineTotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ORDER SUMMARY */}
        <div className="bill-section">
          <div className="bill-summary">
            <div className="bill-summary-row">
              <span className="bill-summary-label">Subtotal:</span>
              <span className="bill-summary-value">₹{calculatedSubtotal.toFixed(2)}</span>
            </div>
            <div className="bill-summary-row">
              <span className="bill-summary-label">Payment Method:</span>
              <span className="bill-summary-value">{order.payment?.method || 'COD'}</span>
            </div>
            <div className="bill-summary-row bill-total">
              <span className="bill-summary-label">Total:</span>
              <span className="bill-summary-value">₹{order.pricing.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* NOTES */}
        {order.notes && (
          <div className="bill-section">
            <h2 className="bill-section-title">Notes</h2>
            <div className="bill-notes">
              <div className="bill-note-item">
                <strong>Order Notes:</strong> {order.notes}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
