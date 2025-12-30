import Link from 'next/link';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, totalPrice, totalItems } = useCustomerStore();

  return (
    <CustomerLayout>
      <div className="cart-page">
        <div className="page-head">
          <div>
            <p className="page-kicker">Cart</p>
            <h1 className="page-title">Your Test Cart</h1>
            <p className="page-subtitle">Adjust quantities before placing a test order.</p>
          </div>
          <Link href="/customer/browse-products" className="btn-secondary">Continue Browsing</Link>
        </div>

        {cart.length === 0 ? (
          <div className="page-state">Your cart is empty.</div>
        ) : (
          <div className="cart-grid">
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item.product._id} className="cart-row">
                  <div className="cart-info">
                    <p className="cart-name">{item.product.name}</p>
                    <p className="cart-vendor">{item.product.vendorName || 'Vendor'}</p>
                    {typeof item.product.stock === 'number' && (
                      <p className="cart-stock">In stock: {item.product.stock}</p>
                    )}
                  </div>
                  <div className="cart-controls">
                    <div className="qty-control">
                      <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={typeof item.product.stock === 'number' && item.quantity >= item.product.stock}
                        title={typeof item.product.stock === 'number' && item.quantity >= item.product.stock ? 'Reached available stock' : undefined}
                      >
                        +
                      </button>
                    </div>
                    <p className="cart-price">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                    <button className="btn-link" onClick={() => removeFromCart(item.product._id)}>Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <p className="summary-title">Order Summary</p>
              <div className="summary-row">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>₹{totalPrice.toFixed(2)}</span>
              </div>
              <Link href="/customer/place-order" className="btn-primary full">Proceed to Place Order</Link>
            </div>
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
