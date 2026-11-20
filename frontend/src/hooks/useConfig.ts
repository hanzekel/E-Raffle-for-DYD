import { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { ConfigData } from '../types';

export const FALLBACK_CONFIG: ConfigData = {
  ticketPrice: 20,
  maxTickets: 10,
  gcashNumber: '09171701054',
  gcashName: 'ANGELA KAYE LUPAC',
  bankName: 'BDO / BPI',
  bankAccountNumber: 'XXXX-XXXX-XXXX',
  bankAccountName: 'MOPCY DYD 2026',
  campNames: [
    'Bonifacio Naval Station',
    'Bureau of Fire Protection - NCR',
    'Bureau of Jail Management and Penology',
    'General Headquarters, AFP',
    'Camp Crame, PNP NHQ',
    'Camp Panacan',
    'Clark Air Base',
    'Fernando Air Base',
    'Army Fort Bonifacio',
    'Heroesville',
    'Naval Forces Central',
    'Presidential Security Command',
    'Shrine of St. Therese',
    'Southern Police District',
    'Visayas Command, AFP',
    'Philippine National Police',
    'Other',
  ],
  drawDate: '2026-12-11T13:30:00+08:00',
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
