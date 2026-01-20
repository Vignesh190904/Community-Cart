'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useToast } from '../../components/ui/ToastProvider';
import { useAuth } from '../../context/AuthContext';

export default function EditProfilePage() {
    const router = useRouter();
    const { pushToast } = useToast();
    const { user, token, loading, is_authenticated } = useAuth();

    // Local state for form fields - initialize with safe defaults
    const [name, set_name] = useState('');
    const [email, set_email] = useState('');
    const [phone, set_phone] = useState('');

    // Initialize state when user data is available
    useEffect(() => {
        if (user) {
            set_name(user.name ?? '');
            set_email(user.email ?? '');
            // Use optional chaining for phone (may not exist on user object)
            set_phone(user.phone ?? '');
        }
    }, [user]);

    // Derived states for changes (email is read-only, so exclude it)
    // Use optional chaining to safely access user properties
    const is_name_changed = user ? name !== (user.name ?? '') : false;
    const is_phone_changed = user ? phone !== (user.phone ?? '') : false;
    const has_changes = is_name_changed || is_phone_changed;

    const handle_save = async () => {
        if (!has_changes) return;

        // Ensure we have a valid token
        if (!token) {
            pushToast({ type: 'error', message: 'Authentication required. Please log in again.' });
            return;
        }

        try {
            // Build update payload
            const updates: any = {};
            if (is_name_changed) updates.name = name;
            if (is_phone_changed) updates.phone = phone;

            // Call profile update API - using correct endpoint /api/customers/profile
            const res = await fetch('http://localhost:5000/api/customers/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',  // Required to send httpOnly auth_token cookie
                body: JSON.stringify(updates),
            });

            if (res.ok) {
                pushToast({ type: 'success', message: 'Profile updated successfully' });
                // Stay on the same page - do NOT navigate
            } else {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update profile');
            }
        } catch (err: any) {
            pushToast({ type: 'error', message: err.message || 'Update failed' });
        }
    };

    // Avatar edit is not implemented yet - no-op placeholder
    const handle_avatar_edit = () => {
        // No action - feature not implemented
    };

    // Safety checks - wait for auth to complete and user data to load
    if (loading) return null;
    if (!is_authenticated) return null;
    if (!user) return null; // Additional null check for user data

    return (
        <CustomerLayout disablePadding={true}>
            <div className="edit-profile-page">
                {/* Header */}
                <header className="edit-profile-header">
                    <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px' }}>
                        <img src="/customer/assets/icons/backward.svg" alt="Back" width={24} height={24} />
                    </button>
                    <h1 className="edit-profile-title">Edit Profile</h1>
                </header>

                {/* Content */}
                <div className="edit-profile-content">
                    {/* Avatar */}
                    <div className="edit-avatar-section">
                        <img src="/customer/assets/images/profile_3.jpg" alt="Profile" className="edit-avatar-img" />
                        <button className="edit-avatar-btn" onClick={handle_avatar_edit}>
                            <img src="/customer/assets/icons/edit.svg" alt="Edit" style={{ filter: 'brightness(0) invert(1)', width: '16px', height: '16px' }} />
                        </button>
                    </div>

                    {/* Fields */}
                    <div className="edit-fields-container">
                        {/* Name */}
                        <div className="input-group">
                            <span className="input-label-floating">Name</span>
                            <div className="input-wrapper">
                                <input
                                    type="text"
                                    className="profile-input"
                                    value={name}
                                    onChange={(e) => set_name(e.target.value)}
                                />
                                {name.length > 2 && <img src="/customer/assets/icons/check.svg" className="valid-check-icon" alt="Valid" />}
                            </div>
                        </div>

                        {/* Email - Read Only */}
                        <div className="input-group">
                            <span className="input-label-floating">Email</span>
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    className="profile-input"
                                    value={email}
                                    readOnly
                                    disabled
                                    style={{ cursor: 'not-allowed', opacity: 0.6 }}
                                />
                                {email.includes('@') && <img src="/customer/assets/icons/check.svg" className="valid-check-icon" alt="Valid" />}
                            </div>
                        </div>

                        {/* Phone */}
                        <div className="input-group">
                            <span className="input-label-floating">Phone no.</span>
                            <div className="input-wrapper">
                                <span className="country-code-prefix">+91</span>
                                <input
                                    type="tel"
                                    className="profile-input"
                                    value={phone}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '');
                                        set_phone(val);
                                    }}
                                />
                                {phone.length === 10 && <img src="/customer/assets/icons/check.svg" className="valid-check-icon" alt="Valid" />}
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        className="save-profile-btn"
                        disabled={!has_changes}
                        onClick={handle_save}
                    >
                        Save
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
}