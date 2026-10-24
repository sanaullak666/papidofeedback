import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('papido_admin_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('papido_admin_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Verify token on initial load
    async function verifyAuth() {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await api.getAdminMe();
        if (res.success && res.user) {
          setUser(res.user);
          localStorage.setItem('papido_admin_user', JSON.stringify(res.user));
        } else {
          logout();
        }
      } catch (err) {
        logout();
      } finally {
        setIsLoading(false);
      }
    }

    verifyAuth();

    // Listen for session expiry event
    const handleExpired = () => {
      logout();
    };
    window.addEventListener('papido:session_expired', handleExpired);
    return () => window.removeEventListener('papido:session_expired', handleExpired);
  }, [token]);

  const login = async (email, password) => {
    const res = await api.adminLogin(email, password);
    if (res.success && res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('papido_admin_token', res.token);
      localStorage.setItem('papido_admin_user', JSON.stringify(res.user));
      return res;
    }
    throw new Error(res.message || 'Login failed.');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('papido_admin_token');
    localStorage.removeItem('papido_admin_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
