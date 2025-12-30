import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { api, setAuthToken } from '../../services/api';

type Role = 'admin' | 'vendor';

interface DashboardLayoutProps {
  role: Role;
  children: React.ReactNode;
}

const itemsByRole: Record<Role, Array<{ label: string; href: string }>> = {
  admin: [
    { label: 'Dashboard Overview', href: '/admin/dashboard' },
    { label: 'Vendors', href: '/admin/vendors' },
    { label: 'Products', href: '/admin/inventory' },
    { label: 'Orders', href: '/admin/orders' },
    { label: 'Reports', href: '/admin/reports' },
    { label: 'Customers', href: '/admin/customers' },
    { label: 'Platform Settings', href: '/admin/settings' },
  ],
  vendor: [
    { label: 'Dashboard Overview', href: '/vendor/dashboard' },
    { label: 'Products', href: '/vendor/products' },
    { label: 'Orders Live', href: '/vendor/orders' },
    { label: 'Order History', href: '/vendor/ordershistory' },
    { label: 'Product Sales', href: '/vendor/product-sales' },
    { label: 'Earnings', href: '/vendor/earnings' },
    { label: 'Inventory', href: '/vendor/inventory' },
  ],
};

export default function DashboardLayout({ role, children }: DashboardLayoutProps) {
  const router = useRouter();
  const items = itemsByRole[role];
  const [userName, setUserName] = useState<string>('');
  const [userEmail, setUserEmail] = useState<string>('');
  const [isDark, setIsDark] = useState<boolean>(false);
  const [avatarUrl, setAvatarUrl] = useState<string>('');

  useEffect(() => {
    // Read from localStorage if available (set during login)
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('cc_user');
        if (stored) {
          const parsed = JSON.parse(stored);
          if (parsed?.name) setUserName(parsed.name);
          if (parsed?.email) setUserEmail(parsed.email);
        }
      } catch {}

      // Load theme preference
      const theme = localStorage.getItem('cc_theme');
      const prefersDark = theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches);
      setIsDark(prefersDark);
      if (prefersDark) {
        document.body.classList.add('theme-dark');
      } else {
        document.body.classList.remove('theme-dark');
      }
      // Load vendor avatar if role is vendor
      try {
        if (role === 'vendor') {
          const token = localStorage.getItem('cc_token');
          const vendorId = localStorage.getItem('cc_vendorId');
          if (token && vendorId) {
            setAuthToken(token);
            api.vendors.getById(vendorId).then((data: any) => {
              const url = data?.media?.logoUrl || '';
              if (url) setAvatarUrl(url);
            }).catch(() => {});
          }
        }
      } catch {}
    }
  }, []);

  const toggleTheme = () => {
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

  return (
    <div className="dash-layout">
      <aside className="dash-sidebar">
        <div className="dash-brand">Community Cart</div>
        <nav className="dash-nav">
          <ul className="dash-nav-list">
            {items.map((item) => {
              // Exact match for most routes; keep /vendor/orders distinct from /vendor/ordershistory
              let active = router.pathname === item.href;
              if (item.href === '/vendor/orders' && router.pathname.startsWith('/vendor/orders/')) {
                active = false; // Keep history route from marking live orders as active
              }
              return (
                <li key={item.href} className={`dash-nav-item ${active ? 'active' : ''}`}>
                  <Link href={item.href} className="dash-nav-link">
                    <span className="dash-icon" aria-hidden>▣</span>
                    <span className="dash-label">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="dash-sidebar-bottom">
          <Link href="/vendor/profile" className="dash-profile" title="View Profile">
            <div className="dash-profile-avatar" aria-hidden>
              {avatarUrl ? (
                <img src={avatarUrl} alt="Profile" />
              ) : (
                (userName || 'U').trim().charAt(0).toUpperCase()
              )}
            </div>
            <div className="dash-profile-text">
              <div className="dash-profile-name">{userName || 'User'}</div>
              <div className="dash-profile-email">{userEmail || '—'}</div>
            </div>
          </Link>
          <button
            className="dash-theme-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? 'Light' : 'Dark'}
          </button>
          <button
            className="dash-logout-btn"
            onClick={() => {
              if (typeof window !== 'undefined') {
                localStorage.removeItem('cc_token');
                localStorage.removeItem('cc_user');
              }
              router.replace('/login');
            }}
          >
            Logout
          </button>
        </div>
      </aside>
      <main className="dash-main" role="main">
        {children}
      </main>
    </div>
  );
}
