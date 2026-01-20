import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useToast } from '../../components/ui/ToastProvider';

/* ===== LOCKED ADDRESS MODEL ===== */
interface AddressPayload {
    community: string;
    block: string;
    floor: string;
    flat_number: string;
}

export default function EditAddressPage() {
    const router = useRouter();
    const { id } = router.query;
    const { showToast } = useToast();

    const [form, setForm] = useState<AddressPayload>({
        community: 'Community Cart',
        block: '',
        floor: '',
        flat_number: '',
    });

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    /* ===== LOAD EXISTING ADDRESS (EDIT MODE) ===== */
    useEffect(() => {
        if (!id) return;

        setPageLoading(true);

        const token = localStorage.getItem('auth_token');

        fetch('http://localhost:5000/api/customers/addresses', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })

            .then(res => res.json())
            .then((addresses: any[]) => {
                const addr = addresses.find(a => a._id === id);
                if (!addr) {
                    showToast('Address not found', 'error');
                    router.push('/customer/address');
                    return;
                }

                setForm({
                    community: addr.community,
                    block: addr.block,
                    floor: addr.floor,
                    flat_number: addr.flat_number,
                });
            })
            .catch(() => showToast('Failed to load address', 'error'))
            .finally(() => setPageLoading(false));
    }, [id, router, showToast]);

    const handleChange = (field: keyof AddressPayload, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    /* ===== SUBMIT ===== */
    const handleSubmit = async () => {
        const { community, block, floor, flat_number } = form;

        if (!community || !block || !floor || !flat_number) {
            showToast('Please fill all address fields', 'error');
            return;
        }

        setLoading(true);
        try {
            const url = id
                ? `http://localhost:5000/api/customers/addresses/${id}`
                : 'http://localhost:5000/api/customers/addresses';

            const method = id ? 'PUT' : 'POST';

            // Strict payload - only send allowed fields
            const payload = {
                community,
                block,
                floor,
                flat_number
            };

            const token = localStorage.getItem('auth_token');

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Operation failed');
            }

            showToast(id ? 'Address updated' : 'Address added', 'success');
            router.push('/customer/address');
        } catch (err: any) {
            showToast(err.message || 'Server error', 'error');
        } finally {
            setLoading(false);
        }
    };

    if (pageLoading) {
        return <div style={{ padding: 20 }}>Loading...</div>;
    }

    return (
        <CustomerLayout disablePadding>
            <div className="address-page-container">
                {/* Header */}
                <header className="address-header">
                    <button
                        className="address-back-btn"
                        onClick={() => router.back()}
                    >
                        <img
                            src="/customer/assets/icons/backward.svg"
                            alt="Back"
                            width={24}
                            height={24}
                        />
                    </button>
                    <h1 className="address-title">
                        {id ? 'Edit Address' : 'Add Address'}
                    </h1>
                </header>

                <div style={{ height: 32 }} />

                {/* Form */}
                <div className="address-form">
                    <div className="address-input-group">
                        <label className="address-label">Community *</label>
                        <input
                            className="address-input"
                            value={form.community}
                            readOnly
                            style={{ backgroundColor: '#f5f5f5' }}
                        />
                    </div>

                    <div className="address-input-group">
                        <label className="address-label">Block *</label>
                        <input
                            className="address-input"
                            value={form.block}
                            onChange={e => handleChange('block', e.target.value)}
                            placeholder="e.g. Block A"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                        <div className="address-input-group">
                            <label className="address-label">Floor *</label>
                            <input
                                className="address-input"
                                value={form.floor}
                                onChange={e => handleChange('floor', e.target.value)}
                                placeholder="e.g. 5"
                            />
                        </div>

                        <div className="address-input-group">
                            <label className="address-label">Flat Number *</label>
                            <input
                                className="address-input"
                                value={form.flat_number}
                                onChange={e => handleChange('flat_number', e.target.value)}
                                placeholder="e.g. 504"
                            />
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="address-cta-container">
                    <button
                        className="address-cta-btn touchable"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? 'Saving...' : id ? 'Update Address' : 'Save Address'}
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
}
