import { ApiResponse } from '../types';

const API_BASE = '/api';

export const api = {
  async get<T>(path: string): Promise<ApiResponse<T>> {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
    });
    return res.json();
  },
  
  async post<T>(path: string, body: any): Promise<ApiResponse<T>> {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    return res.json();
  },

  async uploadDirect(url: string, file: File): Promise<boolean> {
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      });
      return res.ok;
    } catch {
      return false;
    }
  }
};
