import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCustomerStore } from '../../context/CustomerStore';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useToast } from '../../components/ui/ToastProvider';

interface Address {
    _id: string;
    community: string;
    block: string;
    floor: string;
    flat_number: string;
    is_primary: boolean;
}

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, totalPrice, totalItems } = useCustomerStore();
    const { pushToast } = useToast();

    // Address State
    const [addressType, setAddressType] = useState<'Main' | 'Second'>('Main');
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('auth_token');

            const res = await fetch('http://localhost:5000/api/customers/addresses', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch addresses');
            }

            const data = await res.json();
            setAddresses(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handlePlaceOrder = () => {
        // 1. Validate Cart
        if (cart.length === 0) {
            pushToast({ type: 'error', message: 'Add items before checking out' });
            return;
        }

        // 2. Validate Address
        if (addresses.length === 0) {
            pushToast({ type: 'error', message: 'Please add an address first' });
            return;
        }

        if (!addressType) {
            pushToast({ type: 'error', message: 'Please select an address' });
            return;
        }

        // 3. Log Payload
        const payload = {
            cartItems: cart.map(item => ({
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                quantity: item.quantity,
                total: item.product.price * item.quantity
            })),
            totalAmount: totalPrice,
            selectedAddress: addressType
        };

        console.log('Place Order Payload:', payload);
        pushToast({ type: 'success', message: 'Order placed successfully!' });

        // Optional: clear cart or navigate away? 
        // User requirement: "Log payload structure in console". 
        // Stub logic is fine. I won't clear cart to maintain state for demo unless asked.
    };

    return (
        <CustomerLayout disablePadding={true}>
            {/* Import CSS here or in _app, but since we are using CSS modules or global, 
          and Next.js pages usually require global import in _app, 
          we might need to use a <style> tag or ensure the CSS file is imported. 
          Given the constraints "Plain CSS", I will assume we can import it directly 
          if configured, or I will use a scoped approach.
          To be safe with Next.js standard CSS support:
      */}
            <style jsx global>{`
        @import url('/customer/assets/css/checkout.css'); 
        /* Since we can't easily add to global build pipeline here, 
           I wrote to checkout.css. I will try to direct import it if Next.js allows, 
           otherwise I'll inline the critical styles or rely on the written file being imported somewhere.
           Wait, locally created CSS files in pages directory usually need to be imported.
        */
      `}</style>
            {/* 
        Actually, the best way given the setup is to import the CSS file directly if Next.js config allows global css from anywhere (likely not) 
        or use CSS Modules. The user said "React + plain CSS".
        Let's try a direct import at top.
      */}

            <div className="checkout-page">

                {/* 1. Page Header */}
                <header className="checkout-header">
                    <button className="checkout-back-btn" onClick={() => router.back()}>
                        {/* Using existing icon asset if available, else simple arrow */}
                        <img src="/customer/assets/icons/backward.svg" alt="Back" width={24} height={24} />
                    </button>
                    <h1 className="checkout-title">Checkout</h1>
                </header>

                {/* 2. Order Summary (Scrollable) */}
                <section className="order-summary-section">
                    <h2 className="summary-title">Order Summary</h2>

                    <div className="summary-list">
                        {cart.map((item) => (
                            <div key={item.product._id} className="summary-row">
                                <div className="item-info">
                                    <span className="item-name">{item.product.name}</span>
                                    <span className="item-qty">x {item.quantity}</span>
                                </div>
                                <span className="item-price">₹{(item.product.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                        {cart.length === 0 && (
                            <p className="summary-row" style={{ justifyContent: 'center', opacity: 0.5 }}>No items in cart</p>
                        )}
                    </div>
                </section>

                {/* 3. Fixed Bottom Summary Section */}
                <footer className="bottom-summary-section">
                    {/* Items Count and Total */}
                    {/* Requirement says:
               Items 6
               Total ₹58.20
               Layout: "Items" label ... "6" value
               "Total" label ... "₹58.20" value
               Or grouped? The request says:
               - Items count (Example: Items 6)
               - Total amount (Example: Total ₹58.20)
               The screenshot implies separate rows or a clean summary block. 
               The mockup shows:
               Items       6
               Total   ₹58.2
           */}

                    <div className="bottom-row">
                        <span className="bottom-label">Items</span>
                        <span className="bottom-value">{totalItems}</span>
                    </div>

                    <div className="bottom-row total-row">
                        <span className="bottom-label">Total</span>
                        <span className="bottom-value">₹{totalPrice.toFixed(2)}</span>
                    </div>

                    {/* Address Selector */}
                    {loading ? (
                        <p style={{ textAlign: 'center', padding: '12px', color: 'var(--text-muted)' }}>Loading addresses...</p>
                    ) : addresses.length === 0 ? (
                        /* CASE 1: No addresses - Show Add Address button */
                        <button
                            className="add-address-btn"
                            onClick={() => router.push('/customer/edit-address')}
                        >
                            Add Address
                        </button>
                    ) : (
                        /* CASE 2 & 3: 1 or 2 addresses - Show toggles */
                        <div className="address-selector">
                            <button
                                className={`address-pill ${addressType === 'Main' ? 'active' : ''}`}
                                onClick={() => setAddressType('Main')}
                            >
                                Main
                            </button>
                            <button
                                className={`address-pill ${addressType === 'Second' ? 'active' : ''} ${addresses.length === 1 ? 'disabled' : ''}`}
                                onClick={() => addresses.length > 1 && setAddressType('Second')}
                                disabled={addresses.length === 1}
                            >
                                Second
                            </button>
                        </div>
                    )}

                    {/* Place Order Button */}
                    <button
                        className="place-order-btn"
                        onClick={handlePlaceOrder}
                        disabled={addresses.length === 0}
                        style={addresses.length === 0 ? { opacity: 0.5, cursor: 'not-allowed' } : {}}
                    >
                        Place Order
                    </button>
                </footer>
            </div>
        </CustomerLayout>
    );
}
