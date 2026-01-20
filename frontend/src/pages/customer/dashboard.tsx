import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';

interface OrderSummary {
    _id: string;
    status: string;
    createdAt: string;
    totalAmount?: number;
}

export default function CustomerDashboard() {
    const { ensureCustomerId, totalItems, cart } = useCustomerStore();
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
            <div className="home-page">
                {/* Welcome Header */}
                <div className="welcome-header">
                    <div>
                        <p className="welcome-greeting">Welcome back! 👋</p>
                        <h1 className="welcome-title">Community Cart</h1>
                    </div>
                </div>

                {/* Quick Stats */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon"><img src="/customer/assets/icons/bag.svg" alt="Orders" style={{ width: '24px', height: '24px' }} /></div>
                        <div className="stat-info">
                            <p className="stat-value">{totalOrders}</p>
                            <p className="stat-label">Total Orders</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon"><img src="/customer/assets/icons/cart.svg" alt="Cart" style={{ width: '24px', height: '24px' }} /></div>
                        <div className="stat-info">
                            <p className="stat-value">{totalItems}</p>
                            <p className="stat-label">Cart Items</p>
                        </div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="quick-actions">
                    <h2 className="section-heading">Quick Actions</h2>
                    <div className="action-grid">
                        <Link href="/customer/browse-products" className="action-card">
                            <img src="/customer/assets/icons/bag.svg" alt="Browse" className="action-icon" style={{ width: '24px', height: '24px' }} />
                            <span className="action-label">Browse Products</span>
                        </Link>
                        <Link href="/customer/cart" className="action-card">
                            <img src="/customer/assets/icons/cart.svg" alt="Cart" className="action-icon" style={{ width: '24px', height: '24px' }} />
                            <span className="action-label">View Cart</span>
                        </Link>
                        <Link href="/customer/track-order" className="action-card">
                            <img src="/customer/assets/icons/location.svg" alt="Track" className="action-icon" style={{ width: '24px', height: '24px' }} />
                            <span className="action-label">Track Orders</span>
                        </Link>
                        <Link href="/customer/profile" className="action-card">
                            <img src="/customer/assets/icons/profile.svg" alt="Settings" className="action-icon" style={{ width: '24px', height: '24px' }} />
                            <span className="action-label">Settings</span>
                        </Link>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="recent-section">
                    <div className="section-header">
                        <h2 className="section-heading">Recent Orders</h2>
                        <Link href="/customer/track-order" className="see-all-link">See all ›</Link>
                    </div>

                    {loading ? (
                        <div className="loading-state">Loading orders...</div>
                    ) : orders.length === 0 ? (
                        <div className="empty-state">
                            <img src="/customer/assets/icons/bag.svg" alt="No orders" className="empty-icon" style={{ width: '48px', height: '48px' }} />
                            <p className="empty-text">No orders yet</p>
                            <Link href="/customer/browse-products" className="empty-action">Start Shopping</Link>
                        </div>
                    ) : (
                        <div className="order-preview-list">
                            {orders.slice(0, 3).map((order) => (
                                <div key={order._id} className="order-preview-card">
                                    <div className="order-preview-header">
                                        <span className="order-id">#{order._id.slice(-6)}</span>
                                        <span className={`order-status status-${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <p className="order-date">
                                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                            day: 'numeric',
                                            month: 'short',
                                            year: 'numeric'
                                        })}
                                    </p>
                                    {order.totalAmount && (
                                        <p className="order-amount">₹{order.totalAmount.toFixed(2)}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
