'use client';

import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function VerifyOtp() {
    const router = useRouter();
    const { sign_in } = useAuth();
    const { intent, email = '' } = router.query as {
        intent?: string;
        email?: string;
    };

    const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [timer, setTimer] = useState(30);
    const [resendDisabled, setResendDisabled] = useState(true);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        inputRefs.current[0]?.focus();
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else {
            setResendDisabled(false);
        }
        return () => clearInterval(interval);
    }, [timer]);

    const handleChange = (val: string, idx: number) => {
        if (!/^\d?$/.test(val)) return;
        const copy = [...otp];
        copy[idx] = val;
        setOtp(copy);
        if (val && idx < 5) inputRefs.current[idx + 1]?.focus();
    };

    const handleResend = async () => {
        if (resendDisabled) return;
        setLoading(true);
        setError('');

        try {
            const res = await fetch(
                'http://localhost:5000/api/auth/customer/signup/resend-otp',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email }),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Resend failed');

            setTimer(30);
            setResendDisabled(true);
            setOtp(Array(6).fill(''));
            inputRefs.current[0]?.focus();
            alert(`OTP Resent! Attempts remaining: ${data.attemptsRemaining}`);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '');
        if (!pasted) return;

        const digits = pasted.slice(0, 6).split('');
        const newOtp = [...otp];

        digits.forEach((d, i) => {
            newOtp[i] = d;
        });

        setOtp(newOtp);

        const lastIndex = Math.min(digits.length, 6) - 1;
        inputRefs.current[lastIndex]?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === 'Backspace') {
            if (otp[index]) {
                const newOtp = [...otp];
                newOtp[index] = '';
                setOtp(newOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
        }
    };

    const handleVerify = async () => {
        const otpValue = otp.join('');
        if (otpValue.length !== 6) {
            setError('Enter 6-digit OTP');
            return;
        }

        setLoading(true);
        setError('');

        try {
            // Determine endpoint based on intent
            let endpoint = '';
            if (intent === 'manual_signup') {
                endpoint = 'http://localhost:5000/api/auth/customer/signup/verify-email';
            } else if (intent === 'google_signup') {
                endpoint = 'http://localhost:5000/api/auth/customer/google/signup/verify-email';
            } else {
                throw new Error('Invalid signup intent. Please restart signup.');
            }

            if (!email) throw new Error('Email missing. Restart signup.');

            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp: otpValue }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'OTP verification failed');

            // Update AuthContext state immediately
            if (data.auth_token && data.user) {
                sign_in(data.user, data.auth_token);
            }

            // Navigate to home
            router.push('/customer/home');

        } catch (err: any) {
            setError(err.message);
            setOtp(Array(6).fill(''));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="otp-page">
            <div className="otp-header">
                <button className="otp-back-button" onClick={() => router.back()}>
                    <img
                        src="/customer/assets/icons/backward.svg"
                        alt="back"
                        className="otp-back-icon"
                    />
                </button>
            </div>

            <div className="otp-content">
                <p className="otp-instruction">
                    Enter the 6-digit code sent to your
                    <br />
                    {email}
                </p>

                {error && <p style={{ color: 'red', marginBottom: 16 }}>{error}</p>}

                <div className="otp-inputs-container">
                    {otp.map((d, i) => (
                        <input
                            key={i}
                            onPaste={handlePaste}
                            onKeyDown={(e) => handleKeyDown(e, i)}
                            className={`otp-digit-input ${d ? 'filled' : ''}`}
                            maxLength={1}
                            value={d}
                            onChange={(e) => handleChange(e.target.value, i)}
                            ref={(el) => {
                                inputRefs.current[i] = el;
                            }}
                        />
                    ))}
                </div>

                <div className="otp-resend">
                    Didn't receive code?
                    <button
                        className="otp-resend-link"
                        onClick={handleResend}
                        disabled={resendDisabled}
                        style={{
                            opacity: resendDisabled ? 0.5 : 1,
                            cursor: resendDisabled ? 'not-allowed' : 'pointer',
                        }}
                    >
                        Resend {timer > 0 ? `(${timer}s)` : ''}
                    </button>
                </div>

                <button
                    className="otp-verify-button"
                    onClick={handleVerify}
                    disabled={loading}
                >
                    {loading ? 'Verifying...' : 'Verify'}
                </button>
            </div>
        </div>
    );
}
