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
    if (role === 'customer') {
        return '/customer/signin';
    }
    // vendor, admin, or unknown → /login
    return '/login';
}
