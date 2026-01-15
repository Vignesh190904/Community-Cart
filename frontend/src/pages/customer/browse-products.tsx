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

const CATEGORIES = [
  { name: 'Grocery', icon: '🧺', color: '#EDE7F6', iconColor: '#7E57C2' },
  { name: 'Vegies', icon: '🥬', color: '#E8F5E9', iconColor: '#4CAF50' },
  { name: 'Fruits', icon: '🍎', color: '#FFEBEE', iconColor: '#EF5350' },
  { name: 'Bakery', icon: '🍔', color: '#FCE4EC', iconColor: '#EC407A' }, // Using burger as placeholder for Bakery/Fast food
  { name: 'Laundry', icon: '👕', color: '#EDE7F6', iconColor: '#5E35B1' }, // Placeholder
];

export default function BrowseProducts() {
  const { addToCart, updateQuantity, ensureCustomerId, cart } = useCustomerStore();
  const { pushToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

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

    // If not in cart, add with qty 1. If in cart, we use the quantity controls instead usually.
    // But for the main button "Add to Cart", we just add 1.
    addToCart({
      _id: product._id,
      name: product.name,
      price: product.price,
      image: product.image,
      vendorName: product.vendor?.name,
      stock: product.stock,
    }, stock);
  };

  const updateItemQty = (product: Product, delta: number) => {
    const currentQty = cartMap.get(product._id) || 0;
    const newQty = currentQty + delta;
    if (newQty <= 0) {
      // Remove functionality if needed, or just set to 0 (which customer store handles as remove usually? Verify store logic)
      // Store logic: if nextQty <= 0 return null (filter out). So yes, removes.
      updateQuantity(product._id, 0); // Logic says updateQuantity(id, qty).
    } else {
      updateQuantity(product._id, newQty);
    }
  };

  const filteredProducts = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <CustomerLayout>
      <div className="browse-page">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search keywords.."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Categories */}
        <div className="categories-list">
          {CATEGORIES.map((cat) => (
            <div key={cat.name} className="category-item">
              <div className="cat-icon-circle" style={{ backgroundColor: cat.color }}>
                <span style={{ color: cat.iconColor }}>{cat.icon}</span>
              </div>
              <span className="cat-name">{cat.name}</span>
            </div>
          ))}
        </div>

        <h2 className="section-title">Featured Products <span style={{ fontSize: '20px', float: 'right' }}>❯</span></h2>

        {loading && <div className="page-state">Loading products…</div>}
        {error && !loading && <div className="page-state error">{error}</div>}

        {!loading && !error && (
          <div className="products-grid">
            {filteredProducts.map((product, index) => {
              const qtyInCart = cartMap.get(product._id) || 0;
              const isEven = index % 2 === 0;

              // Dummy Logic for tags
              const discount = isEven ? '-16%' : null;
              const isNew = !isEven;

              return (
                <article key={product._id} className="product-card">
                  <div className="card-top">
                    {discount && <span className="tag discount">{discount}</span>}
                    {isNew && <span className="tag new">NEW</span>}
                    <button className="wishlist-btn">♡</button>

                    <div className="product-image-wrap">
                      {product.image ? (
                        <img src={product.image} alt={product.name} className="product-image" />
                      ) : (
                        <div className="image-placeholder" />
                      )}
                    </div>
                  </div>

                  <div className="product-info">
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-qty-label">Quantity</p>
                    <p className="product-price">₹{product.price.toFixed(2)}</p>
                  </div>

                  <div className="card-actions">
                    {qtyInCart > 0 ? (
                      <div className="qty-controls">
                        <button className="qty-btn" onClick={() => updateItemQty(product, 1)}>+</button>
                        <span className="qty-val">{qtyInCart}</span>
                        <button className="qty-btn" onClick={() => updateItemQty(product, -1)}>−</button>
                      </div>
                    ) : (
                      <button
                        className="add-to-cart-btn"
                        onClick={() => handleAdd(product)}
                        disabled={(product.stock ?? 0) <= 0}
                      >
                        <span className="cart-icon">🛍️</span> Add to cart
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
            {filteredProducts.length === 0 && <div className="page-state">No products found.</div>}
          </div>
        )}
      </div>
    </CustomerLayout>
  );
}
