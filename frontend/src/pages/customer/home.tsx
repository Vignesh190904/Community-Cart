import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/ToastProvider';
import { useCustomerStore } from '../../context/CustomerStore';
import { customerFetch } from '../../utils/customerFetch';
import AppLoading from './apploading';
import { SkeletonProductCard } from '../../components/customer/SkeletonProductCard';
import SearchBar from './search_bar';

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

const CATEGORIES = [
    { id: '1', label: 'Grocery', icon: '/customer/assets/icons/grocery.svg', color: '#F3E8FF' },
    { id: '2', label: 'Vegies', icon: '/customer/assets/icons/vegies.svg', color: '#DCFCE7' },
    { id: '3', label: 'Fruits', icon: '/customer/assets/icons/fruits.svg', color: '#FFEDD5' },
    { id: '4', label: 'Bakery', icon: '/customer/assets/icons/bakery.svg', color: '#FEE2E2' },
    { id: '5', label: 'Pharmacy', icon: '/customer/assets/icons/pharmacy.svg', color: '#E0F7FA' },
    { id: '6', label: 'Laundry', icon: '/customer/assets/icons/laundry.svg', color: '#F3F4F6' },
];



export default function HomePage() {
    const router = useRouter();
    const { is_authenticated, user, loading } = useAuth();
    const { enqueueToast } = useToast();

    // Global Cart Store
    const { cart, addToCart, updateQuantity, removeFromCart } = useCustomerStore();

    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    // Removed local cart state
    const [products, setProducts] = useState<Product[]>([]);
    const [productsLoading, setProductsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    // Filter products based on search term
    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // HARD GUARD: Prevents auto-signout by waiting for 'loading' to finish
    useEffect(() => {
        if (!loading && !is_authenticated) {
            router.replace('/customer/signin');
        }
    }, [is_authenticated, loading, router]);

    // Toast warnings for missing phone and address
    useEffect(() => {
        if (!user || loading) return;

        // Check for missing phone
        if (!user.phone) {
            enqueueToast('Please add your mobile number', 'warning');
        }

        // Check for missing addresses - only show if addresses array exists and is empty
        if (user.addresses && user.addresses.length === 0) {
            enqueueToast('Please add your address', 'warning');
        }
    }, [user, loading, enqueueToast]);

    // Fetch products from API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setProductsLoading(true);
                const response = await customerFetch('http://localhost:5000/api/products');

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
                // Only show toast if it's NOT a silent network error (which is handled by customerFetch)
                // But wait, customerFetch returns a hanging promise on network error, so we never reach here!
                // If we reach here, it's a 4xx/5xx or some logic error.
                enqueueToast('Failed to load products', 'error');
                setProducts([]);
            } finally {
                // If network error, the promise hangs, so we NEVER reach finally.
                // Loading stays true. Perfect.
                // If success or other error, we reach here.
                setProductsLoading(false);
            }
        };

        fetchProducts();
    }, [enqueueToast]);

    // Fetch wishlist from API
    useEffect(() => {
        const fetchWishlist = async () => {
            try {
                const token = localStorage.getItem('auth_token');
                if (!token) return;

                const response = await fetch('http://localhost:5000/api/customers/wishlist', {
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
                const response = await fetch(`http://localhost:5000/api/customers/wishlist/${id}`, {
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
                const response = await fetch('http://localhost:5000/api/customers/wishlist', {
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

    // Handler to Add to Cart
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



    // Show neutral loading state while AuthContext verifies the token/cookie
    if (loading) {
        return <AppLoading />;
    }

    // Prevents UI flicker while useEffect handles the redirect
    if (!is_authenticated) {
        return null;
    }

    return (
        <CustomerLayout disablePadding={true}>
            <div className="home-container">
                {/* Section 1: Search Bar */}
                <section className="home-search-section">
                    <SearchBar
                        value={searchTerm}
                        onChange={setSearchTerm}
                    />
                </section>

                {/* Section 2: Hero Banner */}
                <section className="home-hero-section">
                    <img
                        src="/customer/assets/images/home_bg.png"
                        alt="Trusted Products Banner"
                        className="home-hero-image"
                    />
                    <div className="home-hero-overlay">
                        <h2 className="home-hero-text">
                            Trusted Products<br />
                            Trusted Vendors
                        </h2>
                    </div>
                </section>

                {/* Section 3: Categories */}
                <section className="home-category-section">
                    <div className="home-category-row">
                        {CATEGORIES.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/customer/category?type=${cat.label.toLowerCase()}`}
                                style={{ textDecoration: 'none' }}
                            >
                                <div className="home-category-item touchable">
                                    <div className="home-category-icon-wrapper" style={{ backgroundColor: cat.color }}>
                                        <img src={cat.icon} alt={cat.label} style={{ width: '24px', height: '24px' }} />
                                    </div>
                                    <span className="home-category-label">{cat.label}</span>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Section 4 & 5: Featured Products */}
                <section className="home-featured-section">
                    <div className="home-section-header">
                        <h3 className="home-section-title">Featured Products</h3>
                        <span className="home-section-action"><img src="/customer/assets/icons/forward.svg" alt="View all" width={24} height={24} /></span>
                    </div>


                    <div className="products-grid">
                        {productsLoading ? (
                            Array.from({ length: 8 }).map((_, idx) => (
                                <SkeletonProductCard key={`skeleton-${idx}`} />
                            ))
                        ) : filteredProducts.length === 0 ? (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '2rem',
                                color: '#666'
                            }}>
                                No products found
                            </div>
                        ) : (
                            filteredProducts.map((product) => {
                                const qty = getCartQty(product._id);
                                const isWishlisted = wishlist.has(product._id);

                                // Calculate discount badge if MRP exists and is higher than price
                                const hasDiscount = product.mrp && product.mrp > product.price;
                                const discountPercent = hasDiscount
                                    ? Math.round(((product.mrp! - product.price) / product.mrp!) * 100)
                                    : 0;

                                return (
                                    <div key={product._id} className="product-card touchable">
                                        <div className="product-card-header">
                                            {hasDiscount ? (
                                                <span className="product-badge discount">
                                                    -{discountPercent}%
                                                </span>
                                            ) : <span></span>}
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
                                                    className="product-add-btn touchable"
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
                            })
                        )}
                    </div>
                </section>
            </div>
        </CustomerLayout>
    );
}