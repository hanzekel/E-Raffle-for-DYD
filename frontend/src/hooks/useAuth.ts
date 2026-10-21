// Authentication and role inspection hook
import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

interface AuthMeResponse {
  authenticated: boolean;
  role: 'admin' | 'guest';
  username: string | null;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [role, setRole] = useState<'admin' | 'guest'>('guest');
  const [username, setUsername] = useState<string | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get<AuthMeResponse>('/admin/me');
      if (res.success && res.data) {
        setIsAuthenticated(Boolean(res.data.authenticated));
        setRole(res.data.role || 'guest');
        setUsername(res.data.username || null);
      } else {
        setIsAuthenticated(false);
        setRole('guest');
        setUsername(null);
      }
    } catch {
      setIsAuthenticated(false);
      setRole('guest');
      setUsername(null);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (user: string, pass: string): Promise<boolean> => {
    try {
      const res = await api.post('/admin/login', { username: user, password: pass });
      if (res.success) {
        await checkAuth();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.post('/admin/logout', {});
    } finally {
      setIsAuthenticated(false);
      setRole('guest');
      setUsername(null);
    }
  };

  return {
    isAuthenticated,
    isAdmin: role === 'admin',
    role,
    username,
    login,
    logout,
    checkAuth,
  };
};
