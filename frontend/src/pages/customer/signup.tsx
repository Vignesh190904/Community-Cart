'use client';

import { useRouter } from 'next/router';
import { useState, useEffect, useRef, useCallback } from 'react';
import { startSignup } from '../../flows/signup.flow';
import { startGoogleSignup } from '../../flows/google-signup.flow';

export default function SignUp() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const googleInitialized = useRef(false);

    /* ===============================
       MANUAL SIGNUP
       =============================== */
    const handleManualSignup = () => {
        if (!name || !email || !password) {
            setError('All fields are required');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        startSignup(
            { name, email, password },
            {
                // DO NOT navigate to home here
                onNavigate: (path, query) => {
                    router.push({ pathname: path, query });
                    setLoading(false);
                },
                onError: (message) => {
                    setError(message);
                    setLoading(false);
                },
            }
        );
    };

    /* ===============================
       GOOGLE SIGNUP
       =============================== */
    const handleGoogleResponse = useCallback(
        (response: any) => {
            setLoading(true);
            setError('');

            startGoogleSignup(response.credential, {
                // DO NOT navigate to home here
                onNavigate: (path, query) => {
                    router.push({ pathname: path, query });
                    setLoading(false);
                },
                onError: (message) => {
                    setError(message);
                    setLoading(false);
                },
            });
        },
        [router]
    );

    /* ===============================
       GOOGLE INIT
       =============================== */
    const initGoogle = useCallback(() => {
        const container = document.getElementById('google-btn-container-signup');
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

        if (
            !window.google?.accounts?.id ||
            !container ||
            googleInitialized.current
        )
            return;

        window.google.accounts.id.initialize({
            client_id: clientId!,
            callback: handleGoogleResponse,
            ux_mode: 'popup',
        });

        window.google.accounts.id.renderButton(container, {
            theme: 'outline',
            size: 'large',
            width: 320,
        });

        googleInitialized.current = true;
    }, [handleGoogleResponse]);

    useEffect(() => {
        const timer = setTimeout(() => {
            initGoogle();
        }, 100);

        return () => clearTimeout(timer);
    }, [initGoogle]);

    return (
        <div className="signup-page">
            <div className="signup-container">
                <h1 className="signup-title">Sign Up</h1>

                {error && (
                    <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>
                )}

                <div className="signup-input-group">
                    <div className="signup-input-field">
                        <span className="signup-input-label">Name</span>
                        <input
                            type="text"
                            className="signup-input-text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                </div>

                <div className="signup-input-group">
                    <div className="signup-input-field">
                        <span className="signup-input-label">Email</span>
                        <input
                            type="email"
                            className="signup-input-text"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="signup-input-group">
                    <div className="signup-input-field">
                        <span className="signup-input-label">Password</span>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="signup-input-text"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <img
                            src={`/customer/assets/icons/${showPassword ? 'view.svg' : 'hide.svg'
                                }`}
                            alt="toggle password"
                            className="signup-input-icon-right password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                </div>

                <div className="signup-input-group">
                    <div className="signup-input-field">
                        <span className="signup-input-label">Confirm Password</span>
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="signup-input-text"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <img
                            src={`/customer/assets/icons/${showConfirmPassword ? 'view.svg' : 'hide.svg'
                                }`}
                            alt="toggle password"
                            className="signup-input-icon-right password-toggle"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        />
                    </div>
                </div>

                <button
                    className="signup-button"
                    onClick={handleManualSignup}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Sign Up'}
                </button>

                <div className="signin-row">
                    <span className="signin-text">Already have an account? </span>
                    <button
                        type="button"
                        className="signin-link"
                        onClick={() => router.push('/customer/signin')}
                    >
                        Sign In
                    </button>
                </div>

                <div style={{ position: 'relative', width: '100%', marginTop: 8 }}>
                    {/* Your custom styled Google button (uses signup.css classes) */}
                    <button type="button" className="signup-google-button">
                        <img
                            src="/customer/assets/icons/google.svg"
                            alt="google"
                            className="signup-google-icon"
                        />
                        <span className="signup-google-button-text">
                            Continue with Google
                        </span>
                    </button>

                    {/* Invisible official Google button overlay */}
                    <div
                        id="google-btn-container-signup"
                        style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            zIndex: 10,
                        }}
                    />
                </div>
            </div>
        </div>
    );
}
