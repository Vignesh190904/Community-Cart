import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import BottomNavbar from '../../pages/customer/BottomNavbar';
import { useAuth } from '../../context/AuthContext';

export default function CustomerLayout({
  children,
  disablePadding = false,
  fullWidth = false
}: {
  children: React.ReactNode;
  disablePadding?: boolean;
  fullWidth?: boolean
}) {
  const router = useRouter();
  const { is_authenticated, loading } = useAuth();
  const [isDark, setIsDark] = useState<boolean>(false);

  // 1. THEME LOGIC
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const theme = localStorage.getItem('cc_theme');
      const prefersDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(prefersDark);
      if (prefersDark) {
        document.body.classList.add('theme-dark');
      } else {
        document.body.classList.remove('theme-dark');
      }
    }
  }, []);

  // 2. THEME TOGGLE EXPORT
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).toggleCustomerTheme = () => {
        const newTheme = !isDark;
        setIsDark(newTheme);
        if (newTheme) {
          document.body.classList.add('theme-dark');
          localStorage.setItem('cc_theme', 'dark');
        } else {
          document.body.classList.remove('theme-dark');
          localStorage.setItem('cc_theme', 'light');
        }
      };
    }
  }, [isDark]);

  // 3. GLOBAL AUTHENTICATION GUARD
  useEffect(() => {
    // Prevent auto-logout/redirect loop by waiting for AuthContext to finish loading
    if (!loading) {
      if (!is_authenticated) {
        // No valid session found after revalidation
        router.replace('/customer/signin');
      }
      // Onboarding redirect logic removed - users navigate directly to Home after signup
    }
  }, [is_authenticated, loading, router]);

  // 4. LOADING STATE
  // Show a clean loading screen while AuthContext verifies the token/cookie
  if (loading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: isDark ? '#121212' : '#ffffff',
        color: isDark ? '#ffffff' : '#000000',
        fontFamily: 'sans-serif'
      }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontWeight: '500', fontSize: '16px' }}>Securely loading session...</p>
        </div>
      </div>
    );
  }

  // 5. RENDER PROTECTION
  // If not authenticated and finished loading, render nothing while redirecting
  if (!is_authenticated) {
    return null;
  }

  return (
    <div className={`customer-shell ${fullWidth ? 'full-width' : ''}`}>
      <main className={`customer-main ${disablePadding ? 'no-padding' : ''} page-transition`}>
        {children}
      </main>
      <BottomNavbar />
    </div>
  );
}