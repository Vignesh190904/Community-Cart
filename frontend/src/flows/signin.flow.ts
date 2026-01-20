import { FlowCallbacks } from '../types/auth.types';
import { apiPost } from '../utils/api.utils';

/**
 * Manual sign-in flow
 * Authenticates user with email and password
 */
export async function signin(
    email: string,
    password: string,
    callbacks: FlowCallbacks
): Promise<void> {
    // Validate input
    if (!email || !password) {
        callbacks.onError?.('Email and password are required');
        return;
    }

    // Call backend signin endpoint
    const result = await apiPost('/api/auth/customer/signin', {
        email,
        password,
    });

    if (result.error) {
        // Handle specific error codes
        if (result.errorCode === 'ACCOUNT_NOT_FOUND') {
            callbacks.onError?.("Account doesn't exist, please sign up");
            return;
        }

        if (result.errorCode === 'INVALID_CREDENTIALS') {
            callbacks.onError?.('Invalid email or password');
            return;
        }

        if (result.errorCode === 'WRONG_AUTH_METHOD') {
            callbacks.onError?.('Please sign in with Google');
            return;
        }

        if (result.errorCode === 'ACCOUNT_INACTIVE') {
            callbacks.onError?.('Your account is inactive. Please contact support.');
            return;
        }

        // Generic error
        callbacks.onError?.(result.error);
        return;
    }

    // Success! Token and user are now returned
    callbacks.onSuccess?.(result.data?.user, result.data?.auth_token);
}
