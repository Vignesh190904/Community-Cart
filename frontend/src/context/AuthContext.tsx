'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// ... (imports remain same)

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    addresses?: any[];
    ui_preferences?: {
        theme?: 'light' | 'dark';
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    is_authenticated: boolean;
    loading: boolean;
    sign_in: (user: User, token: string) => void;
    sign_out: () => void;
    update_theme: (theme: 'light' | 'dark') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, set_user] = useState<User | null>(null);
    const [token, set_token] = useState<string | null>(null);
    const [loading, set_loading] = useState(true);

    // Apply theme helper
    const apply_theme = (theme: 'light' | 'dark') => {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('cc_theme', theme);
    };

    // Load auth state ONCE
    useEffect(() => {
        const stored_token = localStorage.getItem('auth_token');
        const stored_user = localStorage.getItem('auth_user');

        if (stored_token && stored_user) {
            set_token(stored_token);
            const parsed_user = JSON.parse(stored_user);
            set_user(parsed_user);

            // Apply user theme if available, else fall back to local storage or default
            if (parsed_user.ui_preferences?.theme) {
                apply_theme(parsed_user.ui_preferences.theme);
            }
        } else {
            // If not logged in, just ensure local storage theme is title
            const localTheme = localStorage.getItem('cc_theme') as 'light' | 'dark' | null;
            if (localTheme) apply_theme(localTheme);
        }

        set_loading(false);
    }, []);

    const sign_in = (user_data: User, token: string) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user_data));
        set_user(user_data);
        set_token(token);

        // Apply theme from user data on login
        if (user_data.ui_preferences?.theme) {
            apply_theme(user_data.ui_preferences.theme);
        }
    };

    const update_theme = async (theme: 'light' | 'dark') => {
        // 1. Optimistic Update
        apply_theme(theme);

        // 2. Update Context state if user exists
        if (user) {
            const updated_user = {
                ...user,
                ui_preferences: { ...user.ui_preferences, theme }
            };
            set_user(updated_user);
            localStorage.setItem('auth_user', JSON.stringify(updated_user));

            // 3. Sync with Backend
            if (token) {
                try {
                    await fetch('http://localhost:5000/api/customers/ui-preferences', {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ theme })
                    });
                } catch (error) {
                    console.error("Failed to sync theme preference", error);
                }
            }
        }
    };

    const sign_out = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set_user(null);
        set_token(null);
        window.location.href = '/customer/signin';
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                is_authenticated: Boolean(token),
                loading,
                sign_in,
                sign_out,
                update_theme
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};
