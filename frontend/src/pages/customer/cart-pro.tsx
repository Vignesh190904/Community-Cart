import Head from 'next/head';
import { useRouter } from 'next/router';
import { useCustomerStore } from '../../context/CustomerStore';

export default function CartPro() {
    const router = useRouter();
    const { cart, updateQuantity, removeFromCart, totalPrice } = useCustomerStore();

    const handleUpdateQuantity = (productId: string, currentQty: number, delta: number) => {
        const newQuantity = currentQty + delta;
        if (newQuantity < 1) return;
        updateQuantity(productId, newQuantity);
    };

    return (
        <>
            <Head>
                <title>Cart Pro - Community Cart</title>
            </Head>

            <div style={{
                maxWidth: '500px',
                margin: '0 auto',
                padding: '20px',
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
            }}>

                {/* Header */}
                <header style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '30px',
                    position: 'relative',
                    padding: '10px 0'
                }}>
                    <button
                        onClick={() => router.back()}
                        style={{
                            background: 'none',
                            border: 'none',
                            fontSize: '24px',
                            cursor: 'pointer',
                            padding: '10px',
                            position: 'absolute',
                            left: -10
                        }}
                    >
                        ❮
                    </button>
                    <h1 style={{
                        fontSize: '18px',
                        fontWeight: '600',
                        margin: '0 auto',
                        textAlign: 'center'
                    }}>
                        Cart
                    </h1>
                </header>

                {/* List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', flex: 1 }}>
                    {cart.length === 0 ? (
                        <div style={{ textAlign: 'center', marginTop: '50px', color: '#888' }}>
                            Your cart is empty.
                        </div>
                    ) : (
                        cart.map(item => (
                            <div key={item.product._id} style={{ display: 'flex', gap: '15px' }}>
                                <div style={{
                                    flex: 1,
                                    border: '1px solid #707070',
                                    borderRadius: '15px',
                                    padding: '15px',
                                    display: 'flex',
                                    gap: '15px',
                                    alignItems: 'flex-start',
                                    backgroundColor: 'white'
                                }}>
                                    {item.product.image ? (
                                        <img
                                            src={item.product.image}
                                            alt={item.product.name}
                                            style={{
                                                width: '70px',
                                                height: '70px',
                                                borderRadius: '8px',
                                                objectFit: 'cover',
                                                flexShrink: 0
                                            }}
                                        />
                                    ) : (
                                        <div style={{
                                            width: '70px',
                                            height: '70px',
                                            backgroundColor: '#E0E0E0',
                                            borderRadius: '8px',
                                            flexShrink: 0
                                        }} />
                                    )}

                                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '70px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{item.product.name}</div>
                                                <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>Quantity</div>
                                                <div style={{ fontSize: '14px', color: '#4CAF50', fontWeight: '500' }}>₹{item.product.price.toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '15px',
                                        alignSelf: 'flex-end',
                                        marginBottom: '5px'
                                    }}>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity, 1)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#4CAF50',
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                padding: '0 5px'
                                            }}
                                            disabled={typeof item.product.stock === 'number' && item.quantity >= item.product.stock}
                                        >
                                            +
                                        </button>
                                        <span style={{ fontWeight: '600', fontSize: '16px' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product._id, item.quantity, -1)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#4CAF50',
                                                fontSize: '20px',
                                                fontWeight: 'bold',
                                                cursor: 'pointer',
                                                padding: '0 5px'
                                            }}
                                        >
                                            −
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={() => removeFromCart(item.product._id)}
                                    style={{
                                        backgroundColor: '#FF0000',
                                        border: 'none',
                                        borderRadius: '12px',
                                        width: '60px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        color: 'white',
                                        fontSize: '24px'
                                    }}
                                    aria-label="Remove item"
                                >
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <polyline points="3 6 5 6 21 6"></polyline>
                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    </svg>
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div style={{ marginTop: '30px' }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            padding: '0 10px'
                        }}>
                            <span style={{ fontSize: '20px', fontWeight: '500' }}>Total</span>
                            <span style={{ fontSize: '20px', fontWeight: '500' }}>₹{totalPrice.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={() => router.push('/customer/place-order')}
                            style={{
                                width: '100%',
                                padding: '18px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50px',
                                fontSize: '18px',
                                fontWeight: '600',
                                cursor: 'pointer',
                                boxShadow: '0 4px 6px rgba(76, 175, 80, 0.3)'
                            }}
                        >
                            Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
