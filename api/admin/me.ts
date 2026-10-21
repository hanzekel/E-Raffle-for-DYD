// Role and authentication verification endpoint
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTokenFromCookies, verifyToken } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup for local and production
  const requestOrigin = (req.headers.origin as string) || '';
  const allowedOrigins = [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ].filter(Boolean) as string[];

  const matchedOrigin = allowedOrigins.find(o => o === requestOrigin);
  if (matchedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', matchedOrigin);
  } else if (process.env.FRONTEND_URL) {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  }
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const token = getTokenFromCookies(req);
  if (!token) {
    return res.status(200).json({
      success: true,
      data: {
        authenticated: false,
        role: 'guest',
        username: null,
      },
    });
  }

  try {
    const decoded = verifyToken(token) as any;
    return res.status(200).json({
      success: true,
      data: {
        authenticated: true,
        role: decoded.role || 'admin',
        username: decoded.username || 'admin',
      },
    });
  } catch {
    return res.status(200).json({
      success: true,
      data: {
        authenticated: false,
        role: 'guest',
        username: null,
      },
    });
  }
}

