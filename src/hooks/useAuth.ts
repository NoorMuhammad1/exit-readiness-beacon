import { useState, useEffect } from 'react';
import { apiClient } from '@/lib/api/client';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'admin' | 'client';
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');

      if (token) {
        try {
          const userData = await apiClient.getMe();
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user:', error);
          // Token might be expired, clear it
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);

      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Set user
      setUser(response.user);

      return { error: null };
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      const response = await apiClient.register({
        email,
        password,
        fullName,
        role: 'client',
      });

      // Store tokens
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);

      // Set user
      setUser(response.user);

      return { error: null };
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { error };
    }
  };

  const signOut = async () => {
    try {
      // Clear tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');

      // Clear user
      setUser(null);

      return { error: null };
    } catch (error: any) {
      console.error('Sign out error:', error);
      return { error };
    }
  };

  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Backward compatibility with Supabase API
  const session = user ? { user } : null;
  const profile = user ? {
    id: user.id,
    email: user.email,
    full_name: user.fullName,
    role: { name: user.role },
  } : null;

  return {
    user,
    session,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
    isAdmin,
  };
};
