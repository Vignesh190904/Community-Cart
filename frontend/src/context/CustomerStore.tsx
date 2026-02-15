import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useToast } from '../components/ui/ToastProvider';

// --- Interfaces ---
export interface ProductLite {
  _id: string;
  name: string;
  price: number;
  vendorName?: string;
  image?: string;
  stock?: number;
  category?: string; // Important for consistency
}

export interface CartItem {
  product: ProductLite;
  quantity: number;
}

interface CustomerStoreState {
  customerId: string | null;
  cart: CartItem[];
  ensureCustomerId: () => Promise<string | null>;
  addToCart: (product: ProductLite, maxStock?: number, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
  validateCart: () => Promise<void>;
  isLoading: boolean;
}

const CustomerStoreContext = createContext<CustomerStoreState | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api';
const STORAGE_CART_KEY = 'cc_customer_cart_v2'; // New key to avoid conflicts
const STORAGE_CUSTOMER_KEY = 'cc_customer_id';

import { useAuth } from './AuthContext';

// ... imports
import { customerFetch } from '../utils/customerFetch';

export function CustomerStoreProvider({ children }: { children: React.ReactNode }) {
  const { token, is_authenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  // Helper to get token safely (prefer context, fallback to local)
  const getToken = () => {
    return token || (typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null);
  };

  // --- FETCH CART (Server or Local) ---
  const fetchCart = async () => {
    const activeToken = getToken();

    if (activeToken) {
      // LOGGED IN: Server Source of Truth
      try {
        setIsLoading(true);
        const res = await customerFetch(`${API_BASE}/cart`, {
          headers: { 'Authorization': `Bearer ${activeToken}` }
        });

        if (res.ok) {
          const data = await res.json();
          setCart(data.cart || []);
          // ... rest of logic
          if (data.removedItems?.length > 0) {
            console.warn('Items removed by server:', data.removedItems);
          }
        }
      } catch (err) {
        console.error('Failed to fetch server cart', err);
      } finally {
        setIsLoading(false);
      }
    } else {
      // GUEST: Local Storage
      const local = localStorage.getItem(STORAGE_CART_KEY);
      if (local) {
        try {
          setCart(JSON.parse(local));
        } catch {
          setCart([]);
        }
      } else {
        setCart([]); // Clear cart if no local data
      }
    }
  };

  // Refetch when auth state changes
  useEffect(() => {
    fetchCart();

    // Also load customer ID if needed for legacy logic
    const savedCid = typeof window !== 'undefined' ? localStorage.getItem(STORAGE_CUSTOMER_KEY) : null;
    if (savedCid) setCustomerId(savedCid);
  }, [token, is_authenticated]); // Re-run on login/logout

  // Save to LocalStorage ONLY if Guest (backup)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const token = getToken();
    if (!token) {
      localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
    }
  }, [cart]);


  // --- ACTIONS ---

  const addToCart = async (product: ProductLite, maxStock?: number, quantity: number = 1) => {
    const token = getToken();

    // 1. Optimistic Update (for speed)
    const prevCart = [...cart];
    // ... insert optimistic logic here if desired, OR just wait for server for stability.
    // User requested "Stability", so let's Wait for Server. simpler.

    setIsLoading(true);

    if (token) {
      // SERVER ADD
      try {
        const res = await customerFetch(`${API_BASE}/cart/add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            productId: product._id,
            quantity: quantity
          })
        });

        if (res.ok) {
          await fetchCart(); // Re-sync truth
          showToast('Added to cart', 'success');
        } else {
          const err = await res.json();
          if (err.code === 'MIXED_VENDOR') {
            showToast("You can only add products from one vendor per order.", 'error');
          } else {
            showToast(err.message || 'Could not add to cart', 'error');
          }
        }
      } catch (err) {
        showToast('Network error adding to cart', 'error');
      }
    } else {
      // LOCAL ADD
      // Simple local logic
      setCart(prev => {
        const existing = prev.find(i => i.product._id === product._id);
        // Simplified stock check for guest
        if (existing) {
          return prev.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + quantity } : i);
        }
        return [...prev, { product, quantity: quantity }];
      });
    }
    setIsLoading(false);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity < 1) return; // Use remove instead
    const token = getToken();
    setIsLoading(true);

    if (token) {
      // SERVER UPDATE
      try {
        const res = await customerFetch(`${API_BASE}/cart/${productId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ quantity })
        });

        if (res.ok) {
          await fetchCart();
          showToast('Cart updated', 'success');
        } else {
          const err = await res.json();
          if (err.code === 'MIXED_VENDOR') {
            showToast("You can only add products from one vendor per order.", 'error');
          } else {
            showToast(err.message || 'Failed to update quantity', 'error');
          }
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      // LOCAL UPDATE
      setCart(prev => prev.map(i => i.product._id === productId ? { ...i, quantity } : i));
    }
    setIsLoading(false);
  };

  const removeFromCart = async (productId: string) => {
    const token = getToken();
    setIsLoading(true);

    if (token) {
      // SERVER REMOVE
      try {
        await customerFetch(`${API_BASE}/cart/${productId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        await fetchCart();
      } catch (err) {
        console.error(err);
      }
    } else {
      // LOCAL REMOVE
      setCart(prev => prev.filter(i => i.product._id !== productId));
    }
    setIsLoading(false);
  };

  const clearCart = async () => {
    const token = getToken();
    if (token) {
      await customerFetch(`${API_BASE}/cart`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setCart([]);
    } else {
      setCart([]);
    }
  };

  const validateCart = async () => {
    await fetchCart(); // Re-fetching essentially validates
  };

  const ensureCustomerId = async (): Promise<string | null> => {
    return customerId;
  };

  // --- DERIVED STATE ---
  const totalPrice = useMemo(
    () => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [cart]
  );

  const totalItems = useMemo(
    () => cart.reduce((sum, item) => sum + item.quantity, 0),
    [cart]
  );

  const value: CustomerStoreState = {
    customerId,
    cart,
    ensureCustomerId,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    totalPrice,
    totalItems,
    validateCart,
    isLoading
  };

  return <CustomerStoreContext.Provider value={value}>{children}</CustomerStoreContext.Provider>;
}

export const useCustomerStore = () => {
  const ctx = useContext(CustomerStoreContext);
  if (!ctx) throw new Error('useCustomerStore must be used within CustomerStoreProvider');
  return ctx;
};
