import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useAuth } from '../../context/AuthContext';
import { useCustomerStore } from '../../context/CustomerStore';
import { useToast } from '../../components/ui/ToastProvider';
import { customerFetch } from '../../utils/customerFetch';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
    productId: string;
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

const SkeletonOrderCard = () => (
    <div className="order-card">
        <div className="order-summary" style={{ pointerEvents: 'none' }}>
            <div className="order-icon-container">
                <div className="skeleton" style={{ width: '40px', height: '40px', borderRadius: '50%' }}></div>
            </div>
            <div className="order-info" style={{ flex: 1 }}>
                <div className="skeleton skeleton-text" style={{ width: '120px', height: '1.2em', marginBottom: '8px' }}></div>
                <div className="skeleton skeleton-text" style={{ width: '180px', height: '1em', marginBottom: '8px' }}></div>
                <div className="order-meta" style={{ display: 'flex', gap: '12px' }}>
                    <div className="skeleton skeleton-text" style={{ width: '60px', height: '1em' }}></div>
                    <div className="skeleton skeleton-text" style={{ width: '80px', height: '1em' }}></div>
                </div>
                <div className="skeleton skeleton-text" style={{ width: '100px', height: '0.8em', marginTop: '4px' }}></div>
            </div>
            <div className="order-status">
                <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '50%' }}></div>
            </div>
        </div>
    </div>
);

export default function OrdersPage() {
    const router = useRouter();
    const { token, is_authenticated } = useAuth();
    const { addToCart, clearCart } = useCustomerStore();
    const { pushToast } = useToast();
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
                const res = await customerFetch(`${API_BASE}/customers/orders`, {
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
                        price: item.price,
                        productId: item.product_id
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

    const truncate = (str: string, max: number) => {
        return str.length > max ? str.substring(0, max) + '...' : str;
    };

    const handleRepeatOrder = async (order: Order) => {
        try {
            // 1. Fetch current products to validate stock
            const res = await customerFetch(`${API_BASE}/products`);
            if (!res.ok) throw new Error('Failed to fetch product data');
            const allProducts = await res.json();

            // 2. Clear current cart
            await clearCart();

            // 3. Process items
            let itemsAdded = 0;

            for (const item of order.items) {
                const product = allProducts.find((p: any) => p._id === item.productId);

                // Case 1: Product Unavailable
                if (!product || product.isAvailable === false || (product.stock || 0) <= 0) {
                    pushToast({
                        type: 'error',
                        message: `${truncate(item.name, 15)} not available`
                    });
                    continue;
                }

                // Case 2: Low Stock
                const stock = product.stock || 0;
                let quantityToAdd = item.quantity;

                if (item.quantity > stock) {
                    quantityToAdd = stock;
                    pushToast({
                        type: 'warning',
                        message: `Please check ${truncate(item.name, 15)}`
                    });
                }

                // Add to cart
                await addToCart({
                    _id: product._id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    vendorName: product.vendor?.name,
                    stock: product.stock,
                    category: product.category
                }, stock, quantityToAdd); // Passing maxStock checks constraints in store if any

                itemsAdded++;
            }

            // 4. Navigate if items were added
            if (itemsAdded > 0) {
                router.push('/customer/checkout');
            } else {
                if (order.items.length > 0) {
                    // All items failed
                    // Toast handled per item, but maybe a generic one?
                    // Requirement implies specific toasts, so we are good.
                }
            }

        } catch (error) {
            console.error('Repeat order failed', error);
            pushToast({ type: 'error', message: 'Failed to repeat order' });
        }
    };

    if (loading) {
        return (
            <CustomerLayout disablePadding={true}>
                <div className="orders-page">
                    <div className="orders-header">
                        <button className="orders-back-button" onClick={() => router.back()}>
                            <img src="/customer/assets/icons/backward.svg" alt="Back" width={24} height={24} />
                        </button>
                        <h1 className="orders-title">My Order</h1>
                    </div>
                    <div className="orders-list">
                        {Array.from({ length: 5 }).map((_, idx) => (
                            <SkeletonOrderCard key={`skeleton-order-${idx}`} />
                        ))}
                    </div>
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
                                    <div className="order-id">{order.id}</div>
                                    <div className="order-date">{order.placedDate}</div>

                                    <div className="order-meta">
                                        <span className="order-items">{order.totalItems} items</span>
                                        <span className="order-vendor">{order.vendorName}</span>
                                    </div>
                                </div>

                                <div className="order-status">
                                    <img
                                        src={
                                            order.status === 'completed'
                                                ? '/customer/assets/icons/check.svg'
                                                : order.status === 'cancelled'
                                                    ? '/customer/assets/icons/cancel.svg'
                                                    : order.status === 'processing'
                                                        ? '/customer/assets/icons/processing.svg'
                                                        : '/customer/assets/icons/waiting.svg'
                                        }
                                        alt={order.status}
                                        className={`status-icon ${['completed', 'cancelled', 'processing'].includes(order.status)
                                            ? order.status
                                            : 'pending'
                                            }`}
                                    />

                                    <div className="order-total">
                                        ${typeof order.totalPrice === 'number'
                                            ? order.totalPrice.toFixed(2)
                                            : order.totalPrice}
                                    </div>
                                </div>
                            </div>

                            {expandedOrderIndex === index && (
                                <div className="order-details">
                                    <div className="order-items-list">
                                        {order.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="order-item">
                                                <span className="item-name">{item.name} x {item.quantity}</span>
                                                <span className="item-price">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button
                                        className="repeat-order-btn"
                                        onClick={() => handleRepeatOrder(order)}
                                    >
                                        Repeat Order
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </CustomerLayout >
    );
}
