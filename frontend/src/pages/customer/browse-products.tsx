import { useEffect, useMemo, useState } from 'react';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';
import { useToast } from '../../components/ui/ToastProvider';

interface Product {
  _id: string;
  name: string;
  price: number;
  image?: string;
  vendor?: { name?: string };
  isAvailable?: boolean;
  stock?: number;
}

const API_BASE = 'http://localhost:5000/api';

export default function BrowseProducts() {
  const { addToCart, ensureCustomerId, cart } = useCustomerStore();
  const { pushToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      await ensureCustomerId();
      try {
        const res = await fetch(`${API_BASE}/products`);
        if (!res.ok) throw new Error('Failed to fetch products');
        const data = await res.json();
        const available = data.filter((p: Product) => p.isAvailable !== false && (p.stock ?? 0) > 0);
        setProducts(available);
      } catch (err: any) {
        setError(err.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [ensureCustomerId]);

  const cartMap = useMemo(() => {
    const map = new Map<string, number>();
    cart.forEach((item) => map.set(item.product._id, item.quantity));
    return map;
  }, [cart]);

  const handleAdd = (product: Product) => {
    const stock = product.stock ?? 0;
    const currentQty = cartMap.get(product._id) || 0;
    if (stock <= 0) return;
    if (currentQty >= stock) {
      pushToast({ type: 'warning', title: 'Stock limit', message: `Only ${stock} left for ${product.name}` });
      return;
    }
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      vendorName: product.vendor?.name,
      stock: product.stock,
    }, stock);
  };

  return (
    <CustomerLayout>
      <div className="browse-page">
        <div className="page-head">
          <div>
            <p className="page-kicker">Browse</p>
            <h1 className="page-title">Products</h1>
            <p className="page-subtitle">Add items to your cart to place a test order.</p>
          </div>
        </div>

        {loading && <div className="page-state">Loading products…</div>}
        {error && !loading && <div className="page-state error">{error}</div>}

        {!loading && !error && (
          <div className="products-grid">
            {products.map((product) => (
              <article key={product._id} className="product-card">
                <div className="product-image-wrap">
                  {product.image ? (
                    <img src={product.image} alt={product.name} className="product-image" />
                  ) : (
                    <div className="image-placeholder">No Image</div>
                  )}
                </div>
                <div className="product-body">
                  <p className="product-name">{product.name}</p>
                  <p className="product-vendor">{product.vendor?.name || 'Vendor'}</p>
                  <p className="product-price">₹{product.price?.toFixed(2)}</p>
                  <p className="product-stock">In stock: {product.stock ?? 0}</p>
                  <button
                    className="btn-primary"
                    disabled={(product.stock ?? 0) <= 0}
                    onClick={() => handleAdd(product)}
                  >
                    {product.stock && product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                  </button>
                </div>
              </article>
            ))}
            {products.length === 0 && <div className="page-state">No products available.</div>}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
