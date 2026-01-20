import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';

// --- Mock Data ---

interface Product {
    id: string;
    name: string;
    quantityLabel: string;
    price: number;
    image: string;
    badge?: { type: 'new' | 'discount'; label: string };
    category: string; // Added category field
}

// Extended mock data to ensure we have items for each category
const ALL_PRODUCTS: Product[] = [
    {
        id: '1',
        name: 'Fresh Spinach',
        quantityLabel: '1 Bunch',
        price: 40.00,
        image: '/customer/assets/images/Vector.png',
        badge: { type: 'discount', label: '-16%' },
        category: 'vegies'
    },
    {
        id: '2',
        name: 'Organic Apple',
        quantityLabel: '1 kg',
        price: 180.00,
        image: '/customer/assets/images/Vector.png',
        badge: { type: 'new', label: 'NEW' },
        category: 'fruits'
    },
    {
        id: '3',
        name: 'Wheat Bread',
        quantityLabel: '1 Packet',
        price: 35.00,
        image: '/customer/assets/images/Vector.png',
        category: 'bakery'
    },
    {
        id: '4',
        name: 'Detergent Pods',
        quantityLabel: '12 Pack',
        price: 220.00,
        image: '/customer/assets/images/Vector.png',
        badge: { type: 'discount', label: '-10%' },
        category: 'laundry'
    },
    {
        id: '5',
        name: 'Rice Bag',
        quantityLabel: '5 kg',
        price: 450.00,
        image: '/customer/assets/images/Vector.png',
        category: 'grocery'
    },
    {
        id: '6',
        name: 'Tomato',
        quantityLabel: '1 kg',
        price: 30.00,
        image: '/customer/assets/images/Vector.png',
        category: 'vegies'
    },
    {
        id: '7',
        name: 'Banana',
        quantityLabel: '1 Dozen',
        price: 60.00,
        image: '/customer/assets/images/Vector.png',
        category: 'fruits'
    },
    {
        id: '8',
        name: 'Milk',
        quantityLabel: '1 L',
        price: 50.00,
        image: '/customer/assets/images/Vector.png',
        badge: { type: 'new', label: 'NEW' },
        category: 'grocery'
    }
];



export default function CategoryPage() {
    const router = useRouter();
    const { type } = router.query;

    // State
    const [wishlist, setWishlist] = useState<Set<string>>(new Set());
    const [cart, setCart] = useState<Map<string, number>>(new Map());
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

    // Filter products when type changes
    useEffect(() => {
        if (!type) {
            setFilteredProducts(ALL_PRODUCTS);
            return;
        }

        const categoryType = Array.isArray(type) ? type[0].toLowerCase() : type.toLowerCase();

        // Simple filter based on exact match or partial if needed. 
        // Using exact match on the 'category' field defined below.
        const filtered = ALL_PRODUCTS.filter(p => p.category === categoryType);

        // If no products found (e.g. Bakery implies 'bakery' but maybe I only have mock data for others), 
        // effectively show empty or maybe fallback to all for demo if stricter compliance isn't needed. 
        // But user asked for "Internally apply a simple mock filter category === selectedCategory".
        setFilteredProducts(filtered);
    }, [type]);

    const title = type ? (Array.isArray(type) ? type[0] : type) : 'Category';

    // Interactions
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
                        <img src="/customer/assets/icons/search.svg" alt="Search" className="category-search-icon" />
                        <input
                            type="text"
                            placeholder="Search keywords.."
                            className="category-search-input"
                            readOnly
                        />
                    </div>
                </section>

                {/* Featured Products Header */}
                <section className="category-products-section">
                    <div className="category-section-header">
                        <h3 className="category-section-title">Featured Products</h3>
                        <span className="category-section-action"><img src="/customer/assets/icons/forward.svg" alt="View all" width={24} height={24} /></span>
                    </div>

                    {/* Product Grid */}
                    <div className="products-grid">
                        {filteredProducts.map((product) => {
                            const qty = cart.get(product.id) || 0;
                            const isWishlisted = wishlist.has(product.id);

                            return (
                                <div key={product.id} className="product-card">
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
                                                className="product-add-btn"
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
                    {filteredProducts.length === 0 && (
                        <div style={{ padding: '20px', textAlign: 'center', color: '#888' }}>
                            No products found in this category.
                        </div>
                    )}
                </section>
            </div>
        </CustomerLayout>
    );
}
