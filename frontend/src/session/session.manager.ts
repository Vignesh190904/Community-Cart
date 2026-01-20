import { apiGet, apiPost } from '../utils/api.utils';
import { UserData } from '../types/auth.types';

/**
 * Check if user has an active session
 * @returns Promise<boolean> - true if session is valid, false otherwise
 */
export async function checkSession(): Promise<{ isAuthenticated: boolean; user?: UserData }> {
    const result = await apiGet('/api/auth/customer/me');

    if (result.error || !result.data?.success) {
        return { isAuthenticated: false };
    }

    return {
        isAuthenticated: true,
        user: result.data.user,
    };
}

/**
 * Logout user and clear session
 * @returns Promise<void>
 */
export async function logout(): Promise<{ success: boolean; error?: string }> {
    const result = await apiPost('/api/auth/customer/logout', {});

    if (result.error) {
        return {
            success: false,
            error: result.error,
        };
    }

    return { success: true };
}

/**
 * Get current user data from session
 * @returns Promise<UserData | null>
 */
export async function getCurrentUser(): Promise<UserData | null> {
    const { isAuthenticated, user } = await checkSession();
    return isAuthenticated ? user || null : null;
}
