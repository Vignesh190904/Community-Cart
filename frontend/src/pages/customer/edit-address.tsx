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
    is_primary?: boolean;
}

interface Address extends AddressPayload {
    _id: string;
    is_primary: boolean;
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
        is_primary: false,
    });

    const [originalForm, setOriginalForm] = useState<AddressPayload>({
        community: 'Community Cart',
        block: '',
        floor: '',
        flat_number: '',
        is_primary: false,
    });

    const [allAddresses, setAllAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);

    /* ===== LOAD EXISTING ADDRESS (EDIT MODE) ===== */
    useEffect(() => {
        const token = localStorage.getItem('auth_token');

        setPageLoading(true);

        fetch('http://localhost:5000/api/customers/addresses', {
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then((addresses: Address[]) => {
                setAllAddresses(addresses);

                if (id) {
                    const addr = addresses.find(a => a._id === id);
                    if (!addr) {
                        showToast('Address not found', 'error');
                        router.push('/customer/address');
                        return;
                    }

                    const loadedForm = {
                        community: addr.community,
                        block: addr.block,
                        floor: addr.floor,
                        flat_number: addr.flat_number,
                        is_primary: addr.is_primary,
                    };

                    setForm(loadedForm);
                    setOriginalForm(loadedForm);
                }
            })
            .catch(() => showToast('Failed to load addresses', 'error'))
            .finally(() => setPageLoading(false));
    }, [id, router, showToast]);

    const handleChange = (field: keyof AddressPayload, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    // Detect if any changes have been made
    const has_changes =
        form.flat_number !== originalForm.flat_number ||
        form.floor !== originalForm.floor ||
        form.block !== originalForm.block ||
        form.community !== originalForm.community ||
        form.is_primary !== originalForm.is_primary;

    /* ===== SUBMIT ===== */
    const handleSubmit = async () => {
        const { community, block, floor, flat_number, is_primary } = form;

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

            // Build payload - include is_primary only if editing
            const payload: any = {
                community,
                block,
                floor,
                flat_number
            };

            // Include is_primary only when editing and user can toggle it
            if (id && allAddresses.length === 2) {
                payload.is_primary = is_primary;
            }

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

            showToast(id ? 'Address updated successfully' : 'Address added successfully', 'success');
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
                    {/* Flat Number */}
                    <div className="address-input-group">
                        <label className="address-label">Flat no.</label>
                        <input
                            className="address-input"
                            value={form.flat_number}
                            onChange={e => handleChange('flat_number', e.target.value)}
                            placeholder="e.g. 401"
                        />
                        {form.flat_number && (
                            <img
                                src="/customer/assets/icons/check.svg"
                                alt="Valid"
                                className={`address-valid-icon ${form.flat_number !== originalForm.flat_number ? 'editing' : 'saved'}`}
                            />
                        )}
                    </div>

                    {/* Floor */}
                    <div className="address-input-group">
                        <label className="address-label">Floor</label>
                        <input
                            className="address-input"
                            value={form.floor}
                            onChange={e => handleChange('floor', e.target.value)}
                            placeholder="e.g. 4"
                        />
                        {form.floor && (
                            <img
                                src="/customer/assets/icons/check.svg"
                                alt="Valid"
                                className={`address-valid-icon ${form.floor !== originalForm.floor ? 'editing' : 'saved'}`}
                            />
                        )}
                    </div>

                    {/* Block */}
                    <div className="address-input-group">
                        <label className="address-label">Block</label>
                        <input
                            className="address-input"
                            value={form.block}
                            onChange={e => handleChange('block', e.target.value)}
                            placeholder="e.g. Saraswathi"
                        />
                        {form.block && (
                            <img
                                src="/customer/assets/icons/check.svg"
                                alt="Valid"
                                className={`address-valid-icon ${form.block !== originalForm.block ? 'editing' : 'saved'}`}
                            />
                        )}
                    </div>

                    {/* Community */}
                    <div className="address-input-group">
                        <label className="address-label">Community</label>
                        <input
                            className="address-input"
                            value={form.community}
                            readOnly
                            style={{ cursor: 'default' }}
                        />
                        <img src="/customer/assets/icons/downward.svg" alt="Dropdown" className="address-dropdown-icon" />
                    </div>
                </div>

                {/* Primary Address Toggle - Only show when editing and 2 addresses exist */}
                {id && allAddresses.length === 2 && (
                    <div className="primary-toggle-container">
                        <span className="primary-toggle-label">Set as Primary Address</span>
                        <div
                            className={`primary-toggle-switch ${form.is_primary ? 'active' : ''}`}
                            onClick={() => setForm(prev => ({ ...prev, is_primary: !prev.is_primary }))}
                        >
                            <div className="primary-toggle-slider" />
                        </div>
                    </div>
                )}

                {/* CTA */}
                <div className="address-cta-container">
                    <button
                        className="address-cta-btn touchable"
                        onClick={handleSubmit}
                        disabled={loading || !has_changes}
                    >
                        {loading ? 'Saving...' : id ? 'Update Address' : 'Save Address'}
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
}
