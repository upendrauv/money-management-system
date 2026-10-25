import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const res = await authApi.getCurrentUser();
          if (res.data) {
            setUser(res.data);
            localStorage.setItem('user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error("Session verification failed:", err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyToken();

    const handleAutoLogout = () => {
      logout();
    };
    window.addEventListener('auth:logout', handleAutoLogout);
    return () => window.removeEventListener('auth:logout', handleAutoLogout);
  }, [token]);

  const login = async (usernameOrEmail, password) => {
    const res = await authApi.login({ usernameOrEmail, password });
    if (res.data && res.data.token) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      const userData = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        fullName: res.data.fullName,
        currency: res.data.currency || 'USD',
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return res.data;
    }
  };

  const register = async (userData) => {
    const res = await authApi.register(userData);
    if (res.data && res.data.token) {
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      const userObj = {
        id: res.data.id,
        username: res.data.username,
        email: res.data.email,
        fullName: res.data.fullName,
        currency: res.data.currency || 'USD',
      };
      setUser(userObj);
      localStorage.setItem('user', JSON.stringify(userObj));
      return res.data;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, loading, login, register, logout }}>
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

