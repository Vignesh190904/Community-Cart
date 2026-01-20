import { useEffect, useState } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';

interface Order {
  _id: string;
  status: string;
  createdAt: string;
  totalAmount?: number;
  items?: Array<{
    productId: { name: string };
    quantity: number;
  }>;
  deliveryAddress?: string;
}

export default function TrackOrderPage() {
  const { ensureCustomerId } = useCustomerStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const cid = await ensureCustomerId();
      if (!cid) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('http://localhost:5000/api/orders');
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        const mine = data.filter((o: any) => o.customerId && (o.customerId._id === cid || o.customerId === cid));
        // Sort by most recent first
        mine.sort((a: Order, b: Order) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(mine);
      } catch (_) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ensureCustomerId]);

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'pending') return 'status-pending';
    if (s === 'confirmed' || s === 'delivered') return 'status-success';
    if (s === 'cancelled') return 'status-error';
    return 'status-default';
  };

  return (
    <CustomerLayout>
      <div className="orders-page">
        {/* Header */}
        <div className="orders-header">
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-subtitle">{orders.length} {orders.length === 1 ? 'order' : 'orders'}</p>
        </div>

        {loading ? (
          <div className="orders-loading">Loading your orders...</div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <span className="empty-icon">📦</span>
            <p className="empty-text">No orders yet</p>
            <p className="empty-subtext">Start shopping to see your orders here</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => {
              const isExpanded = expandedOrder === order._id;
              return (
                <div key={order._id} className={`order-card ${isExpanded ? 'expanded' : ''}`}>
                  <div className="order-card-header" onClick={() => toggleExpand(order._id)}>
                    <div className="order-main-info">
                      <p className="order-id">Order #{order._id.slice(-8).toUpperCase()}</p>
                      <p className="order-date">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="order-status-row">
                      <span className={`order-status ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                      <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="order-card-details">
                      <div className="order-detail-divider"></div>

                      {order.items && order.items.length > 0 && (
                        <div className="order-items-section">
                          <p className="detail-heading">Items</p>
                          {order.items.map((item, idx) => (
                            <div key={idx} className="order-item-row">
                              <span className="item-name">
                                {item.productId?.name || 'Product'} × {item.quantity}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {order.deliveryAddress && (
                        <div className="order-detail-section">
                          <p className="detail-heading">Delivery Address</p>
                          <p className="detail-text">{order.deliveryAddress}</p>
                        </div>
                      )}

                      {order.totalAmount && (
                        <div className="order-total-section">
                          <span className="total-label">Total Amount</span>
                          <span className="total-value">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
