/**
 * Authentication hook for vendor portal
 * Manages auth state and provides auth methods
 */

import { useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';
import { vendorApi, handleApiResponse } from '../lib/api.jsx';
import toast from 'react-hot-toast';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setLoading(false);
          return;
        }

        if (session?.user) {
          setUser(session.user);
          setToken(session.access_token);
          await fetchVendorProfile();
        } else {
          setLoading(false);
        }
      } catch (error) {
        console.error('Error in getInitialSession:', error);
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.id);
        
        if (session?.user) {
          setUser(session.user);
          setToken(session.access_token);
          await fetchVendorProfile();
        } else {
          setUser(null);
          setVendor(null);
          setToken(null);
          setLoading(false);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchVendorProfile = async () => {
    try {
      const res = await vendorApi.getProfile();
      const data = handleApiResponse(res);
      setVendor(data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendor profile:', error);
      setLoading(false);
    }
  };

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Successfully signed in!');
      return { success: true, data };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email, password, shopName, communityId) => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            shop_name: shopName,
            community_id: communityId,
          },
        },
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Account created! Please check your email to verify your account.');
      return { success: true, data };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      setUser(null);
      setVendor(null);
      setToken(null);
      toast.success('Successfully signed out!');
      return { success: true };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Password reset email sent!');
      return { success: true };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    }
  };

  const updatePassword = async (newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        toast.error(error.message);
        return { success: false, error };
      }

      toast.success('Password updated successfully!');
      return { success: true };
    } catch (error) {
      toast.error('An unexpected error occurred');
      return { success: false, error };
    }
  };

  const value = {
    user,
    vendor,
    token,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: !!user,
    isVendor: !!vendor,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
