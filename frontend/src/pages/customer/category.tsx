import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useToast } from '../../components/ui/ToastProvider';
import { useCustomerStore } from '../../context/CustomerStore';
import { customerFetch } from '../../utils/customerFetch';
import { SkeletonProductCard } from '../../components/customer/SkeletonProductCard';

// --- Product Interface ---

interface Product {
    _id: string;
    name: string;
    description?: string;
    price: number;
    mrp?: number;
    quantity?: number;
    unit?: string;
    category?: string;
    image?: string;
    isAvailable: boolean;
    stock: number;
    vendor?: {
        _id: string;
        storeName: string;
        ownerName: string;
        email: string;
        isActive: boolean;
    };
    createdAt?: string;
    updatedAt?: string;
}

const API_BASE = 'http://localhost:5000/api';

export default function CategoryPage() {
    const router = useRouter();
    const { type } = router.query;
    const { enqueueToast } = useToast();

    // Global Cart Store
    const { cart, addToCart, updateQuantity, removeFromCart } = useCustomerStore();

    // State
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    // Removed local cart state
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await customerFetch(`${API_BASE}/products`);

                if (!response.ok) {
                    throw new Error('Failed to fetch products');
                }

                const data = await response.json();
                // Filter only available products from active vendors
                const availableProducts = data.filter((p: Product) =>
                    p.isAvailable && p.stock > 0 && p.vendor?.isActive !== false
                );
                setProducts(availableProducts);
            } catch (error) {
                console.error('Error fetching products:', error);
                enqueueToast('Failed to load products', 'error');
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [enqueueToast]);

    // Filter products by category AND search term
    useEffect(() => {
        if (products.length === 0) {
            setFilteredProducts([]);
            return;
        }

        let filtered = products;

        // 1. Filter by Category
        if (type) {
            const categoryType = Array.isArray(type) ? type[0].toLowerCase() : type.toLowerCase();
            filtered = filtered.filter(p =>
                p.category?.trim().toLowerCase() === categoryType
            );
        }

        // 2. Filter by Search Term
        if (searchTerm.trim()) {
            const lowerTerm = searchTerm.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(lowerTerm)
            );
        }

        setFilteredProducts(filtered);
    }, [type, products, searchTerm]);

    const title = type ? (Array.isArray(type) ? type[0] : type) : 'Category';

    // Fetch wishlist from API
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const response = await customerFetch(`${API_BASE}/customers/wishlist`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    if (response.status === 401) {
                        console.error('Unauthorized: Invalid or expired token');
                        return;
                    }
                    throw new Error('Failed to fetch wishlist');
                }

                const data = await response.json();
                // Extract product IDs from wishlist items
                const wishlistedProductIds = new Set<string>(
                    data.map((item: { product: { _id: string } }) => item.product._id)
                );
                setWishlist(wishlistedProductIds);
            } catch (error) {
                console.error('Error fetching wishlist:', error);
                // Don't show error toast for wishlist fetch failure - it's not critical
            }
        };

        fetchWishlist();
    }, []);

    // Interactions
    const toggleWishlist = async (id: string) => {
        const isCurrentlyWishlisted = wishlist.has(id);

        // Optimistic UI update
        const newWishlist = new Set(wishlist);
        if (isCurrentlyWishlisted) {
            newWishlist.delete(id);
        } else {
            newWishlist.add(id);
        }
        setWishlist(newWishlist);

        try {
            const token = localStorage.getItem('auth_token');
            if (!token) {
                enqueueToast('Please login to manage wishlist', 'error');
                // Revert optimistic update
                setWishlist(wishlist);
                return;
            }

            if (isCurrentlyWishlisted) {
                // Remove from wishlist
                const response = await customerFetch(`${API_BASE}/customers/wishlist/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to remove from wishlist');
                }
                enqueueToast('Removed from wishlist', 'success');
            } else {
                // Add to wishlist
                const response = await customerFetch(`${API_BASE}/customers/wishlist`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ productId: id })
                });

                if (!response.ok) {
                    throw new Error('Failed to add to wishlist');
                }
                enqueueToast('Added to wishlist', 'success');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            enqueueToast('Failed to update wishlist', 'error');
            // Revert optimistic update on error
            setWishlist(wishlist);
        }
    };

    // Helper to get logic from global cart
    const getCartQty = (productId: string) => {
        const item = cart.find(i => i.product._id === productId);
        return item ? item.quantity : 0;
    };

    const handleAddToCart = (product: Product) => {
        const productLite = {
            _id: product._id,
            name: product.name,
            price: product.price,
            vendorName: product.vendor?.storeName,
            image: product.image,
            stock: product.stock,
            category: product.category
        };
        addToCart(productLite);
    };



    const handleSearch = () => {
        if (searchTerm.trim()) {
            router.push(`/customer/browse-products?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <CustomerLayout disablePadding={true}>
            <div className="category-page-container">
                {/* Header */}
                <header className="category-header">
                    <button onClick={() => router.back()} className="back-button">
                        <img src="/customer/assets/icons/backward.svg" alt="Back" width={24} height={24} />
                    </button>
                    <h1 className="category-title">{title}</h1>
                </header>

                {/* Search */}
                <section className="category-search-section">
                    <div className="category-search-container">
                        <img
                            src="/customer/assets/icons/search.svg"
                            alt="Search"
                            className="category-search-icon"
                            onClick={handleSearch}
                            style={{ cursor: 'pointer' }}
                        />
                        <input
                            type="text"
                            placeholder="Search keywords.."
                            className="category-search-input"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                </section>

                {/* Featured Products Header */}
                <section className="category-products-section">
                    <div className="category-section-header">
                        <h3 className="category-section-title">Featured Products</h3>
                        <span className="category-section-action"><img src="/customer/assets/icons/forward.svg" alt="View all" width={24} height={24} /></span>
                    </div>

                    {loading ? (
                        <div className="products-grid">
                            {Array.from({ length: 8 }).map((_, idx) => (
                                <SkeletonProductCard key={`skeleton-${idx}`} />
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Product Grid */}
                            <div className="products-grid">
                                {filteredProducts.map((product) => {
                                    const qty = getCartQty(product._id);
                                    const isWishlisted = wishlist.has(product._id);

                                    // Calculate discount if MRP exists and is higher than price
                                    const hasDiscount = product.mrp && product.mrp > product.price;
                                    const discountPercent = hasDiscount
                                        ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
                                        : 0;

                                    return (
                                        <div key={product._id} className="product-card">
                                            <div className="product-card-header">
                                                {hasDiscount && (
                                                    <span className="product-badge discount">
                                                        -{discountPercent}%
                                                    </span>
                                                )}
                                                {!hasDiscount && <span></span>}
                                                <button
                                                    className="product-wishlist-btn"
                                                    onClick={() => toggleWishlist(product._id)}
                                                >
                                                    <img
                                                        src={isWishlisted ? "/customer/assets/icons/favorite-filled.svg" : "/customer/assets/icons/favorite.svg"}
                                                        alt="Wishlist"
                                                        className={`favorite-heart-icon ${isWishlisted ? 'active' : ''}`}
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
                                                {qty === 0 ? (
                                                    <button
                                                        className="product-add-btn"
                                                        onClick={() => handleAddToCart(product)}
                                                    >
                                                        <img src="/customer/assets/icons/bag.svg" alt="Cart" className="product-cart-icon" />
                                                        Add to cart
                                                    </button>
                                                ) : (
                                                    <div className="product-qty-controls">
                                                        <button
                                                            className="product-qty-btn"
                                                            onClick={() => {
                                                                if (qty === 1) {
                                                                    removeFromCart(product._id);
                                                                } else {
                                                                    updateQuantity(product._id, qty - 1);
                                                                }
                                                            }}
                                                        >
                                                            <img src="/customer/assets/icons/minus.svg" alt="Decrease" />
                                                        </button>
                                                        <span className="product-qty-value">{qty}</span>
                                                        <button
                                                            className="product-qty-btn"
                                                            onClick={() => updateQuantity(product._id, qty + 1)}
                                                        >
                                                            <img src="/customer/assets/icons/plus.svg" alt="Increase" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            {filteredProducts.length === 0 && (
                                <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                                    No products found in this category.
                                </div>
                            )}
                        </>
                    )}
                </section>
            </div>
        </CustomerLayout>
    );
}
