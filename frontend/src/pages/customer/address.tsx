import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useToast } from '../../components/ui/ToastProvider';

/* ===== FINAL LOCKED ADDRESS MODEL ===== */
interface Address {
    _id: string;
    community: string;
    block: string;
    floor: string;
    flat_number: string;
    is_primary: boolean;
}

export default function AddressPage() {
    const router = useRouter();
    const { showToast } = useToast();

    const [addresses, setAddresses] = useState<Address[]>([]);
    const [activeTab, setActiveTab] = useState<'main' | 'second'>('main');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAddresses();
    }, []);

    const fetchAddresses = async () => {
        try {
            const token = localStorage.getItem('auth_token');

            const res = await fetch('http://localhost:5000/api/customers/addresses', {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error('Failed to fetch addresses');
            }

            const data = await res.json();
            setAddresses(data);
        } catch (err) {
            console.error(err);
            showToast('Failed to load addresses', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (addressId: string) => {
        if (!confirm('Are you sure you want to delete this address?')) return;

        try {
            const token = localStorage.getItem('auth_token');

            const res = await fetch(
                `http://localhost:5000/api/customers/addresses/${addressId}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.message || 'Delete failed');
            }

            showToast('Address deleted successfully', 'success');
            await fetchAddresses(); // Refetch to get updated primary status
            setActiveTab('main'); // Always switch to main tab after delete
        } catch (err: any) {
            showToast(err.message || 'Server error', 'error');
        }
    };

    const primaryAddress = addresses.find(a => a.is_primary);
    const secondaryAddress = addresses.find(a => !a.is_primary);
    const currentAddress = activeTab === 'main' ? primaryAddress : secondaryAddress;

    return (
        <CustomerLayout disablePadding>
            <div className="address-page-container has-fixed-header">
                {/* Header */}
                <header className="address-header fixed-header">
                    <button
                        className="address-back-btn touchable"
                        onClick={() => router.back()}
                    >
                        <img
                            src="/customer/assets/icons/backward.svg"
                            alt="Back"
                            width={24}
                            height={24}
                        />
                    </button>
                    <h1 className="address-title">Address</h1>
                </header>

                {/* Toggle */}
                <div className="address-toggle-container">
                    <button
                        className={`address-toggle-btn touchable ${activeTab === 'main' ? 'active' : ''}`}
                        onClick={() => setActiveTab('main')}
                    >
                        Main
                    </button>
                    <button
                        className={`address-toggle-btn touchable ${activeTab === 'second' ? 'active' : ''}`}
                        onClick={() => setActiveTab('second')}
                    >
                        Second
                    </button>
                </div>

                {/* Address Display */}
                <div className="address-form">
                    {loading ? (
                        <p style={{ padding: '20px' }}>Loading...</p>
                    ) : currentAddress ? (
                        <>
                            <div className="address-input-group">
                                <label className="address-label">Community</label>
                                <input
                                    className="address-input"
                                    value={currentAddress.community}
                                    readOnly
                                />
                            </div>

                            <div className="address-input-group">
                                <label className="address-label">Block</label>
                                <input
                                    className="address-input"
                                    value={currentAddress.block}
                                    readOnly
                                />
                            </div>

                            <div className="address-input-group">
                                <label className="address-label">Floor</label>
                                <input
                                    className="address-input"
                                    value={currentAddress.floor}
                                    readOnly
                                />
                            </div>

                            <div className="address-input-group">
                                <label className="address-label">Flat Number</label>
                                <input
                                    className="address-input"
                                    value={currentAddress.flat_number}
                                    readOnly
                                />
                            </div>
                        </>
                    ) : (
                        <div className="empty-address-placeholder">
                            <p>No address found.</p>
                        </div>
                    )}
                </div>

                {/* CTAs */}
                <div className="address-cta-container">
                    {currentAddress ? (
                        <>
                            <button
                                className="address-cta-btn touchable"
                                onClick={() =>
                                    router.push(`/customer/edit-address?id=${currentAddress._id}`)
                                }
                            >
                                Edit Address
                            </button>

                            <button
                                className="address-cta-btn delete-btn touchable"
                                onClick={() => handleDelete(currentAddress._id)}
                            >
                                Delete Address
                            </button>
                        </>
                    ) : addresses.length < 2 ? (
                        <button
                            className="address-cta-btn touchable"
                            onClick={() => router.push('/customer/edit-address')}
                        >
                            Add New Address
                        </button>
                    ) : (
                        <p style={{ padding: '20px' }}>Maximum 2 addresses allowed</p>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
