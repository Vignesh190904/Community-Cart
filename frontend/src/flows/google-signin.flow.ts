import { FlowCallbacks } from '../types/auth.types';
import { apiPost } from '../utils/api.utils';

/**
 * Google sign-in flow
 * Authenticates user with Google OAuth token
 */
export async function googleSignin(
    googleToken: string,
    callbacks: FlowCallbacks
): Promise<void> {
    // Validate input
    if (!googleToken) {
        callbacks.onError?.('Google authentication failed. Please try again.');
        return;
    }

    // Call backend Google signin endpoint
    const result = await apiPost('/api/auth/customer/google/signin', {
        googleToken,
    });

    if (result.error) {
        // Handle specific error codes
        if (result.errorCode === 'ACCOUNT_NOT_FOUND') {
            callbacks.onError?.("Account doesn't exist, please sign up");
            return;
        }

        if (result.errorCode === 'WRONG_AUTH_METHOD') {
            callbacks.onError?.('Please sign in with email and password');
            return;
        }

        if (result.errorCode === 'GOOGLE_AUTH_FAILED') {
            callbacks.onError?.('Google authentication failed. Please try again.');
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
