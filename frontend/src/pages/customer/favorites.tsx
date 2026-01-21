import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useCustomerStore } from '../../context/CustomerStore';
import { useToast } from '../../components/ui/ToastProvider';
import { fetchWishlist, removeFromWishlist, WishlistItem } from '../../services/wishlistApi';

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
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const load = async () => {
            await ensureCustomerId();
            try {
                const data = await fetchWishlist();
                setWishlistItems(data);
            } catch (err: any) {
                setError(err.message || 'Failed to load favorites');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [ensureCustomerId]);

    const handleRemoveFromWishlist = async (productId: string) => {
        // Optimistic UI update
        setWishlistItems(prev => prev.filter(item => item.product._id !== productId));

        try {
            await removeFromWishlist(productId);
            pushToast({ type: 'success', message: 'Removed from favorites' });
        } catch (err: any) {
            // Revert on error
            const data = await fetchWishlist();
            setWishlistItems(data);
            pushToast({ type: 'error', message: err.message || 'Failed to remove from favorites' });
        }
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

    // Filter wishlist items by search term
    const filteredProducts = wishlistItems
        .map(item => ({
            ...item.product,
            vendor: item.vendor
        }))
        .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

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
                                                onClick={() => handleRemoveFromWishlist(product._id)}
                                            >
                                                <img
                                                    src="/customer/assets/icons/favorite-filled.svg"
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
