import { useEffect, useState, useMemo } from 'react';

interface Order {
  _id: string;
  orderNumber: string;
  customerId: {
    _id?: string;
    name?: string;
    email?: string;
  };
  vendorId: {
    _id?: string;
    name?: string;
  };
  pricing?: {
    totalAmount?: number;
  };
  total?: number;
  status: string;
  createdAt?: string;
}

interface Vendor {
  _id: string;
  name: string;
  isActive: boolean;
  email?: string;
}

interface Customer {
  _id: string;
  name?: string;
  email?: string;
  isActive?: boolean;
}

const API_BASE = 'http://localhost:5000/api';

export default function AdminDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [ordersRes, vendorsRes, customersRes] = await Promise.all([
          fetch(`${API_BASE}/orders`),
          fetch(`${API_BASE}/vendors`),
          fetch(`${API_BASE}/customers`),
        ]);

        if (!ordersRes.ok || !vendorsRes.ok || !customersRes.ok) {
          throw new Error('Failed to fetch data');
        }

        const ordersData = await ordersRes.json();
        const vendorsData = await vendorsRes.json();
        const customersData = await customersRes.json();

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setVendors(Array.isArray(vendorsData) ? vendorsData : []);
        setCustomers(Array.isArray(customersData) ? customersData : []);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Calculate stats from real data
  const stats = useMemo(() => {
    const totalVendors = vendors.length;
    const totalCustomers = customers.length;
    const totalOrders = orders.length;
    
    // Platform revenue is 5% of completed orders total value
    const completedOrdersTotal = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => {
        const total = o.pricing?.totalAmount || o.total || 0;
        return sum + total;
      }, 0);
    const platformRevenue = completedOrdersTotal * 0.05;

    return [
      { title: 'Total Vendors', value: totalVendors.toString() },
      { title: 'Total Customers', value: totalCustomers.toString() },
      { title: 'Total Orders', value: totalOrders.toString() },
      { title: 'Platform Revenue', value: `₹${platformRevenue.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` },
    ];
  }, [vendors, customers, orders]);

  // Calculate vendor onboarding stats
  const onboarding = useMemo(() => ({
    pendingKyc: vendors.filter((v) => !v.isActive).length,
    awaitingApproval: 0, // This would require a separate status field in Vendor model
    activeVendors: vendors.filter((v) => v.isActive).length,
  }), [vendors]);

  // Recent orders (last 5) - sorted by createdAt descending
  const recentOrders = useMemo(() => {
    return orders
      .sort((a, b) => {
        const dateA = new Date(a.createdAt || 0).getTime();
        const dateB = new Date(b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .slice(0, 5)
      .map((o) => {
        const totalAmount = o.pricing?.totalAmount || o.total || 0;
        return {
          id: o.orderNumber || o._id,
          customer: o.customerId?.name || o.customerId?.email || 'Unknown',
          vendor: o.vendorId?.name || 'Unknown',
          total: `₹${totalAmount.toFixed(2)}`,
          status: o.status || 'pending',
        };
      });
  }, [orders]);

  return (
    <>
      <h1 className="adm-title">Admin Dashboard</h1>

      {error && <div className="page-state error">{error}</div>}

      {loading && <div className="page-state">Loading dashboard data…</div>}

      {!loading && !error && (
        <>
          <div className="card-grid">
            {stats.map((s) => (
              <div className="card" key={s.title}>
                <div className="card-title">{s.title}</div>
                <div className="card-value">{s.value}</div>
              </div>
            ))}
          </div>

          <section className="adm-section">
            <h2 className="section-title">Recent Orders</h2>
            {recentOrders.length === 0 ? (
              <div className="page-state">No orders yet.</div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Vendor</th>
                    <th>Total</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id}>
                      <td>{o.id}</td>
                      <td>{o.customer}</td>
                      <td>{o.vendor}</td>
                      <td>{o.total}</td>
                      <td>
                        <span className={`badge ${o.status === 'completed' ? 'success' : o.status === 'pending' ? 'warn' : o.status === 'cancelled' ? 'danger' : ''}`}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>

          <section className="adm-section">
            <h2 className="section-title">Vendor Onboarding</h2>
            <div className="adm-onboarding">
              <div className="card">
                <div className="card-title">Inactive Vendors</div>
                <div className="card-value">{onboarding.pendingKyc}</div>
              </div>
              <div className="card">
                <div className="card-title">Awaiting Approval</div>
                <div className="card-value">{onboarding.awaitingApproval}</div>
              </div>
              <div className="card">
                <div className="card-title">Active Vendors</div>
                <div className="card-value">{onboarding.activeVendors}</div>
              </div>
            </div>
          </section>
        </>
      )}
    </>
  );
}
