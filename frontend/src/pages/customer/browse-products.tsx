import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';
import { useToast } from '../../components/ui/ToastProvider';
import { addToWishlist, removeFromWishlist, fetchWishlist, WishlistItem } from '../../services/wishlistApi';

interface Product {
    _id: string;
    name: string;
    price: number;
    mrp?: number;
    quantity?: number;
    unit?: string;
    category?: string;
    image?: string;
    vendor?: { name?: string };
    isAvailable?: boolean;
    stock?: number;
}

const API_BASE = 'http://localhost:5000/api';

const CATEGORIES = [
    { name: 'Grocery', icon: '/customer/assets/icons/grocery.svg', color: '#EDE7F6', iconColor: '#7E57C2' },
    { name: 'Vegies', icon: '/customer/assets/icons/vegies.svg', color: '#E8F5E9', iconColor: '#4CAF50' },
    { name: 'Fruits', icon: '/customer/assets/icons/fruits.svg', color: '#FFEBEE', iconColor: '#EF5350' },
    { name: 'Bakery', icon: '/customer/assets/icons/bakery.svg', color: '#FCE4EC', iconColor: '#EC407A' },
    { name: 'Pharmacy', icon: '/customer/assets/icons/pharmacy.svg', color: '#E0F7FA', iconColor: '#00ACC1' },
    { name: 'Laundry', icon: '/customer/assets/icons/laundry.svg', color: '#EDE7F6', iconColor: '#5E35B1' },
];

export default function BrowseProducts() {
    const router = useRouter();
    const { addToCart, updateQuantity, ensureCustomerId, cart } = useCustomerStore();
    const { pushToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    // Sync search term from URL query
    useEffect(() => {
        if (router.isReady && router.query.q) {
            setSearchTerm(router.query.q as string);
        }
    }, [router.isReady, router.query.q]);

    // Fetch wishlist from backend
    useEffect(() => {
        const loadWishlist = async () => {
            try {
                const data = await fetchWishlist();
                setWishlist(data);
            } catch (err: any) {
                // Silent fail - user might not be logged in yet
                console.error('Failed to load wishlist:', err);
            }
        };
        loadWishlist();
    }, []);

    const toggleWishlist = async (productId: string) => {
        const isCurrentlyInWishlist = wishlist.some(item => item.product._id === productId);

        // Optimistic UI update
        if (isCurrentlyInWishlist) {
            setWishlist(prev => prev.filter(item => item.product._id !== productId));
        } else {
            // We'll refetch after adding to get the complete data
            setWishlistLoading(true);
        }

        try {
            if (isCurrentlyInWishlist) {
                await removeFromWishlist(productId);
                pushToast({ type: 'success', message: 'Removed from favorites' });
            } else {
                await addToWishlist(productId);
                // Refetch wishlist to get the complete item data
                const updatedWishlist = await fetchWishlist();
                setWishlist(updatedWishlist);
                pushToast({ type: 'success', message: 'Added to favorites' });
            }
        } catch (err: any) {
            // Revert optimistic update on error
            if (isCurrentlyInWishlist) {
                const updatedWishlist = await fetchWishlist();
                setWishlist(updatedWishlist);
            } else {
                setWishlist(prev => prev.filter(item => item.product._id !== productId));
            }
            pushToast({ type: 'error', message: err.message || 'Failed to update wishlist' });
        } finally {
            setWishlistLoading(false);
        }
    };

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
            pushToast({ type: 'warning', message: `Only ${stock} left for ${product.name}` });
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

    const updateItemQty = (product: Product, delta: number) => {
        const currentQty = cartMap.get(product._id) || 0;
        const newQty = currentQty + delta;
        if (newQty <= 0) {
            updateQuantity(product._id, 0);
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
                        <img src="/customer/assets/icons/search.svg" alt="Search" className="search-icon" style={{ width: '20px', height: '20px' }} />
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
                        <div key={cat.name} className="category-item" onClick={() => router.push(`/customer/category?type=${cat.name}`)}>
                            <div className="cat-icon-circle" style={{ backgroundColor: cat.color }}>
                                <img src={cat.icon} alt={cat.name} style={{ width: '24px', height: '24px' }} />
                            </div>
                            <span className="cat-name">{cat.name}</span>
                        </div>
                    ))}
                </div>

                <h2 className="section-title">Featured Products <img src="/customer/assets/icons/forward.svg" alt="View all" style={{ fontSize: '20px', float: 'right', width: '20px', height: '20px' }} /></h2>

                {loading && <div className="page-state">Loading products…</div>}
                {error && !loading && <div className="page-state error">{error}</div>}

                {!loading && !error && (
                    <div className="products-grid">
                        {filteredProducts.map((product, index) => {
                            const qtyInCart = cartMap.get(product._id) || 0;

                            // Calculate discount if MRP exists and is higher than price
                            const hasDiscount = product.mrp && product.mrp > product.price;
                            const discountPercent = hasDiscount
                                ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
                                : 0;

                            const isNew = false; // logic for NEW tag can be added later

                            return (
                                <div key={product._id} className="product-card">
                                    <div className="product-card-header">
                                        {hasDiscount && <span className="product-badge discount">-{discountPercent}%</span>}
                                        {isNew && <span className="product-badge new">NEW</span>}
                                        <button className="product-wishlist-btn" onClick={(e) => { e.stopPropagation(); toggleWishlist(product._id); }}>
                                            <img
                                                src={wishlist.some(item => item.product._id === product._id) ? "/customer/assets/icons/favorite-filled.svg" : "/customer/assets/icons/favorite.svg"}
                                                alt="Wishlist"
                                                style={{ width: '24px', height: '24px' }}
                                            />
                                        </button>
                                    </div>

                                    <div className="product-image-wrapper" onClick={() => router.push(`/customer/product-detail?id=${product._id}`)}>
                                        <img
                                            src={product.image || '/customer/assets/icons/missing.svg'}
                                            alt={product.name}
                                            className={product.image ? 'product-image' : 'product-image-missing'}
                                        />
                                    </div>

                                    <div className="product-card-body" onClick={() => router.push(`/customer/product-detail?id=${product._id}`)}>
                                        <h4 className="product-name">{product.name}</h4>
                                        <p className="product-qty-label">
                                            {product.quantity ? `${product.quantity} ${product.unit || ''}` : (product.category || 'Product')}
                                        </p>
                                        <div className="product-price-wrapper">
                                            <span className="product-final-price">₹{product.price.toFixed(2)}</span>
                                            {hasDiscount && (
                                                <span className="product-original-price" style={{
                                                    textDecoration: 'line-through',
                                                    color: '#999',
                                                    fontSize: '0.85em',
                                                    marginLeft: '0.5rem'
                                                }}>
                                                    ₹{product.mrp!.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="product-card-footer">
                                        {qtyInCart > 0 ? (
                                            <div className="product-qty-controls">
                                                <button className="product-qty-btn" onClick={() => updateItemQty(product, -1)}>
                                                    −
                                                </button>
                                                <span className="product-qty-value">{qtyInCart}</span>
                                                <button className="product-qty-btn" onClick={() => updateItemQty(product, 1)}>
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                className="product-add-btn"
                                                onClick={() => handleAdd(product)}
                                                disabled={(product.stock ?? 0) <= 0}
                                            >
                                                <img src="/customer/assets/icons/bag.svg" alt="Cart" className="product-cart-icon" />
                                                Add to cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                        {filteredProducts.length === 0 && <div className="page-state">No products found.</div>}
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
