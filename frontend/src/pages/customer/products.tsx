import { useEffect, useState } from 'react';
import { useToast } from '../../components/ui/ToastProvider';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  vendor: {
    _id: string;
    name: string;
  };
  isAvailable: boolean;
}

interface Customer {
  _id: string;
  name: string;
  email: string;
  phone: string;
  isActive?: boolean;
}

export default function CustomerProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [customerDisabled, setCustomerDisabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [placingId, setPlacingId] = useState<string | null>(null);
  const { pushToast } = useToast();

  useEffect(() => {
    init();
  }, []);

  const init = async () => {
    setLoading(true);
    const customerRecord = await loadOrCreateCustomer();
    if (customerRecord && customerRecord.isActive === false) {
      setCustomerDisabled(true);
      setProducts([]);
      setLoading(false);
      return;
    }
    await loadProducts();
  };

  const loadProducts = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/products');
      if (!res.ok) throw new Error('Failed to fetch products');
      const data = await res.json();
      // Filter only available products
      setProducts(data.filter((p: Product) => p.isAvailable));
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Error', message: error.message || 'Failed to load products' });
    } finally {
      setLoading(false);
    }
  };

  const loadOrCreateCustomer = async () => {
    try {
      // Check if customer already exists (for demo, use first customer or create)
      const res = await fetch('http://localhost:5000/api/customers');
      const customers = await res.json();

      if (customers.length > 0) {
        setCustomer(customers[0]);
        return customers[0];
      } else {
        // Auto-create test customer
        const createRes = await fetch('http://localhost:5000/api/customers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test Customer',
            email: 'test@customer.com',
            phone: '9876543210',
            isActive: true,
          }),
        });
        const newCustomer = await createRes.json();
        setCustomer(newCustomer);
        return newCustomer;
      }
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Error', message: 'Failed to load customer' });
      return null;
    }
  };

  const placeOrder = async (productId: string, productName: string) => {
    if (!customer) {
      pushToast({ type: 'error', title: 'Error', message: 'Customer not loaded' });
      return;
    }

    setPlacingId(productId);

    try {
      const res = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: customer._id,
          productIds: [productId],
        }),
      });

      if (!res.ok) throw new Error('Failed to place order');
      const order = await res.json();

      pushToast({
        type: 'success',
        title: 'Order Placed',
        message: `Order placed successfully (Order ID: ${order._id}) for ${productName}`,
        duration: 4000,
      });
    } catch (error: any) {
      pushToast({ type: 'error', title: 'Order Failed', message: error.message || 'Could not place order' });
    } finally {
      setPlacingId((current) => (current === productId ? null : current));
    }
  };

  if (loading) {
    return (
      <div className="customer-products-container">
        <div className="loading-state">Loading products...</div>
      </div>
    );
  }

  if (customerDisabled) {
    return (
      <div className="customer-products-container">
        <div className="empty-state">Your account is disabled. Please contact support to continue shopping.</div>
      </div>
    );
  }

  return (
    <div className="customer-products-container">
      <header className="customer-header">
        <h1 className="customer-title">Community Cart</h1>
        <p className="customer-subtitle">Fresh products from local vendors</p>
        {customer && <p className="customer-info">Shopping as: {customer.name}</p>}
      </header>

      <div className="products-grid">
        {products.map((product) => (
          <article key={product._id} className="product-card">
            {product.image && (
              <div className="product-image-wrapper">
                <img src={product.image} alt={product.name} className="product-image" />
              </div>
            )}
            <div className="product-info">
              <h3 className="product-name">{product.name}</h3>
              <p className="product-vendor">{product.vendor?.name || 'Unknown Vendor'}</p>
              {product.description && <p className="product-description">{product.description}</p>}
              <div className="product-footer">
                <div className="product-price">₹{product.price.toFixed(2)}</div>
                <button
                  className="btn-order"
                  disabled={placingId === product._id || customerDisabled}
                  onClick={() => placeOrder(product._id, product.name)}
                >
                  {placingId === product._id ? 'Placing…' : 'Place Order'}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {products.length === 0 && (
        <div className="empty-state">No products available at the moment</div>
      )}
    </div>
  );
}
