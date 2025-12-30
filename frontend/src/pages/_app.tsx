import '../styles/globals.css';
import '../components/layout/DashboardLayout.css';
import './admin/dashboard.css';
import './admin/vendors.css';
import './admin/inventory.css';
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
import './customer/dashboard.css';
import './customer/browse-products.css';
import './customer/cart.css';
import './customer/place-order.css';
import './customer/track-order.css';
import '../components/customer/CustomerLayout.css';
import '../styles/toast.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '../components/layout/DashboardLayout';
import { ToastProvider } from '../components/ui/ToastProvider';
import { CustomerStoreProvider } from '../context/CustomerStore';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

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

  let content: JSX.Element = <Component {...pageProps} />;

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
    <ToastProvider>
      <CustomerStoreProvider>{content}</CustomerStoreProvider>
    </ToastProvider>
  );
}

export default MyApp;
