import '../styles/globals.css';
import '../styles/customer_global.css';
import '../styles/filters_styling.css';
import '../components/layout/DashboardLayout.css';
import './login.css';
import './admin/dashboard.css';
import './admin/vendors.css';
import './admin/products.css';
import './admin/orders.css';
import './admin/customers.css';
import './admin/vendor-edit.css';
import './vendor/dashboard.css';
import './vendor/products.css';
import './vendor/orders.css';
import './vendor/ordershistory.css';
import './vendor/orderdetails.css';
import './vendor/product-sales.css';
import './vendor/profile.css';
import './customer/products.css';
import './customer/home.css';

import './customer/browse-products.css';
import './customer/cart.css';
import './customer/place-order.css';
import './customer/track-order.css';
import './customer/profile.css';
import './customer/apploading.css';
import './customer/signin.css';
import './customer/signup.css';
import './customer/forgot-password.css';
import './customer/verify-otp.css';
import './customer/reset-password.css';
import './customer/verify-mobile.css';
import './customer/category.css';
import './customer/orders.css';
import './customer/address.css';
import './customer/edit-address.css';
import './customer/favorites.css';
import './customer/bottom-navbar.css';
import './customer/checkout.css';
import './customer/product-detail.css';
import './customer/edit-profile.css';
import '../components/customer/CustomerLayout.css';

import '../styles/toast.css';
import type { ReactElement, ReactNode } from 'react';
import type { NextPage } from 'next';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Script from 'next/script';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ToastProvider } from '../components/ui/ToastProvider';
import { CustomerStoreProvider } from '../context/CustomerStore';
import { AuthProvider } from '../context/AuthContext';

// Extend window interface for Google GIS flag
declare global {
  interface Window {
    __GOOGLE_GIS_LOADED__?: boolean;
    google?: any;
  }
}

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter();

  useEffect(() => {
    // Initial Theme Load
    const savedTheme = localStorage.getItem('cc_theme') || 'light';
    document.body.classList.add(`theme-${savedTheme}`);
  }, []);

  useEffect(() => {
    const selectors = [
      '#__next-build-indicator',
      '#__next-build-watcher',
      '.nextjs-devtools-indicator',
      '.nextjs-devtools-indicator-root',
      '[data-nextjs-dev-indicator]'
    ];

    const removeIndicators = () => {
      selectors.forEach((s) => {
        document.querySelectorAll(s).forEach((el) => el.remove());
      });
    };

    removeIndicators();

    const observer = new MutationObserver(() => removeIndicators());
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  // Global autofill suppression (opt-out on login page)
  const disableAutofill = router.pathname !== '/login';

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const semanticNames = ['email', 'password', 'phone', 'username', 'name'];

    const harden = () => {
      const forms = Array.from(document.querySelectorAll('form')) as HTMLFormElement[];
      const inputs = Array.from(document.querySelectorAll('input')) as HTMLInputElement[];

      if (!disableAutofill) {
        forms.forEach((form) => form.setAttribute('autocomplete', 'on'));
        inputs.forEach((input) => {
          const type = input.getAttribute('type') || '';
          if (type === 'password') {
            input.setAttribute('autocomplete', 'current-password');
            input.removeAttribute('readonly');
          }
        });
        return;
      }

      forms.forEach((form) => form.setAttribute('autocomplete', 'off'));

      inputs.forEach((input, idx) => {
        const type = (input.getAttribute('type') || '').toLowerCase();
        input.setAttribute('autocomplete', 'off');

        if (input.name && semanticNames.includes(input.name)) {
          input.name = `cc_field_${idx}`;
        }

        if (type === 'password') {
          input.setAttribute('autocomplete', 'new-password');
          if (!input.dataset.ccReadOnlyBound) {
            input.readOnly = true;
            input.dataset.ccReadOnlyBound = '1';
            input.addEventListener('focus', function () {
              this.removeAttribute('readonly');
            });
          }
        }
      });
    };

    harden();

    const observer = new MutationObserver(() => harden());
    observer.observe(document.documentElement, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [disableAutofill, router.pathname]);

  // Determine if we should wrap with layout
  const isAdminPage = router.pathname.startsWith('/admin');
  const isVendorPage = router.pathname.startsWith('/vendor');

  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  // Default content is the page itself (possibly wrapped by getLayout)
  let content: ReactNode = getLayout(<Component {...pageProps} />);

  if (isAdminPage) {
    content = (
      <DashboardLayout role="admin">
        <Component {...pageProps} />
      </DashboardLayout>
    );
  } else if (isVendorPage) {
    content = (
      <DashboardLayout role="vendor">
        <Component {...pageProps} />
      </DashboardLayout>
    );
  }

  return (
    <>
      {/* Global Google Identity Services Script - Load Once */}
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        async
        defer
        onLoad={() => {
          if (typeof window !== 'undefined') {
            window.__GOOGLE_GIS_LOADED__ = true;
            // Dispatch custom event for pages to listen
            window.dispatchEvent(new Event('google-gis-loaded'));
          }
        }}
        onError={() => {
          console.error('Failed to load Google Identity Services script');
        }}
      />

      <ToastProvider>
        {/* FIX: AuthProvider must wrap CustomerStoreProvider so the store can access Auth context */}
        <AuthProvider>
          <CustomerStoreProvider>
            {content}
          </CustomerStoreProvider>
        </AuthProvider>
      </ToastProvider>
    </>
  );
}

export default MyApp;