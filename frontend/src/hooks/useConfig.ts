import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ConfigData } from '../types';

export const useConfig = () => {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await api.get<ConfigData>('/config');
        if (res.success && res.data) {
          setConfig(res.data);
        } else {
          setError(res.error || 'Failed to load configuration');
        }
      } catch (err) {
        setError('An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  return { config, loading, error };
};
