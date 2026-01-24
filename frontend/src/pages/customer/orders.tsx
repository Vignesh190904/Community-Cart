import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useAuth } from '../../context/AuthContext';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    placedDate: string;
    items: OrderItem[];
    totalItems: number;
    totalPrice: number;
    status: string; // Allow all API statuses
    vendorName: string;
}

const API_BASE = 'http://localhost:5000/api';

export default function OrdersPage() {
    const router = useRouter();
    const { token, is_authenticated } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedOrderIndex, setExpandedOrderIndex] = useState<number | null>(null);

    useEffect(() => {
        if (!is_authenticated && !loading) {
            router.push('/customer/signin');
            return;
        }

        const fetchOrders = async () => {
            if (!token) return;

            try {
                const res = await fetch(`${API_BASE}/customers/orders`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) throw new Error('Failed to fetch orders');

                const data = await res.json();

                const mappedOrders = data.map((order: any) => ({
                    id: order.order_number || order.order_id,
                    placedDate: new Date(order.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    }),
                    items: order.items.map((item: any) => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price
                    })),
                    totalItems: order.items.reduce((acc: number, item: any) => acc + item.quantity, 0),
                    totalPrice: order.total_amount,
                    status: order.status,
                    vendorName: order.vendor?.name || 'Unknown Vendor'
                }));

                setOrders(mappedOrders);
            } catch (err: any) {
                setError(err.message || 'Error loading orders');
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            fetchOrders();
        } else {
            // Wait a bit for token restore if happening
            const timer = setTimeout(() => {
                if (!token) setLoading(false);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [token, is_authenticated, router]);

    const toggleOrder = (index: number) => {
        setExpandedOrderIndex(expandedOrderIndex === index ? null : index);
    };

    if (loading) {
        return (
            <CustomerLayout disablePadding={true}>
                <div className="orders-page" style={{ padding: '20px', textAlign: 'center' }}>
                    <p>Loading your orders...</p>
                </div>
            </CustomerLayout>
        );
    }

    return (
        <CustomerLayout disablePadding={true}>
            <div className="orders-page">
                <div className="orders-header">
                    <button className="orders-back-button" onClick={() => router.back()}>
                        <img src="/customer/assets/icons/backward.svg" alt="Back" width={24} height={24} />
                    </button>
                    <h1 className="orders-title">My Order</h1>
                    <button className="orders-filter-button">
                        <img src="/customer/assets/icons/filter.svg" alt="Filter" width={24} height={24} />
                    </button>
                </div>

                <div className="orders-list">
                    {error && <p className="error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                    {!error && orders.length === 0 && (
                        <div className="empty-state" style={{ textAlign: 'center', padding: '40px' }}>
                            <img src="/customer/assets/icons/order.svg" alt="No Orders" style={{ width: 64, opacity: 0.5, marginBottom: 16 }} />
                            <h3>No orders yet</h3>
                            <p>Start shopping to see your orders here.</p>
                        </div>
                    )}

                    {orders.map((order, index) => (
                        <div key={index} className="order-card">
                            <div
                                className="order-summary"
                                onClick={() => toggleOrder(index)}
                            >
                                <div className="order-icon-container">
                                    <img src="/customer/assets/icons/order.svg" alt="Order" className="order-icon" />
                                </div>
                                <div className="order-info">
                                    <h3 className="order-id">Order {order.id}</h3>
                                    <p className="order-date">Placed on {order.placedDate}</p>
                                    <div className="order-meta">
                                        <span className="order-items">Items: {order.totalItems}</span>
                                        <span className="order-total">Total: ${typeof order.totalPrice === 'number' ? order.totalPrice.toFixed(2) : order.totalPrice}</span>
                                    </div>
                                    <div className="order-vendor" style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                                        {order.vendorName}
                                    </div>
                                </div>
                                <div className="order-status">
                                    <img
                                        src={order.status === 'completed' ? '/customer/assets/icons/check.svg' :
                                            order.status === 'cancelled' ? '/customer/assets/icons/cancel.svg' :
                                                order.status === 'processing' ? '/customer/assets/icons/processing.svg' :
                                                    '/customer/assets/icons/waiting.svg' // Pending icon
                                        }
                                        alt={order.status}
                                        className={`status-icon ${['completed', 'cancelled', 'processing'].includes(order.status) ? order.status : 'pending'}`}
                                    />
                                </div>
                            </div>

                            {expandedOrderIndex === index && (
                                <div className="order-details">
                                    <div className="order-items-list">
                                        {order.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="order-item">
                                                <span className="item-name">{item.name} x {item.quantity}</span>
                                                <span className="item-price">₹{item.price.toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-status-text" style={{ padding: '12px 0 0', fontWeight: 500, textTransform: 'capitalize', color: order.status === 'completed' ? 'green' : order.status === 'cancelled' ? 'red' : 'orange' }}>
                                        Status: {order.status}
                                    </div>
                                    <button className="repeat-order-btn">
                                        Repeat Order
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}
