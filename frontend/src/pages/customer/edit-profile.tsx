'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import CustomerLayout from '../../components/customer/CustomerLayout';
import { useToast } from '../../components/ui/ToastProvider';
import { useAuth } from '../../context/AuthContext';

export default function EditProfilePage() {
    const router = useRouter();
    const { pushToast } = useToast();
    const { user, token, loading, is_authenticated, sign_in } = useAuth();

    // Local state for form fields - initialize with safe defaults
    const [name, set_name] = useState('');
    const [email, set_email] = useState('');
    const [phone, set_phone] = useState('');

    // Profile picture state model
    const [original_profile_pic, set_original_profile_pic] = useState<string | null>(null);
    const [preview_profile_pic, set_preview_profile_pic] = useState<string | null>(null);
    const [selected_file, set_selected_file] = useState<File | null>(null);

    const [is_saving, set_is_saving] = useState(false);

    // Initialize state when user data is available
    useEffect(() => {
        if (user) {
            set_name(user.name ?? '');
            set_email(user.email ?? '');
            set_phone(user.phone ?? '');
            const profile_pic_url = user.profile_pic ?? null;
            set_original_profile_pic(profile_pic_url);
            set_preview_profile_pic(profile_pic_url);
        }
    }, [user]);

    // Derived states for changes
    const is_name_changed = user ? name !== (user.name ?? '') : false;
    const is_phone_changed = user ? phone !== (user.phone ?? '') : false;
    const is_profile_pic_changed = selected_file !== null;
    const has_changes = is_name_changed || is_phone_changed || is_profile_pic_changed;

    const handle_save = async () => {
        if (!has_changes) return;

        if (!token) {
            pushToast({ type: 'error', message: 'Authentication required. Please log in again.' });
            return;
        }

        set_is_saving(true);

        try {
            let new_profile_pic_url = original_profile_pic;

            // Step 1: Upload profile picture if changed
            if (selected_file) {
                const formData = new FormData();
                formData.append('profile_pic', selected_file);

                const upload_res = await fetch('http://localhost:5000/api/customers/profile-pic', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    credentials: 'include',
                    body: formData
                });

                if (!upload_res.ok) {
                    const errorData = await upload_res.json().catch(() => ({}));
                    throw new Error(errorData.message || 'Failed to upload profile picture');
                }

                const upload_data = await upload_res.json();
                new_profile_pic_url = upload_data.profile_pic;
            }

            // Step 2: Update profile with all changes
            const updates: any = {};
            if (is_name_changed) updates.name = name;
            if (is_phone_changed) updates.phone = phone;

            const res = await fetch('http://localhost:5000/api/customers/profile', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include',
                body: JSON.stringify(updates),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update profile');
            }

            // Step 3: Update local state and AuthContext
            set_original_profile_pic(new_profile_pic_url);
            set_preview_profile_pic(new_profile_pic_url);
            set_selected_file(null);

            // Update AuthContext with new user data
            const updated_user = {
                ...user!,
                name,
                phone,
                profile_pic: new_profile_pic_url
            };
            sign_in(updated_user, token);

            pushToast({ type: 'success', message: 'Profile updated successfully' });

        } catch (err: any) {
            pushToast({ type: 'error', message: err.message || 'Update failed' });
        } finally {
            set_is_saving(false);
        }
    };

    // Handle profile picture selection (preview only, no upload)
    const handle_avatar_edit = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            pushToast({ type: 'error', message: 'Please select a valid image file' });
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            pushToast({ type: 'error', message: 'Image size must be less than 5MB' });
            return;
        }

        // Store file for later upload and create preview URL
        set_selected_file(file);
        const preview_url = URL.createObjectURL(file);
        set_preview_profile_pic(preview_url);
    };

    // Handle profile picture deletion
    const handle_delete_profile_pic = async () => {
        if (!token) {
            pushToast({ type: 'error', message: 'Authentication required. Please log in again.' });
            return;
        }

        // Only allow deletion if there's an existing profile picture
        if (!original_profile_pic) {
            return;
        }

        set_is_saving(true);

        try {
            const res = await fetch('http://localhost:5000/api/customers/profile-pic', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                credentials: 'include'
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to delete profile picture');
            }

            // Update local state
            set_original_profile_pic(null);
            set_preview_profile_pic(null);
            set_selected_file(null);

            // Update AuthContext
            const updated_user = {
                ...user!,
                profile_pic: null
            };
            sign_in(updated_user, token);

            pushToast({ type: 'success', message: 'Profile picture deleted successfully' });

        } catch (err: any) {
            pushToast({ type: 'error', message: err.message || 'Delete failed' });
        } finally {
            set_is_saving(false);
        }
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
                        <img
                            src={
                                preview_profile_pic
                                    ? (preview_profile_pic.startsWith('blob:')
                                        ? preview_profile_pic
                                        : `http://localhost:5000${preview_profile_pic}`)
                                    : '/customer/assets/images/default_profile.jpg'
                            }
                            alt="Profile"
                            className="edit-avatar-img"
                            style={{ opacity: is_saving ? 0.5 : 1 }}
                        />
                        <input
                            type="file"
                            id="profile-pic-input"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handle_avatar_edit}
                            disabled={is_saving}
                        />
                        {/* Delete button - only show if profile picture exists */}
                        {original_profile_pic && (
                            <button
                                className="delete-avatar-btn"
                                onClick={handle_delete_profile_pic}
                                disabled={is_saving}
                                title="Delete profile picture"
                            >
                                <img src="/customer/assets/icons/delete.svg" alt="Delete" style={{ filter: 'brightness(0) invert(1)', width: '16px', height: '16px' }} />
                            </button>
                        )}
                        {/* Edit button */}
                        <button
                            className="edit-avatar-btn"
                            onClick={() => document.getElementById('profile-pic-input')?.click()}
                            disabled={is_saving}
                        >
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
                                {name.length > 2 && (
                                    <img
                                        src="/customer/assets/icons/check.svg"
                                        className={`valid-check-icon ${is_name_changed ? 'editing' : 'saved'}`}
                                        alt="Valid"
                                    />
                                )}
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
                                {email.includes('@') && (
                                    <img
                                        src="/customer/assets/icons/check.svg"
                                        className="valid-check-icon saved"
                                        alt="Valid"
                                    />
                                )}
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
                                {phone.length === 10 && (
                                    <img
                                        src="/customer/assets/icons/check.svg"
                                        className={`valid-check-icon ${is_phone_changed ? 'editing' : 'saved'}`}
                                        alt="Valid"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Save Button */}
                    <button
                        className="save-profile-btn"
                        disabled={!has_changes || is_saving}
                        onClick={handle_save}
                    >
                        {is_saving ? 'Saving...' : 'Save'}
                    </button>
                </div>
            </div>
        </CustomerLayout>
    );
}