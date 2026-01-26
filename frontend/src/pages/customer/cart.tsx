import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useRef } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';

const SkeletonCartItem = () => (
  <div className="cart-item-wrapper">
    <div className="cart-item">
      <div className="cart-item-image">
        <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '12px' }}></div>
      </div>
      <div className="cart-item-details" style={{ width: '100%' }}>
        <div className="cart-item-header">
          <div className="skeleton skeleton-text" style={{ width: '60%', height: '1.2em' }}></div>
        </div>
        <div className="skeleton skeleton-text" style={{ width: '30%', height: '1em', marginTop: '8px' }}></div>
        <div className="cart-item-footer" style={{ marginTop: 'auto' }}>
          <div className="skeleton skeleton-text" style={{ width: '25%', height: '1.2em' }}></div>
          <div className="cart-qty-control" style={{ background: '#f3f4f6', border: 'none' }}>
            <div className="skeleton" style={{ width: '24px', height: '24px', borderRadius: '50%' }}></div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity, removeFromCart, clearCart, totalPrice, isLoading } = useCustomerStore();

  // Swipe State
  const [swipedItemId, setSwipedItemId] = useState<string | null>(null);

  // Actions
  const handleQuantity = (id: string, currentQty: number, delta: number) => {
    const newQty = currentQty + delta;
    if (newQty > 0) {
      updateQuantity(id, newQty);
    }
    // If 0, we might want to ask confirmation or just let it stay at 1?
    // Store updateQuantity handles <= 0 by removing or doing nothing?
    // Store implementation: if nextQty <= 0 return null (it filters it out? No, returns null but then filters Boolean).
    // Let's look at store: 
    // const updateQuantity = ...
    //   if (nextQty <= 0) return null;
    //   ... filter((item): item is CartItem => Boolean(item));
    // So setting 0 removes it.
    // However, usually "-" button stops at 1. The old logic was Math.max(1, ...).
    // Let's stick to Math.max(1) for the button, and use delete for removal.
    if (newQty < 1) return;
    updateQuantity(id, newQty);
  };

  const handleDelete = (id: string) => {
    removeFromCart(id);
    setSwipedItemId(null);
  };

  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      clearCart();
    }
  };

  // --- Swipe Logic (Preserved) ---
  const SWIPE_THRESHOLD = -40;
  const MAX_SWIPE = -80;

  const touchStartX = useRef<number | null>(null);
  const currentSwipeX = useRef<number>(0);
  const swipingItemId = useRef<string | null>(null);
  const [, setForceUpdate] = useState(0);

  const onTouchStart = (e: React.TouchEvent, id: string) => {
    if (swipedItemId && swipedItemId !== id) setSwipedItemId(null);
    touchStartX.current = e.touches[0].clientX;
    swipingItemId.current = id;
    currentSwipeX.current = swipedItemId === id ? MAX_SWIPE : 0;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null || swipingItemId.current === null) return;
    const currentX = e.touches[0].clientX;
    const deltaX = currentX - touchStartX.current;

    if (swipedItemId !== swipingItemId.current) {
      if (deltaX < 0) {
        currentSwipeX.current = Math.max(MAX_SWIPE, deltaX);
        setForceUpdate(n => n + 1);
      }
    } else {
      if (deltaX > 0) {
        currentSwipeX.current = Math.min(0, MAX_SWIPE + deltaX);
        setForceUpdate(n => n + 1);
      }
    }
  };

  const onTouchEnd = () => {
    if (swipingItemId.current === null) return;
    if (swipedItemId !== swipingItemId.current && currentSwipeX.current < SWIPE_THRESHOLD) {
      setSwipedItemId(swipingItemId.current);
    } else if (swipedItemId === swipingItemId.current && currentSwipeX.current > (MAX_SWIPE - SWIPE_THRESHOLD)) {
      if (currentSwipeX.current > -30) setSwipedItemId(null);
      else setSwipedItemId(swipingItemId.current);
    } else {
      if (swipedItemId !== swipingItemId.current) setSwipedItemId(null);
    }
    touchStartX.current = null;
    swipingItemId.current = null;
    currentSwipeX.current = 0;
  };

  const getTranslateX = (id: string) => {
    if (swipingItemId.current === id && touchStartX.current !== null) return currentSwipeX.current;
    if (swipedItemId === id) return MAX_SWIPE;
    return 0;
  };

  const isSwiping = (id: string) => swipingItemId.current === id && touchStartX.current !== null;

  return (
    <CustomerLayout disablePadding={true}>
      <div className="cart-page has-fixed-header">

        {/* Header */}
        <div className="cart-header fixed-header">
          <div className="cart-header-main">
            <button className="back-button touchable" onClick={() => router.back()}>
              <img src="/customer/assets/icons/backward.svg" alt="Back" width={24} height={24} />
            </button>
            <h1 className="cart-title">Cart</h1>

            {cart.length > 0 && (
              <button className="clear-cart-btn" onClick={handleClearCart}>
                Clear
              </button>
            )}
          </div>
        </div>

        {isLoading && cart.length === 0 ? (
          <div className="cart-items-list">
            {Array.from({ length: 4 }).map((_, idx) => (
              <SkeletonCartItem key={`skeleton-cart-${idx}`} />
            ))}
          </div>
        ) : cart.length === 0 ? (
          <div className="cart-empty">
            <span className="empty-cart-text">Your cart is empty</span>
            <Link href="/customer/home" className="empty-cart-action">Go Shopping</Link>
          </div>
        ) : (
          <>
            <div className="cart-items-list">
              {cart.map(item => {
                const productId = item.product._id;
                return (
                  <div key={productId} className="cart-item-wrapper">
                    {/* Delete Layer */}
                    <div className="cart-delete-action" onClick={() => handleDelete(productId)}>
                      <img src="/customer/assets/icons/delete.svg" alt="Delete" className="cart-delete-icon" />
                    </div>

                    {/* Content Layer */}
                    <div
                      className={`cart-item ${isSwiping(productId) ? 'swiping' : ''}`}
                      style={{ transform: `translateX(${getTranslateX(productId)}px)` }}
                      onTouchStart={(e) => onTouchStart(e, productId)}
                      onTouchMove={onTouchMove}
                      onTouchEnd={onTouchEnd}
                    >
                      <div className="cart-item-image">
                        <img
                          src={item.product.image || '/customer/assets/icons/missing.svg'}
                          alt={item.product.name}
                          className={item.product.image ? 'product-image' : 'product-image-missing'}
                        />
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-header">
                          <h3 className="cart-item-name">{item.product.name}</h3>
                        </div>
                        <p className="cart-item-qty-label">Unit</p>

                        <div className="cart-item-footer">
                          <span className="cart-item-price">₹{item.product.price.toFixed(2)}</span>
                          <div className="cart-qty-control">
                            <button
                              className="qty-btn"
                              onClick={(e) => { e.stopPropagation(); handleQuantity(productId, item.quantity, -1); }}
                            >
                              <img src="/customer/assets/icons/minus.svg" alt="Decrease" />
                            </button>
                            <span className="qty-display">{item.quantity}</span>
                            <button
                              className="qty-btn"
                              onClick={(e) => { e.stopPropagation(); handleQuantity(productId, item.quantity, 1); }}
                            >
                              <img src="/customer/assets/icons/plus.svg" alt="Increase" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="cart-summary-fixed">
              <div className="summary-row">
                <span className="summary-label">Total</span>
                <span className="summary-value">₹{totalPrice.toFixed(2)}</span>
              </div>
              <button
                className="checkout-btn touchable"
                onClick={() => router.push('/customer/checkout')}
                disabled={isLoading}
                style={{ opacity: isLoading ? 0.7 : 1 }}
              >
                {isLoading ? 'Updating...' : 'Checkout'}
              </button>
            </div>
          </>
        )}
      </div>
    </CustomerLayout>
  );
}
