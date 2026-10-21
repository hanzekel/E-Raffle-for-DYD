import { ApiResponse } from '../types';

const API_BASE = '/api';

// Converts any technical or raw error into a clean human sentence
function toHumanMessage(data: any): string {
  if (!data) return 'Something went wrong. Please try again.';
  if (typeof data.error === 'string') return data.error;
  if (data.error && typeof data.error === 'object' && typeof data.error.message === 'string') {
    return data.error.message;
  }
  if (typeof data.message === 'string') return data.message;
  return 'Something went wrong. Please try again.';
}

export const api = {
  async get<T>(path: string): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${API_BASE}${path}`, { credentials: 'include' });
      const contentType = res.headers.get('content-type') || '';
      
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          error: 'The server is temporarily taking a break. Please refresh in a moment.',
        };
      }

      const data = await res.json();
      if (!res.ok || data.success === false) {
        return {
          success: false,
          error: toHumanMessage(data),
        };
      }

      return data;
    } catch {
      return {
        success: false,
        error: 'Unable to connect right now. Please check your internet connection.',
      };
    }
  },

  async post<T>(path: string, body: any = {}): Promise<ApiResponse<T>> {
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      });

      const contentType = res.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        return {
          success: false,
          error: 'The server is temporarily taking a break. Please try again shortly.',
        };
      }

      const data = await res.json();
      if (!res.ok || data.success === false) {
        return {
          success: false,
          error: toHumanMessage(data),
        };
      }

      return data;
    } catch {
      return {
        success: false,
        error: 'Unable to connect right now. Please check your internet connection.',
      };
    }
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
  },
};
