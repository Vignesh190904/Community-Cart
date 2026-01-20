import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { checkSession } from './session.manager';

/**
 * Auth guard hook for protected pages
 * Redirects to signin if user is not authenticated
 * 
 * @param redirectTo - Path to redirect to if not authenticated (default: '/customer/signin')
 * @returns Object with loading state and authentication status
 */
export function useAuthGuard(redirectTo: string = '/customer/signin') {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const verifySession = async () => {
            try {
                const { isAuthenticated } = await checkSession();

                if (!isAuthenticated) {
                    // Not authenticated - redirect to signin
                    router.replace(redirectTo);
                } else {
                    setIsAuthenticated(true);
                }
            } catch (error) {
                console.error('Auth guard error:', error);
                router.replace(redirectTo);
            } finally {
                setIsLoading(false);
            }
        };

        verifySession();
    }, [router, redirectTo]);

    return { isLoading, isAuthenticated };
}

/**
 * Higher-order component to protect pages
 * Wraps a page component with authentication check
 * 
 * @param Component - Page component to protect
 * @param redirectTo - Path to redirect to if not authenticated
 * @returns Protected component
 */
export function withAuthGuard<P extends object>(
    Component: React.ComponentType<P>,
    redirectTo: string = '/customer/signin'
) {
    return function ProtectedPage(props: P) {
        const { isLoading, isAuthenticated } = useAuthGuard(redirectTo);

        // Show loading state while checking session
        if (isLoading) {
            return (
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100vh'
                }}>
                    <p>Loading...</p>
                </div>
            );
        }

        // Only render component if authenticated
        if (!isAuthenticated) {
            return null;
        }

        return <Component {...props} />;
    };
}
