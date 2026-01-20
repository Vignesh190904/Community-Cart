import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
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

export default function FavoritesPage() {
    const router = useRouter();
    const { addToCart, updateQuantity, ensureCustomerId, cart } = useCustomerStore();
    const { pushToast } = useToast();
    const [products, setProducts] = useState<Product[]>([]);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
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

                const savedFavorites = localStorage.getItem('cc_favorites');
                if (savedFavorites) {
                    setFavorites(new Set(JSON.parse(savedFavorites)));
                }
            } catch (err: any) {
                setError(err.message || 'Failed to load products');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [ensureCustomerId]);

    const toggleFavorite = (productId: string) => {
        const newFavorites = new Set(favorites);
        if (newFavorites.has(productId)) {
            newFavorites.delete(productId);
        } else {
            newFavorites.add(productId);
        }
        setFavorites(newFavorites);
        localStorage.setItem('cc_favorites', JSON.stringify(Array.from(newFavorites)));
    };

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

    const updateItemQty = (product: Product, delta: number) => {
        const currentQty = cartMap.get(product._id) || 0;
        const newQty = currentQty + delta;
        if (newQty <= 0) {
            updateQuantity(product._id, 0);
        } else {
            updateQuantity(product._id, newQty);
        }
    };

    const favoriteProducts = products.filter(p => favorites.has(p._id));
    const filteredProducts = favoriteProducts.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <CustomerLayout disablePadding={true}>
            <div className="favorites-page">
                <div className="favorites-header">
                    <button className="favorites-back-button" onClick={() => router.back()}>
                        <img src="/customer/assets/icons/backward.svg" alt="Back" width={24} height={24} />
                    </button>
                    <h1 className="favorites-title">Favorites</h1>
                </div>

                <div className="favorites-search-section">
                    <div className="favorites-search-container">
                        <img src="/customer/assets/icons/search.svg" alt="Search" className="favorites-search-icon" />
                        <input
                            type="text"
                            placeholder="Search keywords.."
                            className="favorites-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="favorites-content">
                    {loading && <div className="favorites-state">Loading favorites…</div>}
                    {error && !loading && <div className="favorites-state error">{error}</div>}

                    {!loading && !error && filteredProducts.length === 0 && (
                        <div className="favorites-state">No favorites yet</div>
                    )}

                    {!loading && !error && filteredProducts.length > 0 && (
                        <div className="products-grid">
                            {filteredProducts.map((product, index) => {
                                const qtyInCart = cartMap.get(product._id) || 0;
                                const isEven = index % 2 === 0;
                                const discount = isEven ? '-16%' : null;
                                const isNew = !isEven;

                                return (
                                    <div key={product._id} className="product-card">
                                        <div className="product-card-header">
                                            {discount && <span className="product-badge discount">{discount}</span>}
                                            {isNew && <span className="product-badge new">NEW</span>}
                                            <button
                                                className="product-wishlist-btn"
                                                onClick={() => toggleFavorite(product._id)}
                                            >
                                                <img
                                                    src="/customer/assets/icons/favorite.svg"
                                                    alt="Favorite"
                                                    className="favorite-heart-icon active"
                                                    style={{ width: '24px', height: '24px' }}
                                                />
                                            </button>
                                        </div>

                                        <div className="product-image-wrapper">
                                            {product.image ? (
                                                <img src={product.image} alt={product.name} className="product-image" />
                                            ) : (
                                                <div className="product-image-placeholder" style={{ width: '100%', height: '100%', background: '#eee' }} />
                                            )}
                                        </div>

                                        <div className="product-card-body">
                                            <h4 className="product-name">{product.name}</h4>
                                            <p className="product-qty-label">Quantity</p>
                                            <div className="product-price-wrapper">
                                                <span className="product-final-price">₹{product.price.toFixed(2)}</span>
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
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
