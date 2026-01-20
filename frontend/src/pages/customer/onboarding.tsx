import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

export default function Onboarding() {
    const router = useRouter();
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        phone: '',
        address: {
            flat_number: '',
            floor: '',
            block_name: '',
            community_name: 'Community Cart' // Default and only option
        }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        if (name.startsWith('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('http://localhost:5000/api/customers/onboarding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Onboarding failed');

            // Onboarding complete - navigate to home while staying logged in
            router.push('/customer/home');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="onboarding-page" style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Welcome! Let's get you set up.</h1>
            <p>We need a few details to serve you better.</p>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px' }}
                />
                <input
                    name="phone"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px' }}
                />

                <h3>Primary Address</h3>

                <input
                    name="address.flat_number"
                    placeholder="Flat Number"
                    value={formData.address.flat_number}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px' }}
                />

                <input
                    name="address.floor"
                    placeholder="Floor"
                    value={formData.address.floor}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px' }}
                />

                <input
                    name="address.block_name"
                    placeholder="Block Name"
                    value={formData.address.block_name}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px' }}
                />

                <select
                    name="address.community_name"
                    value={formData.address.community_name}
                    onChange={handleChange}
                    required
                    style={{ padding: '10px' }}
                >
                    <option value="Community Cart">Community Cart</option>
                </select>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '12px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer'
                    }}
                >
                    {loading ? 'Saving...' : 'Complete Setup'}
                </button>
            </form>
        </div>
    );
}
