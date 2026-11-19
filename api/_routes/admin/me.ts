// Role and authentication verification endpoint
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getTokenFromCookies, verifyToken } from '../../_lib/auth';
import { applyCorsHeaders } from '../../_lib/cors';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS setup for local and production
  applyCorsHeaders(req, res, ['GET']);

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

