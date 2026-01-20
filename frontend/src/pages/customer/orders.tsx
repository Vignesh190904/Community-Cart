import { useState } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';

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
    status: 'completed' | 'failed';
}

const MOCK_ORDERS: Order[] = [
    {
        id: '#90897',
        placedDate: 'October 19 2021',
        items: [
            { name: 'Momos', quantity: 1, price: 12.75 },
            { name: 'Chicken', quantity: 1, price: 14.91 },
            { name: 'Noodles', quantity: 1, price: 6.34 }
        ],
        totalItems: 10,
        totalPrice: 16.80,
        status: 'completed'
    },
    {
        id: '#90897',
        placedDate: 'October 19 2021',
        items: [
            { name: 'Momos', quantity: 1, price: 12.75 },
            { name: 'Chicken', quantity: 1, price: 14.91 }
        ],
        totalItems: 10,
        totalPrice: 16.80,
        status: 'completed'
    },
    {
        id: '#90897',
        placedDate: 'October 19 2021',
        items: [
            { name: 'Momos', quantity: 1, price: 12.75 }
        ],
        totalItems: 10,
        totalPrice: 16.80,
        status: 'completed'
    },
    {
        id: '#90897',
        placedDate: 'October 19 2021',
        items: [
            { name: 'Momos', quantity: 1, price: 12.75 },
            { name: 'Chicken', quantity: 1, price: 14.91 }
        ],
        totalItems: 10,
        totalPrice: 16.80,
        status: 'failed'
    },
    {
        id: '#90897',
        placedDate: 'October 19 2021',
        items: [
            { name: 'Momos', quantity: 1, price: 12.75 }
        ],
        totalItems: 10,
        totalPrice: 16.80,
        status: 'completed'
    }
];

export default function OrdersPage() {
    const router = useRouter();
    const [expandedOrderIndex, setExpandedOrderIndex] = useState<number | null>(null);

    const toggleOrder = (index: number) => {
        setExpandedOrderIndex(expandedOrderIndex === index ? null : index);
    };

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
                    {MOCK_ORDERS.map((order, index) => (
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
                                        <span className="order-total">Items: ${order.totalPrice.toFixed(2)}</span>
                                    </div>
                                </div>
                                <div className="order-status">
                                    <img
                                        src={order.status === 'completed' ? '/customer/assets/icons/check.svg' : '/customer/assets/icons/cancel.svg'}
                                        alt={order.status}
                                        className="status-icon"
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
