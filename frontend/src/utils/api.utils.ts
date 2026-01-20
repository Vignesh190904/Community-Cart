import { ApiResponse } from '../types/auth.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

/**
 * Generic API call helper with session-based authentication
 * @param endpoint - API endpoint (e.g., '/api/auth/customer/signin')
 * @param options - Fetch options
 * @returns Object with data or error
 */
export async function apiCall<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ data?: ApiResponse<T>; error?: string; errorCode?: string }> {
    try {
        // JWT Authentication: Attached from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            // credentials: 'include', // REMOVED: Using JWT
            headers: {
                'Content-Type': 'application/json',
                ...authHeader,
                ...options.headers,
            },
        });

        const data: ApiResponse<T> = await response.json();

        if (!response.ok) {
            return {
                error: data.message || 'Request failed',
                errorCode: data.error_code,
            };
        }

        return { data };
    } catch (error) {
        return {
            error: error instanceof Error ? error.message : 'Network error',
            errorCode: 'NETWORK_ERROR',
        };
    }
}

/**
 * POST request helper
 */
export async function apiPost<T = any>(
    endpoint: string,
    body: any
): Promise<{ data?: ApiResponse<T>; error?: string; errorCode?: string }> {
    return apiCall<T>(endpoint, {
        method: 'POST',
        body: JSON.stringify(body),
    });
}

/**
 * GET request helper
 */
export async function apiGet<T = any>(
    endpoint: string
): Promise<{ data?: ApiResponse<T>; error?: string; errorCode?: string }> {
    return apiCall<T>(endpoint, {
        method: 'GET',
    });
}
