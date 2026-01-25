/**
 * Role-aware redirect resolver
 * Pure function with no side effects
 */

export type UserRole = 'customer' | 'vendor' | 'admin';

/**
 * Get the correct login/signin page based on user role
 * @param role - User role (optional)
 * @returns Redirect path
 */
export function getLoginRedirectPath(role?: UserRole | string | null): string {
    if (role === 'admin' || role === 'vendor') {
        return '/login';
    }
    // vendor, admin, or unknown → /login
    return '/customer/signin';
}
