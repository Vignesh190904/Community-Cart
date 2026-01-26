import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import AppLoading from '../pages/customer/apploading';

/**
 * Auth guard hook for protected pages with role enforcement
 * Redirects to signin if user is not authenticated or has wrong role
 * 
 * @param allowedRoles - Array of roles allowed to access this page
 * @param redirectTo - Path to redirect to if not authenticated (default: '/customer/signin')
 * @returns Object with loading state and authentication status
 */
export function useAuthGuard(
    allowedRoles: Array<'customer' | 'vendor' | 'admin'> = ['customer'],
    redirectTo: string = '/customer/signin'
) {
    const router = useRouter();
    const { is_authenticated, loading, role, sign_out } = useAuth();

    useEffect(() => {
        // Wait for auth to finish loading
        if (loading) return;

        // Not authenticated - redirect to login
        if (!is_authenticated) {
            router.replace(redirectTo);
            return;
        }

        // Role mismatch - force logout and redirect
        if (role && !allowedRoles.includes(role)) {
            console.warn(`Role mismatch: ${role} not in [${allowedRoles.join(', ')}]`);
            sign_out();
            return;
        }
    }, [is_authenticated, loading, role, router, redirectTo, allowedRoles, sign_out]);

    return {
        isLoading: loading,
        isAuthenticated: is_authenticated && role && allowedRoles.includes(role)
    };
}

/**
 * Higher-order component to protect pages with role enforcement
 * Wraps a page component with authentication and role check
 * 
 * @param Component - Page component to protect
 * @param allowedRoles - Array of roles allowed to access this page
 * @param redirectTo - Path to redirect to if not authenticated
 * @returns Protected component
 */
export function withAuthGuard<P extends object>(
    Component: React.ComponentType<P>,
    allowedRoles: Array<'customer' | 'vendor' | 'admin'> = ['customer'],
    redirectTo: string = '/customer/signin'
) {
    return function ProtectedPage(props: P) {
        const { isLoading, isAuthenticated } = useAuthGuard(allowedRoles, redirectTo);

        // Show loading state while checking session
        if (isLoading) {
            return <AppLoading />;
        }

        // Only render component if authenticated with correct role
        if (!isAuthenticated) {
            return null;
        }

        return <Component {...props} />;
    };
}
