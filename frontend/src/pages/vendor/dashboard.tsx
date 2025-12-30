import { useState, useEffect, useMemo } from 'react';

interface Product {
  _id: string;
  name: string;
  stock: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  customerId: {
    name?: string;
    email?: string;
  };
  total?: number;
  pricing?: {
    subtotal?: number;
    deliveryFee?: number;
    tax?: number;
    totalAmount?: number;
  };
  items?: Array<{
    total?: number;
  }>;
  status: string;
  createdAt: string;
}

const API_BASE = 'http://localhost:5000/api';

const orderTotal = (order: Order) => {
  const pricingTotal = order.pricing?.totalAmount;
  if (typeof pricingTotal === 'number' && !Number.isNaN(pricingTotal)) return pricingTotal;

  const itemsTotal = Array.isArray(order.items)
    ? order.items.reduce((sum, item) => sum + (item.total || 0), 0)
    : 0;

  if (itemsTotal > 0) return itemsTotal;

  if (typeof order.total === 'number' && !Number.isNaN(order.total)) return order.total;

  return 0;
};

export default function VendorDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [vendorId, setVendorId] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cc_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          setVendorId(parsed.id);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (vendorId) {
      fetchData();
    }
  }, [vendorId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, ordersRes] = await Promise.all([
        fetch(`${API_BASE}/products`),
        fetch(`${API_BASE}/orders?vendorId=${vendorId}`),
      ]);

      if (productsRes.ok) {
        const allProducts = await productsRes.json();
        const vendorProducts = allProducts.filter((p: any) => {
          const pVendorId = typeof p.vendor === 'object' ? p.vendor._id : p.vendor;
          return pVendorId === vendorId;
        });
        setProducts(vendorProducts);
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (error) {
      // Silent error
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalProducts = products.length;
    const lowStockCount = products.filter((p) => p.stock <= 5).length;

    const totalOrders = orders.filter((o) => o.status === 'completed' || o.status === 'cancelled').length;

    const totalRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + orderTotal(o), 0);

    return [
      { title: 'Total Products', value: totalProducts.toString() },
      { title: 'Total Orders', value: totalOrders.toString() },
      { title: 'Total Revenue', value: `₹${totalRevenue.toLocaleString('en-IN')}` },
      { title: 'Low Stock Items', value: lowStockCount.toString() },
    ];
  }, [products, orders]);

  const recentOrders = useMemo(() => {
    return orders
      .slice(0, 5)
      .map((o) => ({
        id: o.orderNumber,
        customer: o.customerId?.name || o.customerId?.email || 'Unknown',
        total: `₹${orderTotal(o).toFixed(2)}`,
        status: o.status.charAt(0).toUpperCase() + o.status.slice(1),
        statusClass: o.status === 'completed' ? 'success' : o.status === 'cancelled' ? 'danger' : o.status === 'pending' ? 'warn' : '',
      }));
  }, [orders]);

  const lowStock = useMemo(() => {
    return products
      .filter((p) => p.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5)
      .map((p) => ({
        sku: p._id.slice(-8).toUpperCase(),
        name: p.name,
        qty: p.stock,
      }));
  }, [products]);

  if (loading) {
    return <div className="page-state">Loading dashboard…</div>;
  }

  return (
    <>
      <h1 className="ven-title">Vendor Dashboard</h1>
      <div className="card-grid">
        {stats.map((s) => (
          <div className="card" key={s.title}>
            <div className="card-title">{s.title}</div>
            <div className="card-value">{s.value}</div>
          </div>
        ))}
      </div>

      <section className="ven-section">
        <h2 className="section-title">Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <div className="page-state">No orders yet.</div>
        ) : (
          <div className="list">
            {recentOrders.map((o) => (
              <div className="list-item" key={o.id}>
                <div>
                  <div>{o.id} • {o.customer}</div>
                  <div className="card-title">Total: {o.total}</div>
                </div>
                <span className={`badge ${o.statusClass}`}>{o.status}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="ven-section">
        <h2 className="section-title">Low Stock Alerts</h2>
        {lowStock.length === 0 ? (
          <div className="page-state">All products have adequate stock.</div>
        ) : (
          <div className="list">
            {lowStock.map((i) => (
              <div className="list-item" key={i.sku}>
                <div>
                  <div>{i.name}</div>
                  <div className="card-title">SKU-{i.sku}</div>
                </div>
                <span className={`badge danger`}>Qty: {i.qty}</span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
