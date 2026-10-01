import { useState, useEffect, useCallback } from 'react';
import { api } from '../lib/api';

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  const checkAuth = useCallback(async () => {
    try {
      const res = await api.get('/admin/dashboard?limit=1');
      setIsAuthenticated(res.success);
    } catch {
      setIsAuthenticated(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const res = await api.post('/admin/login', { username, password });
      if (res.success) {
        setIsAuthenticated(true);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  const logout = async () => {
    await api.post('/admin/logout', {});
    setIsAuthenticated(false);
  };

  return { isAuthenticated, login, logout, checkAuth };
};
