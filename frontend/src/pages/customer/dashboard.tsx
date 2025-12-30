import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';

interface OrderSummary {
  _id: string;
  status: string;
  createdAt: string;
}

export default function CustomerDashboard() {
  const { ensureCustomerId } = useCustomerStore();
  const [orders, setOrders] = useState<OrderSummary[]>([]);
  const [loading, setLoading] = useState(true);

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
        setOrders(mine);
      } catch (_) {
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ensureCustomerId]);

  const totalOrders = orders.length;
  const lastOrder = useMemo(() => {
    if (!orders.length) return null;
    return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  }, [orders]);

  return (
    <CustomerLayout>
      <div className="customer-dash">
        <header className="dash-header">
          <div>
            <p className="dash-kicker">Customer Test Dashboard</p>
            <h1 className="dash-title">Welcome back</h1>
            <p className="dash-subtitle">Use this sandbox to place and track test orders.</p>
          </div>
          <div className="dash-actions">
            <Link href="/customer/browse-products" className="btn-primary">Browse Products</Link>
            <Link href="/customer/cart" className="btn-secondary">View Cart</Link>
          </div>
        </header>

        {loading ? (
          <div className="dash-loading">Loading your summary…</div>
        ) : (
          <div className="dash-grid">
            <div className="dash-card">
              <p className="card-label">Total Orders</p>
              <p className="card-value">{totalOrders}</p>
              <p className="card-hint">All orders created by this test customer</p>
            </div>
            <div className="dash-card">
              <p className="card-label">Last Order Status</p>
              <p className="card-value">{lastOrder ? lastOrder.status : '—'}</p>
              <p className="card-hint">Most recent order placed</p>
            </div>
            <div className="dash-card">
              <p className="card-label">Quick Links</p>
              <div className="quick-links">
                <Link href="/customer/place-order" className="link-ghost">Place Order</Link>
                <Link href="/customer/track-order" className="link-ghost">Track Orders</Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
