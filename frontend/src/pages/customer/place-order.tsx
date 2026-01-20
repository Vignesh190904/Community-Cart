import { useState } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';
import { useToast } from '../../components/ui/ToastProvider';

export default function PlaceOrderPage() {
  const router = useRouter();
  const { cart, totalPrice, totalItems, clearCart, customerId } = useCustomerStore();
  const { pushToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: '',
    phone: '',
    notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerId) {
      pushToast({ type: 'error', title: 'Error', message: 'Customer ID not found' });
      return;
    }

    if (cart.length === 0) {
      pushToast({ type: 'warning', title: 'Empty Cart', message: 'Your cart is empty' });
      return;
    }

    setLoading(true);

    try {
      const orderPayload = {
        customerId,
        items: cart.map((item) => ({
          productId: item.product._id,
          quantity: item.quantity,
          price: item.product.price,
        })),
        deliveryAddress: formData.deliveryAddress || 'Test Address, Bangalore',
        phone: formData.phone || '9999999999',
        notes: formData.notes,
        totalAmount: totalPrice,
      };

      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderPayload),
      });

      if (!res.ok) throw new Error('Failed to place order');

      const order = await res.json();
      clearCart();
      pushToast({ type: 'success', title: 'Success', message: 'Order placed successfully!' });
      router.push('/customer/track-order');
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Error', message: error.message || 'Failed to place order' });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <CustomerLayout>
        <div className="checkout-page">
          <div className="checkout-empty">
            <span className="empty-icon">🛒</span>
            <p className="empty-text">Your cart is empty</p>
            <button onClick={() => router.push('/customer/browse-products')} className="empty-action">
              Browse Products
            </button>
          </div>
        </div>
      </CustomerLayout>
    );
  }

  return (
    <CustomerLayout>
      <div className="checkout-page">
        {/* Header */}
        <div className="checkout-header">
          <h1 className="checkout-title">Checkout</h1>
          <p className="checkout-subtitle">Complete your order</p>
        </div>

        {/* Order Summary */}
        <div className="checkout-summary">
          <h2 className="summary-heading">Order Summary</h2>
          <div className="summary-items">
            {cart.map((item) => (
              <div key={item.product._id} className="summary-item">
                <span className="summary-item-name">
                  {item.product.name} × {item.quantity}
                </span>
                <span className="summary-item-price">
                  ₹{(item.product.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="summary-divider"></div>
          <div className="summary-total-row">
            <span className="summary-total-label">Total ({totalItems} items)</span>
            <span className="summary-total-value">₹{totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {/* Delivery Form */}
        <form onSubmit={handleSubmit} className="checkout-form">
          <h2 className="form-heading">Delivery Details</h2>

          <div className="form-group">
            <label htmlFor="address" className="form-label">Delivery Address</label>
            <textarea
              id="address"
              className="form-input form-textarea"
              placeholder="Enter your delivery address"
              value={formData.deliveryAddress}
              onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              rows={3}
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              id="phone"
              type="tel"
              className="form-input"
              placeholder="Enter your phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label htmlFor="notes" className="form-label">Order Notes (Optional)</label>
            <textarea
              id="notes"
              className="form-input form-textarea"
              placeholder="Any special instructions?"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={2}
            />
          </div>

          <button type="submit" className="place-order-btn" disabled={loading}>
            {loading ? 'Placing Order...' : `Place Order • ₹${totalPrice.toFixed(2)}`}
          </button>
        </form>
      </div>
    </CustomerLayout>
  );
}
