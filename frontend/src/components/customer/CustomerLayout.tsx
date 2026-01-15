import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const navLinks = [
  { href: '/customer/dashboard', label: 'Dashboard' },
  { href: '/customer/browse-products', label: 'Browse Products' },
  { href: '/customer/cart', label: 'Cart' },
  { href: '/customer/cart-pro', label: 'Cart-Pro' },
  { href: '/customer/track-order', label: 'Track Orders' },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Load theme preference
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
    <div className="customer-shell">
      <header className="customer-topbar">
        <div className="customer-brand">Customer Test Console</div>
        <nav className="customer-nav">
          {navLinks.map((link) => {
            const active = router.pathname === link.href;
            return (
              <Link key={link.href} href={link.href} className={`customer-nav-link ${active ? 'active' : ''}`}>
                {link.label}
              </Link>
            );
          })}
          <button
            className="customer-theme-toggle"
            onClick={toggleTheme}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label="Toggle theme"
          >
            {isDark ? '☀️' : '🌙'}
          </button>
        </nav>
      </header>
      <main className="customer-main">{children}</main>
    </div>
  );
}
