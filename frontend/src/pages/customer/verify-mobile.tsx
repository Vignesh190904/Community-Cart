'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function VerifyMobile() {
    const router = useRouter();
    const params = useSearchParams();

    const intent = params.get('intent'); // signup_phone | google_signup_phone
    const email = params.get('email') || '';

    // console.log('[VerifyMobile] Component Rendered', { intent, email });

    const [mobile, setMobile] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSendOtp = async () => {
        // console.log('[VerifyMobile] handleSendOtp called', { mobile, email, intent });
        if (mobile.length !== 10) {
            setError('Enter a valid 10-digit mobile number');
            return;
        }

        if (!email) {
            setError('Email missing. Please restart signup.');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(
                'http://localhost:5000/api/auth/customer/signup/add-mobile',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, mobile }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to send OTP');

            // console.log('[VerifyMobile] API Success', data);

            router.push(
                `/customer/verify-otp?intent=${intent}&email=${encodeURIComponent(
                    email
                )}&mobile=${mobile}`
            );
        } catch (err: any) {
            console.error('[VerifyMobile] Error:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="verify-mobile-page">
            <div className="vm-header">
                <button
                    className="vm-back-button"
                    onClick={() => router.back()}
                >
                    <img
                        src="/customer/assets/icons/backward.svg"
                        alt="back"
                        className="vm-back-icon"
                    />
                </button>
                <h1 className="vm-title">Verify Mobile Number</h1>
            </div>

            <p className="vm-subtitle">
                Please enter your mobile number to receive a verification code.
            </p>

            <div className="vm-content">
                {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

                <div className="vm-input-group">
                    <span className="vm-input-label">Mobile Number</span>
                    <div className="vm-input-field">
                        <div className="vm-prefix-container">
                            <span className="vm-prefix">+91</span>
                            <div className="vm-divider" />
                        </div>
                        <input
                            type="tel"
                            className="vm-phone-input"
                            placeholder="Enter 10 digit mobile number"
                            value={mobile}
                            maxLength={10}
                            onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                        />
                        <img
                            src="/customer/assets/icons/phone.svg"
                            alt="phone"
                            className="vm-input-icon-right"
                        />
                    </div>
                </div>

                <button
                    className="vm-verify-button"
                    onClick={handleSendOtp}
                    disabled={loading}
                >
                    {loading ? 'Sending OTP...' : 'Get OTP'}
                </button>
            </div>
        </div>
    );
}
