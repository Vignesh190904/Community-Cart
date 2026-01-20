import { useRouter } from 'next/router';
import Link from 'next/link';

const NAV_ITEMS = [
    { href: '/customer/home', label: 'Home', icon: '/customer/assets/icons/home.svg' },
    { href: '/customer/browse-products', label: 'Search', icon: '/customer/assets/icons/search.svg' },
    { href: '/customer/cart', label: 'Cart', icon: '/customer/assets/icons/cart.svg' },
    { href: '/customer/orders', label: 'Orders', icon: '/customer/assets/icons/order.svg' },
    { href: '/customer/profile', label: 'Profile', icon: '/customer/assets/icons/profile.svg' },
];

export default function BottomNavbar() {
    const router = useRouter();

    return (
        <nav className="customer-bottom-nav">
            {NAV_ITEMS.map((item) => {
                // Precise active check: 
                // Home only matches exactly, others match by prefix to handle sub-routes
                const is_active = item.href === '/customer/home'
                    ? router.pathname === item.href
                    : router.pathname.startsWith(item.href);

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`bottom-nav-item ${is_active ? 'active' : ''}`}
                    >
                        <img
                            src={item.icon}
                            alt={item.label}
                            className="nav-icon-img"
                        />
                    </Link>
                );
            })}
        </nav>
    );
}