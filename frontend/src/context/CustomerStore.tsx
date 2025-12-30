import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface ProductLite {
  _id: string;
  name: string;
  price: number;
  vendorName?: string;
  image?: string;
  stock?: number;
}

export interface CartItem {
  product: ProductLite;
  quantity: number;
}

interface CustomerStoreState {
  customerId: string | null;
  cart: CartItem[];
  ensureCustomerId: () => Promise<string | null>;
  addToCart: (product: ProductLite, maxStock?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CustomerStoreContext = createContext<CustomerStoreState | undefined>(undefined);

const API_BASE = 'http://localhost:5000/api';
const STORAGE_CART_KEY = 'cc_customer_cart';
const STORAGE_CUSTOMER_KEY = 'cc_customer_id';
const TEST_CUSTOMER_EMAIL = 'test.customer@demo.com';

export function CustomerStoreProvider({ children }: { children: React.ReactNode }) {
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedCart = localStorage.getItem(STORAGE_CART_KEY);
    const savedCustomer = localStorage.getItem(STORAGE_CUSTOMER_KEY);
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (_) {
        setCart([]);
      }
    }
    if (savedCustomer) {
      setCustomerId(savedCustomer);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cart));
  }, [cart]);

  const ensureCustomerId = async (): Promise<string | null> => {
    if (customerId) return customerId;
    if (typeof window === 'undefined') return null;

    const stored = localStorage.getItem(STORAGE_CUSTOMER_KEY);
    if (stored) {
      setCustomerId(stored);
      return stored;
    }

    try {
      const listRes = await fetch(`${API_BASE}/customers`);
      if (listRes.ok) {
        const customers = await listRes.json();
        const existing = customers.find((c: any) => c.email === TEST_CUSTOMER_EMAIL) || customers[0];
        if (existing) {
          localStorage.setItem(STORAGE_CUSTOMER_KEY, existing._id);
          setCustomerId(existing._id);
          return existing._id;
        }
      }
    } catch (_) {
      // ignore and attempt creation
    }

    try {
      const createRes = await fetch(`${API_BASE}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Test Customer',
          email: TEST_CUSTOMER_EMAIL,
          phone: '9999999999',
          isActive: true,
        }),
      });
      if (!createRes.ok) throw new Error('Failed to create test customer');
      const customer = await createRes.json();
      localStorage.setItem(STORAGE_CUSTOMER_KEY, customer._id);
      setCustomerId(customer._id);
      return customer._id;
    } catch (error) {
      return null;
    }
  };

  const addToCart = (product: ProductLite, maxStock?: number) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.product._id === product._id);
      const limit = typeof maxStock === 'number'
        ? Math.max(0, maxStock)
        : typeof product.stock === 'number'
          ? Math.max(0, product.stock)
          : Infinity;
      const productWithStock = limit !== Infinity ? { ...product, stock: limit } : product;
      if (existing) {
        const nextQty = Math.min(existing.quantity + 1, limit);
        return prev.map((item) => {
          if (item.product._id !== product._id) return item;
          return {
            ...item,
            product: limit === Infinity ? item.product : { ...item.product, stock: limit },
            quantity: nextQty,
          };
        });
      }
      if (limit <= 0) return prev;
      return [...prev, { product: productWithStock, quantity: 1 }];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product._id !== productId) return item;
          const limit = typeof item.product.stock === 'number' ? Math.max(0, item.product.stock) : Infinity;
          if (limit <= 0) return null;
          const nextQty = Math.min(quantity, limit);
          if (nextQty <= 0) return null;
          return { ...item, quantity: nextQty };
        })
        .filter((item): item is CartItem => Boolean(item));
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product._id !== productId));
  };

  const clearCart = () => setCart([]);

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
  };

  return <CustomerStoreContext.Provider value={value}>{children}</CustomerStoreContext.Provider>;
}

export const useCustomerStore = () => {
  const ctx = useContext(CustomerStoreContext);
  if (!ctx) throw new Error('useCustomerStore must be used within CustomerStoreProvider');
  return ctx;
};
