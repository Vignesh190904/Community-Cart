/**
 * Vendor Authentication Utilities
 * Provides consistent token management for vendor pages
 */

const VENDOR_TOKEN_KEY = 'vendor_auth_token';
const VENDOR_USER_KEY = 'vendor_auth_user';
const VENDOR_ID_KEY = 'cc_vendorId';

/**
 * Get vendor JWT token from localStorage
 * @returns {string | null} The vendor auth token or null if not found
 */
export const getVendorToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
};

/**
 * Get vendor user data from localStorage
 * @returns {any | null} The vendor user object or null if not found
 */
export const getVendorUser = (): any | null => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem(VENDOR_USER_KEY);
    if (!stored) return null;
    try {
        return JSON.parse(stored);
    } catch {
        return null;
    }
};

/**
 * Get vendor ID from localStorage
 * @returns {string | null} The vendor ID or null if not found
 */
export const getVendorId = (): string | null => {
    if (typeof window === 'undefined') return null;
    try {
        const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
        return user.id || null;
    } catch {
        return null;
    }
};

/**
 * Check if vendor is authenticated
 * @returns {boolean} True if vendor has a valid token
 */
export const isVendorAuthenticated = (): boolean => {
    return !!getVendorToken();
};

/**
 * Clear vendor authentication data
 */
export const clearVendorAuth = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(VENDOR_TOKEN_KEY);
    localStorage.removeItem(VENDOR_USER_KEY);
    localStorage.removeItem(VENDOR_ID_KEY);
    localStorage.removeItem('vendorId');
};

/**
 * Create Authorization header for vendor API calls
 * @returns {Record<string, string>} Headers object with Authorization
 */
export const getVendorAuthHeaders = (): Record<string, string> => {
    const token = getVendorToken();
    if (!token) return {};
    return {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
    };
};
