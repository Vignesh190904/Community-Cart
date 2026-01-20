import { FlowCallbacks, ManualSignupData } from '../types/auth.types';
import { apiPost } from '../utils/api.utils';

// Session storage keys
const STORAGE_KEY_SIGNUP = 'cc_signup_temp';

/**
 * Step 1: Start manual signup
 * Creates temporary signup record and sends email OTP
 */
export async function startSignup(
    data: ManualSignupData,
    callbacks: FlowCallbacks
): Promise<void> {
    const { name, email, password } = data;

    // Validate input
    if (!name || !email || !password) {
        callbacks.onError?.('All fields are required');
        return;
    }

    // Call backend
    const result = await apiPost('/api/auth/customer/signup/start', {
        name,
        email,
        password,
    });

    if (result.error) {
        // Handle specific error codes
        if (result.errorCode === 'EMAIL_EXISTS') {
            callbacks.onError?.('Email already registered. Please sign in.');
            return;
        }
        callbacks.onError?.(result.error);
        return;
    }

    // Store signup data temporarily
    sessionStorage.setItem(STORAGE_KEY_SIGNUP, JSON.stringify({ name, email, password }));

    // Navigate to email OTP verification
    callbacks.onNavigate?.('/customer/verify-otp', { email, intent: 'manual_signup' });
}

/**
 * Step 2: Verify email OTP and complete signup
 * User is created and authenticated immediately
 */
export async function verifyEmailOtp(
    email: string,
    otp: string,
    callbacks: FlowCallbacks
): Promise<void> {
    if (!email || !otp) {
        callbacks.onError?.('Email and OTP are required');
        return;
    }

    const result = await apiPost('/api/auth/customer/signup/verify-email', {
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
            // Clear storage
            sessionStorage.removeItem(STORAGE_KEY_SIGNUP);
            return;
        }
        callbacks.onError?.(result.error);
        return;
    }

    // Clear temporary storage
    sessionStorage.removeItem(STORAGE_KEY_SIGNUP);

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
export async function resendEmailOtp(
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
 * Helper: Get stored signup data
 */
export function getSignupData(): ManualSignupData | null {
    const data = sessionStorage.getItem(STORAGE_KEY_SIGNUP);
    if (!data) return null;
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/**
 * Helper: Clear signup data
 */
export function clearSignupData(): void {
    sessionStorage.removeItem(STORAGE_KEY_SIGNUP);
}
