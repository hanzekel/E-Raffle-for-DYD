import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ConfigData } from '../types';

export const FALLBACK_CONFIG: ConfigData = {
  ticketPrice: 100,
  maxTickets: 10,
  gcashNumber: '09XXXXXXXXX',
  gcashName: 'MOPCY DYD 2026',
  bankName: 'BDO / BPI',
  bankAccountNumber: 'XXXX-XXXX-XXXX',
  bankAccountName: 'MOPCY DYD 2026',
  campNames: [
    'Camp 1 - Manila',
    'Camp 2 - Cavite',
    'Camp 3 - Laguna',
    'Camp 4 - Batangas',
    'Camp 5 - Rizal',
    'Camp 6 - Bulacan',
    'Camp 7 - Pampanga',
    'Camp 8 - Pangasinan',
    'Other',
  ],
  drawDate: '2026-11-28T18:00:00+08:00',
};

export const useConfig = () => {
  // Start with fallback config so UI renders instantly without freeze
  const [config, setConfig] = useState<ConfigData>(FALLBACK_CONFIG);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchConfig = async () => {
      try {
        const res = await api.get<ConfigData>('/config');
        if (!isMounted) return;

        if (res.success && res.data) {
          setConfig(res.data);
          setError(null);
        } else {
          setError(res.error || 'Using default configuration');
        }
      } catch {
        if (isMounted) {
          setError('Could not reach server, using offline defaults');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchConfig();
    return () => {
      isMounted = false;
    };
  }, []);

  return { config, loading, error };
};
