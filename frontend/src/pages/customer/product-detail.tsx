import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useCustomerStore } from '../../context/CustomerStore';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useToast } from '../../components/ui/ToastProvider';
import { addToWishlist, removeFromWishlist, fetchWishlist } from '../../services/wishlistApi';
import { customerFetch } from '../../utils/customerFetch';
import TopNavbar from './TopNavbar';

// Type same as browse
interface Product {
    _id: string;
    name: string;
    price: number;
    mrp?: number;
    image?: string;
    vendor?: { name?: string };
    isAvailable?: boolean;
    stock?: number;
    description?: string; // Add description support
    unit?: string; // Add unit support
}

const API_BASE = 'http://localhost:5000/api';

export default function ProductDetail() {
    const router = useRouter();
    const { id } = router.query;
    const { addToCart, cart } = useCustomerStore();
    const { pushToast } = useToast();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [qty, setQty] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [wishlistLoading, setWishlistLoading] = useState(false);

    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            try {
                // Fetch Product
                const res = await customerFetch(`${API_BASE}/products/${id}`);
                if (!res.ok) throw new Error('Product not found');
                const productData = await res.json();
                setProduct(productData);

                // Reset qty
                setQty(1);

                // Check Wishlist Status
                try {
                    const wishlistData = await fetchWishlist();
                    const inWishlist = wishlistData.some((item: any) => item.product._id === id);
                    setIsWishlisted(inWishlist);
                } catch (err) {
                    console.error('Failed to fetch wishlist status', err);
                }

            } catch (error) {
                console.error(error);
                pushToast({ type: 'error', message: 'Failed to load product' });
                // router.back(); 
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, pushToast]);

    const handleQtyChange = (delta: number) => {
        setQty(prev => Math.max(1, prev + delta));
    };

    const toggleWishlist = async () => {
        if (!product) return;
        const previousState = isWishlisted;

        // Optimistic update
        setIsWishlisted(!previousState);
        setWishlistLoading(true);

        try {
            if (previousState) {
                await removeFromWishlist(product._id);
                pushToast({ type: 'success', message: 'Removed from favorites' });
            } else {
                await addToWishlist(product._id);
                pushToast({ type: 'success', message: 'Added to favorites' });
            }
        } catch (err: any) {
            // Revert
            setIsWishlisted(previousState);
            pushToast({ type: 'error', message: err.message || 'Failed to update wishlist' });
        } finally {
            setWishlistLoading(false);
        }
    };

    const handleAddToCart = () => {
        if (!product) return;
        const stock = product.stock ?? 0;

        // Check stock
        if (stock <= 0) {
            pushToast({ type: 'error', message: 'This item is out of stock' });
            return;
        }

        if (qty > stock) {
            pushToast({ type: 'warning', message: `Only ${stock} available` });
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

        if (cart.length > 0) {
            // Check vendor consistency if needed. For now, assuming standard flow.
        }

        pushToast({ type: 'success', message: `${product.name} x ${qty} added` });
        router.back();
        // console.log('Added to cart', { productId: product._id, qty });
    };

    if (loading) return <CustomerLayout disablePadding={true}><div className="product-detail-page"></div></CustomerLayout>;
    if (!product) return null;

    return (
        <CustomerLayout disablePadding={true}>
            <TopNavbar title={product?.name || "Product"} showBack={true} />
            {/* Styles are loaded globally via _app.tsx importing 'product-detail.css' */}
            <div className="product-detail-page">

                {/* Scrollable Content */}
                <div className="product-content-scroll">
                    {/* Image */}
                    <div className="detail-image-section">
                        {(product.mrp && product.mrp > product.price) && (
                            <div className="detail-discount-badge">
                                -{Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
                            </div>
                        )}
                        <img
                            src={product.image || '/customer/assets/icons/missing.svg'}
                            alt={product.name}
                            className={product.image ? 'detail-image' : 'detail-image product-image-missing'}
                        />
                    </div>

                    {/* Info */}
                    <div className="detail-info-section">
                        <div className="detail-header-row">
                            <h1 className="detail-name">{product.name}</h1>
                            <button className="wishlist-toggle-btn" onClick={toggleWishlist} disabled={wishlistLoading}>
                                <img
                                    src={isWishlisted ? "/customer/assets/icons/favorite-filled.svg" : "/customer/assets/icons/favorite.svg"}
                                    alt="Wishlist"
                                    style={{
                                        opacity: 1,
                                        filter: isWishlisted ? 'none' : 'grayscale(100%)'
                                    }}
                                    width={24} height={24}
                                />
                            </button>
                        </div>

                        <p className="detail-unit">{product.unit || '500 gms'}</p>
                        <div className="detail-price-box">
                            <span className="detail-price">₹{product.price.toFixed(2)}</span>
                            {(product.mrp && product.mrp > product.price) && (
                                <span className="detail-original-price">
                                    MRP <span style={{ textDecoration: 'line-through' }}>₹{product.mrp.toFixed(2)}</span>
                                </span>
                            )}
                        </div>

                        <div className="detail-description">
                            {product.description || `Organic Mountain works as a seller for many organic growers of organic lemons. Organic lemons are easy to spot in your produce aisle. They are just like regular lemons, but they will usually have a few more scars on the outside of the lemon skin. Organic lemons are considered to be the world's finest lemon for juicing`}
                        </div>
                    </div>
                </div>

                {/* Footer (Fixed) */}
                <footer className="detail-action-bar">
                    {/* Qty Selector - Stacked */}
                    <div className="qty-selector-container">
                        <button className="qty-btn-action" onClick={() => handleQtyChange(-1)}>
                            <img src="/customer/assets/icons/minus.svg" alt="-" width={16} height={16} />
                        </button>
                        <span className="qty-value-display">{qty}</span>
                        <button className="qty-btn-action" onClick={() => handleQtyChange(1)}>
                            <img src="/customer/assets/icons/plus.svg" alt="+" width={16} height={16} />
                        </button>
                    </div>

                    {/* Add Button - Stacked */}
                    <button className="add-to-cart-submit-btn" onClick={handleAddToCart}>
                        <img src="/customer/assets/icons/bag.svg" alt="" style={{ filter: 'brightness(0) invert(1)' }} width={20} height={20} />
                        Add to cart
                    </button>
                </footer>
            </div>
        </CustomerLayout>
    );
}
