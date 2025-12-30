import { useEffect, useState } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';

interface OrderItem {
  _id: string;
  orderNumber?: string;
  vendorId?: { name?: string } | string;
  pricing?: { totalAmount?: number };
  status: string;
  createdAt: string;
  customerId?: any;
}

const API_BASE = 'http://localhost:5000/api';

export default function TrackOrderPage() {
  const { ensureCustomerId } = useCustomerStore();
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      const cid = await ensureCustomerId();
      if (!cid) {
        setLoading(false);
        setError('Customer not ready.');
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/orders`);
        if (!res.ok) throw new Error('Failed to fetch orders');
        const data = await res.json();
        const mine = data.filter((o: any) => o.customerId && (o.customerId._id === cid || o.customerId === cid));
        setOrders(mine);
      } catch (err: any) {
        setError(err.message || 'Failed to load orders');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ensureCustomerId]);

  return (
    <CustomerLayout>
      <div className="track-page">
        <div className="page-head">
          <div>
            <p className="page-kicker">Track</p>
            <h1 className="page-title">Your Orders</h1>
            <p className="page-subtitle">Latest statuses reflect backend changes.</p>
          </div>
        </div>

        {loading && <div className="page-state">Loading orders…</div>}
        {error && !loading && <div className="page-state error">{error}</div>}

        {!loading && !error && (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-row">
                  <span className="label">Order</span>
                  <span className="value">{order.orderNumber || order._id}</span>
                </div>
                <div className="order-row">
                  <span className="label">Vendor</span>
                  <span className="value">{typeof order.vendorId === 'object' ? order.vendorId?.name : 'Vendor'}</span>
                </div>
                <div className="order-row">
                  <span className="label">Total</span>
                  <span className="value">₹{order.pricing?.totalAmount?.toFixed(2) || '0.00'}</span>
                </div>
                <div className="order-row">
                  <span className={`status-badge ${order.status}`}>{order.status}</span>
                  <span className="order-date">{new Date(order.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
            {orders.length === 0 && <div className="page-state">No orders yet.</div>}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
