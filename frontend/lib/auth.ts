// Authentication utilities for admin panel
'use client';

import { useRouter } from 'next/navigation';
import { authApi } from './api';

// Token management
export const getToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('admin-token');
  }
  return null;
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin-token', token);
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin-token');
  }
};

// Authentication functions
export const login = async (email: string, password: string) => {
  try {
    const response = await authApi.login({ email, password });
    const { token } = response;
    setToken(token);
    return { success: true, data: response };
  } catch (error) {
    return { success: false, error };
  }
};

export const logout = () => {
  removeToken();
};

// Auth check hook
export const useAuth = () => {
  const router = useRouter();
  
  const checkAuth = () => {
    const token = getToken();
    if (!token) {
      router.push('/login');
      return false;
    }
    return true;
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return { checkAuth, handleLogout };
};