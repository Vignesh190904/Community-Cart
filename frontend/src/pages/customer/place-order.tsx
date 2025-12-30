import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';

const API_BASE = 'http://localhost:5000/api';

export default function PlaceOrderPage() {
  const router = useRouter();
  const { cart, customerId, ensureCustomerId, clearCart, totalPrice } = useCustomerStore();
  const [placing, setPlacing] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    ensureCustomerId();
  }, [ensureCustomerId]);

  const placeOrder = async () => {
    setMessage('');
    setError('');
    if (!cart.length) {
      setError('Cart is empty.');
      return;
    }

    const cid = customerId || (await ensureCustomerId());
    if (!cid) {
      setError('Customer not ready.');
      return;
    }

    setPlacing(true);
    try {
      const productIds: string[] = [];
      cart.forEach((item) => {
        for (let i = 0; i < item.quantity; i += 1) {
          productIds.push(item.product._id);
        }
      });

      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: cid, productIds }),
      });

      if (!res.ok) throw new Error('Failed to place order');
      const order = await res.json();
      clearCart();
      setMessage(`Order placed successfully (Order ID: ${order.orderNumber || order._id})`);
      router.push('/customer/track-order');
    } catch (err: any) {
      setError(err.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <CustomerLayout>
      <div className="place-page">
        <div className="page-head">
          <div>
            <p className="page-kicker">Place Order</p>
            <h1 className="page-title">Review and Submit</h1>
            <p className="page-subtitle">We will send this order to the vendor for processing.</p>
          </div>
        </div>

        {cart.length === 0 ? (
          <div className="page-state">Your cart is empty. Add products first.</div>
        ) : (
          <div className="review-card">
            <div className="review-items">
              {cart.map((item) => (
                <div key={item.product._id} className="review-row">
                  <div>
                    <p className="review-name">{item.product.name}</p>
                    <p className="review-meta">Qty: {item.quantity}</p>
                  </div>
                  <p className="review-price">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="review-total">
              <span>Total</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            <button className="btn-primary full" onClick={placeOrder} disabled={placing}>
              {placing ? 'Placing…' : 'Place Order'}
            </button>
            {message && <div className="notice success">{message}</div>}
            {error && <div className="notice error">{error}</div>}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
