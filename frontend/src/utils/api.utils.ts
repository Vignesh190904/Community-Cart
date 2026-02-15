import { ApiResponse } from '../types/auth.types';
import { API_BASE } from '../config/env';

const API_PREFIX = '/api';
export const API_BASE_URL = `${API_BASE}${API_PREFIX}`;

/**
 * ═══════════════════════════════════════════════════════════════════════
 * API CONTRACT - DO NOT MODIFY WITHOUT REVIEW
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * CENTRALIZED API GATEWAY: All authenticated API calls MUST go through this file
 * - Use apiCall, apiGet, apiPost, apiPatch, apiPut, apiDelete
 * - NO direct fetch() calls in components/pages for authenticated requests
 * 
 * DEMO MODE: No auto-logout or redirects on errors
 * 
 * TOKEN ATTACHMENT: Automatic from localStorage
 * - Reads 'auth_token' from localStorage
 * - Attaches as 'Authorization: Bearer <token>' header
 * - Only this file and AuthContext may read auth_token
 * 
 * ═══════════════════════════════════════════════════════════════════════
 */
export async function apiCall<T = any>(
    endpoint: string,
    options: RequestInit = {}
): Promise<{ data?: ApiResponse<T>; error?: string; errorCode?: string }> {
    // Safety check for duplicate prefix
    if (endpoint.startsWith('/api/')) {
        throw new Error(`[API] Invalid endpoint '${endpoint}'. Do not include '/api' prefix, it is added automatically.`);
    }

    try {
        // JWT Authentication: Attached from localStorage
        const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
        const authHeader = token ? { 'Authorization': `Bearer ${token}` } : {};

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
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

/**
 * PATCH request helper
 */
export async function apiPatch<T = any>(
    endpoint: string,
    body: any
): Promise<{ data?: ApiResponse<T>; error?: string; errorCode?: string }> {
    return apiCall<T>(endpoint, {
        method: 'PATCH',
        body: JSON.stringify(body),
    });
}

/**
 * PUT request helper
 */
export async function apiPut<T = any>(
    endpoint: string,
    body: any
): Promise<{ data?: ApiResponse<T>; error?: string; errorCode?: string }> {
    return apiCall<T>(endpoint, {
        method: 'PUT',
        body: JSON.stringify(body),
    });
}

/**
 * DELETE request helper
 */
export async function apiDelete<T = any>(
    endpoint: string
): Promise<{ data?: ApiResponse<T>; error?: string; errorCode?: string }> {
    return apiCall<T>(endpoint, {
        method: 'DELETE',
    });
}
