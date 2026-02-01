import { useRouter } from 'next/router';
import { ReactNode, useEffect, useState } from 'react';

interface RightAction {
  label?: string;
  icon?: ReactNode;
  onClick: () => void;
}

interface TopNavbarProps {
  title: string;
  showBack?: boolean;
  onBack?: () => void;
  rightAction?: RightAction | null;
}

// Hardcoded back navigation mapping (demo-grade)
const getBackDestination = (pathname: string, query: Record<string, string | string[] | undefined>): string | null => {
  const fromParam = query.from as string | undefined;

  switch (pathname) {
    case '/customer/profile':
      return '/customer/home';
    case '/customer/browse-products':
      return '/customer/home';
    case '/customer/category':
      // If accessed from browse-products, go back there; otherwise home
      return fromParam === 'browse' ? '/customer/browse-products' : '/customer/home';
    case '/customer/favorites':
      return '/customer/home';
    case '/customer/cart':
      return '/customer/home';
    case '/customer/checkout':
      return '/customer/cart';
    case '/customer/orders':
      return '/customer/home';
    case '/customer/address':
      return '/customer/profile';
    case '/customer/edit-address':
      return '/customer/profile';
    case '/customer/edit-profile':
      return '/customer/profile';
    default:
      // For product detail and other pages, use router.back()
      return null;
  }
};

export default function TopNavbar({
  title,
  showBack = true,
  onBack,
  rightAction = null,
}: TopNavbarProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleBack = () => {
    if (onBack) {
      onBack();
      return;
    }

    const destination = getBackDestination(router.pathname, router.query);
    if (destination) {
      router.push(destination);
    } else {
      router.back();
    }
  };

  return (
    <header className={`top-navbar ${mounted ? 'top-navbar--visible' : ''}`}>
      <div className="top-navbar__left">
        {showBack && (
          <button
            className="top-navbar__back-btn"
            onClick={handleBack}
            aria-label="Go back"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>

      <h1 className="top-navbar__title">{title}</h1>

      <div className="top-navbar__right">
        {rightAction && (
          <button
            className="top-navbar__action-btn"
            onClick={rightAction.onClick}
            aria-label={rightAction.label || 'Action'}
          >
            {rightAction.icon ? (
              rightAction.icon
            ) : rightAction.label ? (
              <span className="top-navbar__action-label">{rightAction.label}</span>
            ) : null}
          </button>
        )}
      </div>
    </header>
  );
}
