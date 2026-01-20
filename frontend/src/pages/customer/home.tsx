import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../components/ui/ToastProvider';

// --- Mock Data ---

interface Product {
    id: string;
    name: string;
    quantityLabel: string;
    price: number;
    image: string;
    badge?: { type: 'new' | 'discount'; label: string };
    isWishlisted?: boolean;
}

const MOCK_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Item_Name',
        quantityLabel: 'Quantity',
        price: 80.00,
        image: '/customer/assets/images/Vector.png',
        badge: { type: 'discount', label: '-16%' },
    },
    {
        id: '2',
        name: 'Item_Name',
        quantityLabel: 'Quantity',
        price: 80.00,
        image: '/customer/assets/images/Vector.png',
        badge: { type: 'new', label: 'NEW' },
    },
    {
        id: '3',
        name: 'Item_Name',
        quantityLabel: 'Quantity',
        price: 80.00,
        image: '/customer/assets/images/Vector.png',
        badge: { type: 'new', label: 'NEW' },
    },
    {
        id: '4',
        name: 'Item_Name',
        quantityLabel: 'Quantity',
        price: 80.00,
        image: '/customer/assets/images/Vector.png',
        badge: { type: 'discount', label: '-16%' },
    },
];

const CATEGORIES = [
    { id: '1', label: 'Grocery', icon: '/customer/assets/icons/grocery.svg', color: '#F3E8FF' },
    { id: '2', label: 'Vegies', icon: '/customer/assets/icons/vegies.svg', color: '#DCFCE7' },
    { id: '3', label: 'Fruits', icon: '/customer/assets/icons/fruits.svg', color: '#FFEDD5' },
    { id: '4', label: 'Bakery', icon: '/customer/assets/icons/bakery.svg', color: '#FEE2E2' },
    { id: '5', label: 'Laundry', icon: '/customer/assets/icons/laundry.svg', color: '#F3F4F6' },
];

export default function HomePage() {
    const router = useRouter();
    const { is_authenticated, user, loading } = useAuth();
    const { enqueueToast } = useToast();

    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [cart, setCart] = useState<Map<string, number>>(new Map());

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

        // Check for missing addresses
        if (!user.addresses || user.addresses.length === 0) {
            enqueueToast('Please add your address', 'warning');
        }
    }, [user, loading, enqueueToast]);

    const toggleWishlist = (id: string) => {
        const newWishlist = new Set(wishlist);
        if (newWishlist.has(id)) {
            newWishlist.delete(id);
        } else {
            newWishlist.add(id);
        }
        setWishlist(newWishlist);
    };

    const updateCart = (id: string, delta: number) => {
        const newCart = new Map(cart);
        const currentQty = newCart.get(id) || 0;
        const newQty = Math.max(0, currentQty + delta);

        if (newQty === 0) {
            newCart.delete(id);
        } else {
            newCart.set(id, newQty);
        }
        setCart(newCart);
    };

    // Show neutral loading state while AuthContext verifies the token/cookie
    if (loading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#fff',
                fontFamily: 'sans-serif',
                color: '#222'
            }}>
                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: '500' }}>Verifying Session...</p>
                </div>
            </div>
        );
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
                    <div className="home-search-container">
                        <img src="/customer/assets/icons/search.svg" alt="Search" className="home-search-icon" />
                        <input
                            type="text"
                            placeholder="Search keywords.."
                            className="home-search-input"
                            readOnly
                        />
                    </div>
                </section>

                {/* Section 2: Hero Banner */}
                <section className="home-hero-section">
                    <img
                        src="/customer/assets/images/Vector.png"
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
                        {MOCK_PRODUCTS.map((product) => {
                            const qty = cart.get(product.id) || 0;
                            const isWishlisted = wishlist.has(product.id);

                            return (
                                <div key={product.id} className="product-card touchable">
                                    <div className="product-card-header">
                                        {product.badge ? (
                                            <span className={`product-badge ${product.badge.type}`}>
                                                {product.badge.label}
                                            </span>
                                        ) : <span></span>}
                                        <button
                                            className="product-wishlist-btn"
                                            onClick={() => toggleWishlist(product.id)}
                                        >
                                            <img
                                                src="/customer/assets/icons/favorite.svg"
                                                alt="Wishlist"
                                                className={`favorite-heart-icon ${isWishlisted ? 'active' : ''}`}
                                                style={{ width: '24px', height: '24px' }}
                                            />
                                        </button>
                                    </div>

                                    <div className="product-image-wrapper">
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="product-image"
                                        />
                                    </div>

                                    <div className="product-card-body">
                                        <h4 className="product-name">{product.name}</h4>
                                        <p className="product-qty-label">{product.quantityLabel}</p>
                                        <div className="product-price-wrapper">
                                            <span className="product-final-price">₹{product.price.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="product-card-footer">
                                        {qty === 0 ? (
                                            <button
                                                className="product-add-btn touchable"
                                                onClick={() => updateCart(product.id, 1)}
                                            >
                                                <img src="/customer/assets/icons/bag.svg" alt="Cart" className="product-cart-icon" />
                                                Add to cart
                                            </button>
                                        ) : (
                                            <div className="product-qty-controls">
                                                <button
                                                    className="product-qty-btn"
                                                    onClick={() => updateCart(product.id, -1)}
                                                >
                                                    −
                                                </button>
                                                <span className="product-qty-value">{qty}</span>
                                                <button
                                                    className="product-qty-btn"
                                                    onClick={() => updateCart(product.id, 1)}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </div>
        </CustomerLayout>
    );
}