'use client';

import { useRouter } from 'next/router';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { signin } from '../../flows/signin.flow';
import { googleSignin } from '../../flows/google-signin.flow';

export default function SignIn() {
    const router = useRouter();
    const { sign_in, is_authenticated, loading: auth_loading } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const googleInitialized = useRef(false);

    const handleManualSignin = () => {
        setLoading(true);
        setError('');

        signin(email, password, {
            onSuccess: (user, token) => {
                sign_in(user, token);
                router.push('/customer/home');
            },
            onError: (message) => {
                setError(message);
                setLoading(false);
            },
        });
    };

    const handleGoogleResponse = useCallback(
        (response: any) => {
            setLoading(true);
            setError('');

            googleSignin(response.credential, {
                onSuccess: (user, token) => {
                    sign_in(user, token);
                    router.push('/customer/home');
                },
                onError: (message) => {
                    setError(message);
                    setLoading(false);
                },
            });
        },
        [router, sign_in]
    );

    const initGoogle = useCallback(() => {
        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const container = document.getElementById('google-btn-container');

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
        if (typeof window !== 'undefined' && window.__GOOGLE_GIS_LOADED__) {
            initGoogle();
        }

        const listener = () => initGoogle();
        window.addEventListener('google-gis-loaded', listener);
        return () => window.removeEventListener('google-gis-loaded', listener);
    }, [initGoogle]);

    return (
        <div className="signin-page">
            <div className="signin-container">
                <h1 className="signin-title">Sign In</h1>

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <div className="input-group">
                    <span className="input-label">Email Address</span>
                    <div className="input-field">
                        <input
                            type="email"
                            className="input-text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Email"
                        />
                    </div>
                </div>

                <div className="input-group">
                    <span className="input-label">Password</span>
                    <div className="input-field">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            className="input-text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Password"
                        />
                        <img
                            src={`/customer/assets/icons/${showPassword ? 'view.svg' : 'hide.svg'}`}
                            alt="toggle password"
                            className="input-icon-right password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        />
                    </div>
                </div>

                <div className="forgot-password-row">
                    <button type="button" className="forgot-password-link">
                        Forgot Password?
                    </button>
                </div>

                <button
                    className="signin-button"
                    onClick={handleManualSignin}
                    disabled={loading}
                >
                    {loading ? 'Signing In...' : 'Sign In'}
                </button>

                <div className="signup-row">
                    <span className="signup-text">Don't have an account? </span>
                    <button
                        type="button"
                        className="signup-link"
                        onClick={() => router.push('/customer/signup')}
                    >
                        Sign Up
                    </button>
                </div>

                <div style={{ position: 'relative', width: '100%' }}>
                    {/* Your custom styled Google button */}
                    <button type="button" className="google-button">
                        <img
                            src="/customer/assets/icons/google.svg"
                            alt="google"
                            className="google-icon"
                        />
                        <span className="google-button-text">
                            Continue with Google
                        </span>
                    </button>

                    {/* Invisible official Google button overlay */}
                    <div
                        id="google-btn-container"
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
