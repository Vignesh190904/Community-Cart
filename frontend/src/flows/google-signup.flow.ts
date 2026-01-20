import { FlowCallbacks } from '../types/auth.types';
import { apiPost } from '../utils/api.utils';

// Session storage keys
const STORAGE_KEY_GOOGLE_TOKEN = 'cc_google_token';
const STORAGE_KEY_GOOGLE_SIGNUP = 'cc_google_signup_temp';

/**
 * Step 1: Start Google signup
 * Verifies Google token and sends email OTP
 */
export async function startGoogleSignup(
    googleToken: string,
    callbacks: FlowCallbacks
): Promise<void> {
    if (!googleToken) {
        callbacks.onError?.('Google authentication failed. Please try again.');
        return;
    }

    // Call backend
    const result = await apiPost('/api/auth/customer/google/signup/start', {
        googleToken,
    });

    if (result.error) {
        // Handle specific error codes
        if (result.errorCode === 'ACCOUNT_ALREADY_EXISTS') {
            callbacks.onError?.('Account already exists. Please sign in.');
            return;
        }

        if (result.errorCode === 'GOOGLE_AUTH_FAILED') {
            callbacks.onError?.('Google authentication failed. Please try again.');
            return;
        }

        callbacks.onError?.(result.error);
        return;
    }

    // Store Google token temporarily
    sessionStorage.setItem(STORAGE_KEY_GOOGLE_TOKEN, googleToken);

    // Store email if returned by backend
    if (result.data?.data?.email) {
        sessionStorage.setItem(
            STORAGE_KEY_GOOGLE_SIGNUP,
            JSON.stringify({ email: result.data.data.email })
        );
    }

    // Navigate to email OTP verification
    const email = result.data?.data?.email || '';
    callbacks.onNavigate?.('/customer/verify-otp', { email, intent: 'google_signup' });
}

/**
 * Step 2: Verify email OTP and complete signup
 * User is created and authenticated immediately
 */
export async function verifyGoogleEmailOtp(
    email: string,
    otp: string,
    callbacks: FlowCallbacks
): Promise<void> {
    if (!email || !otp) {
        callbacks.onError?.('Email and OTP are required');
        return;
    }

    const result = await apiPost('/api/auth/customer/google/signup/verify-email', {
        email,
        otp,
    });

    if (result.error) {
        if (result.errorCode === 'INVALID_OTP') {
            callbacks.onError?.('Invalid or expired OTP. Please try again.');
            return;
        }
        if (result.errorCode === 'SESSION_EXPIRED') {
            callbacks.onError?.('Signup session expired. Please start again.');
            clearGoogleSignupData();
            return;
        }
        callbacks.onError?.(result.error);
        return;
    }

    // Clear temporary storage
    clearGoogleSignupData();

    // Store auth token
    if (result.data?.auth_token) {
        localStorage.setItem('auth_token', result.data.auth_token);
    }
    if (result.data?.user) {
        localStorage.setItem('auth_user', JSON.stringify(result.data.user));
    }

    // Success! Navigate to home
    callbacks.onNavigate?.('/customer/home');
}

/**
 * Helper: Resend email OTP
 */
export async function resendGoogleEmailOtp(
    email: string,
    callbacks: FlowCallbacks
): Promise<void> {
    if (!email) {
        callbacks.onError?.('Email is required');
        return;
    }

    const result = await apiPost('/api/auth/customer/signup/resend-otp', {
        email,
    });

    if (result.error) {
        callbacks.onError?.(result.error);
        return;
    }

    callbacks.onSuccess?.();
}

/**
 * Helper: Get stored Google signup data
 */
export function getGoogleSignupData(): { email?: string } | null {
    const data = sessionStorage.getItem(STORAGE_KEY_GOOGLE_SIGNUP);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/**
 * Helper: Get stored Google token
 */
export function getGoogleToken(): string | null {
    return sessionStorage.getItem(STORAGE_KEY_GOOGLE_TOKEN);
}

/**
 * Helper: Clear Google signup data
 */
export function clearGoogleSignupData(): void {
    sessionStorage.removeItem(STORAGE_KEY_GOOGLE_TOKEN);
    sessionStorage.removeItem(STORAGE_KEY_GOOGLE_SIGNUP);
}
