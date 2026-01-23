'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

/**
 * ═══════════════════════════════════════════════════════════════════════
 * AUTH CONTRACT - DO NOT MODIFY WITHOUT REVIEW
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * TOKEN SOURCE: localStorage ONLY
 * - Key name: 'auth_token'
 * - No cookies, no sessionStorage, no alternatives
 * 
 * LOGOUT: Must go through AuthContext.sign_out() ONLY
 * - No component may clear localStorage directly
 * - No duplicate logout logic allowed
 * 
 * TOKEN ACCESS: No component may read token directly
 * - Use useAuth() hook to access auth state
 * - api.utils.ts is the only file that reads localStorage.getItem('auth_token')
 * 
 * REHYDRATION: Identity only
 * - Reads auth_user + auth_token from localStorage
 * - Does NOT call /me
 * - Does NOT validate token
 * 
 * ═══════════════════════════════════════════════════════════════════════
 */

export interface User {
    id: string;
    name: string;
    email: string;
    phone?: string;
    profile_pic?: string;
    addresses?: any[];
    role?: 'customer' | 'vendor' | 'admin';
    ui_preferences?: {
        theme?: 'light' | 'dark';
    };
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    role: 'customer' | 'vendor' | 'admin' | null;
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
    const [role, set_role] = useState<'customer' | 'vendor' | 'admin' | null>(null);
    const [loading, set_loading] = useState(true);

    // Apply theme helper (local only)
    const apply_theme = (theme: 'light' | 'dark') => {
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);
        localStorage.setItem('cc_theme', theme);
    };

    // Identity-only rehydration from localStorage
    useEffect(() => {
        try {
            const storedUser = localStorage.getItem('auth_user');
            const storedToken = localStorage.getItem('auth_token');
            if (storedUser) {
                const parsed = JSON.parse(storedUser);
                set_user(parsed);
                set_role(parsed.role || null);
            }
            if (storedToken) {
                set_token(storedToken);
            }
        } catch {
            // Ignore corrupt storage
        } finally {
            set_loading(false);
            if (typeof window !== 'undefined') {
                (window as any).__AUTH_READY__ = true;
            }
        }
    }, []);

    const sign_in = (user_data: User, token: string) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user_data));
        set_user(user_data);
        set_token(token);
        set_role(user_data.role || 'customer');

        // Apply theme from user data on login
        if (user_data.ui_preferences?.theme) {
            apply_theme(user_data.ui_preferences.theme);
        }
    };

    const update_theme = async (theme: 'light' | 'dark') => {
        apply_theme(theme);
        if (user) {
            const updated_user = {
                ...user,
                ui_preferences: { ...user.ui_preferences, theme }
            };
            set_user(updated_user);
            localStorage.setItem('auth_user', JSON.stringify(updated_user));
        }
    };

    const sign_out = () => {
        const userRole = role || (() => {
            try {
                const stored = localStorage.getItem('auth_user');
                if (stored) {
                    return JSON.parse(stored).role;
                }
            } catch { }
            return null;
        })();

        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set_user(null);
        set_token(null);
        set_role(null);

        const { getLoginRedirectPath } = require('../utils/authRedirect.utils');
        const redirectPath = getLoginRedirectPath(userRole);
        window.location.href = redirectPath;
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                role,
                is_authenticated: Boolean(user),
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
