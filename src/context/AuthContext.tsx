import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '@/api/endpoints';
import type { User } from '@/types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, dob: string, gender?: string, mobileNumber?: string, panCard?: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const t = localStorage.getItem('token');
    if (!t) {
      setUser(null);
      setToken(null);
      setLoading(false);
      return;
    }
    try {
      const { data } = await authApi.me();
      // Backend GET /auth/session returns: { success, data: { id, email, fullName, ... } }
      const sessionData = data.data;
      setUser({
        id: sessionData.id,
        email: sessionData.email,
        fullName: sessionData.fullName,
        emailVerified: sessionData.emailVerified,
        defaultCurrency: sessionData.defaultCurrency,
        onboardingCompleted: sessionData.onboardingCompleted,
        accountCount: sessionData.accountCount,
        phone: sessionData.phone,
        pan: sessionData.pan,
      });
      setToken(t);
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = localStorage.getItem('user');
    if (t && u) {
      setToken(t);
      try {
        setUser(JSON.parse(u));
      } catch {
        setUser(null);
      }
    }
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, password: string) => {
    const { data } = await authApi.login(email, password);
    // Backend POST /auth/login returns:
    // { success, data: { user: {...}, session: { accessToken, refreshToken, expiresAt }, onboardingCompleted, salaryPendingForMonth } }
    const result = data.data;
    const accessToken = result.session.accessToken;
    const userData: User = result.user;

    localStorage.setItem('token', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
    setToken(accessToken);
  };

  const register = async (name: string, email: string, password: string, dob: string, gender?: string, mobileNumber?: string, panCard?: string) => {
    // Registration returns success message, user needs to verify email before login
    await authApi.register(name, email, password, dob, gender, mobileNumber, panCard);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
