import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useAuth } from '../../context/AuthContext';

export default function ProfilePage() {
    const router = useRouter();

    // Using precise snake_case names from updated context
    const { sign_out, update_theme, user, is_authenticated, loading } = useAuth();

    const [is_dark, set_is_dark] = useState(false);
    const [profile_image, set_profile_image] = useState('/customer/assets/images/profile_3.jpg');
    const [image_error, set_image_error] = useState(false);

    const handle_image_error = () => {
        set_image_error(true);
        set_profile_image('/customer/assets/icons/profile.svg');
    };

    useEffect(() => {
        // Theme initialization based on the current body class or storage
        if (typeof window !== 'undefined') {
            const is_dark_mode = document.body.classList.contains('theme-dark') ||
                localStorage.getItem('cc_theme') === 'dark';
            set_is_dark(is_dark_mode);
        }
    }, []);

    const toggle_theme = () => {
        const new_theme = is_dark ? 'light' : 'dark';
        if (update_theme) {
            update_theme(new_theme);
        }
        set_is_dark(!is_dark);
    };

    const handle_logout = async () => {
        if (sign_out) {
            await sign_out();
        }
    };

    const MENU_ITEMS = [
        { label: 'Order History', icon: '/customer/assets/icons/history.svg', action: () => router.push('/customer/orders') },
        { label: 'My Address', icon: '/customer/assets/icons/location.svg', action: () => router.push('/customer/address') },
        { label: 'My Favorite', icon: '/customer/assets/icons/favorite.svg', action: () => router.push('/customer/favorites') },
        { label: 'Sign out', icon: '/customer/assets/icons/logout.svg', action: handle_logout },
    ];

    // CustomerLayout handles the redirect and loading state. 
    // We return null here if not ready to prevent double-renders or data leaks.
    if (loading || !is_authenticated) return null;

    return (
        <CustomerLayout disablePadding={true} fullWidth={true}>
            <div className="profile-page-container">
                {/* Green Header Background */}
                <div className="profile-header-bg">
                    <h1 className="header-title">My Profile</h1>
                    <button className="theme-toggle-mini" onClick={toggle_theme} aria-label="Toggle Theme">
                        <img
                            src={is_dark ? '/customer/assets/icons/dark.svg' : '/customer/assets/icons/light.svg'}
                            alt={is_dark ? "Dark Mode" : "Light Mode"}
                            className="theme-icon"
                        />
                    </button>
                </div>

                {/* Overlapping Profile Card */}
                <div className="profile-card">
                    <div className="profile-info-row">
                        <div className="profile-avatar-container">
                            <img
                                src={profile_image}
                                alt="Profile"
                                className="profile-avatar-img"
                                onError={handle_image_error}
                            />
                        </div>
                        <div className="profile-text-content">
                            <h2 className="profile-name">{user?.name || 'User'}</h2>
                            <p className="profile-email">{user?.email || 'email@example.com'}</p>
                        </div>
                        <button className="edit-profile-btn touchable" onClick={() => router.push('/customer/edit-profile')}>
                            <img src="/customer/assets/icons/edit.svg" alt="Edit" width={20} height={20} />
                        </button>
                    </div>
                </div>

                {/* List Section */}
                <div className="profile-menu-list">
                    {MENU_ITEMS.map((item, index) => (
                        <div key={index} className="menu-item touchable" onClick={item.action}>
                            <div className="menu-item-left">
                                <img src={item.icon} alt={item.label} className="menu-icon" />
                                <span className="menu-label">{item.label}</span>
                            </div>
                            <div className="menu-chevron">
                                ›
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}