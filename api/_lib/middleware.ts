import type { VercelRequest, VercelResponse, VercelApiHandler } from '@vercel/node';
import { prisma } from './prisma';
import { ApiError, handleApiError } from './errors';
import { getTokenFromCookies, verifyToken } from './auth';

export interface MiddlewareOptions {
  methods: string[];
  rateLimit?: {
    max: number;
    windowMinutes: number;
  };
  requireAuth?: boolean;
}

export async function checkRateLimit(key: string, max: number, windowMinutes: number): Promise<void> {
  // Bypass rate limiting for local dev if no DB is connected
  if (!process.env.DATABASE_URL) {
    console.warn('Bypassing rate limit (No DATABASE_URL configured)');
    return;
  }
  const now = new Date();
  const windowStart = new Date(now.getTime() - windowMinutes * 60 * 1000);

  const entry = await prisma.rateLimitEntry.findUnique({ where: { key } });

  if (entry) {
    if (entry.windowStart < windowStart) {
      // Window expired, reset
      await prisma.rateLimitEntry.update({
        where: { key },
        data: { hitCount: 1, windowStart: now },
      });
    } else {
      if (entry.hitCount >= max) {
        throw new ApiError(429, 'Rate limit exceeded', 'RATE_LIMIT_EXCEEDED');
      }
      await prisma.rateLimitEntry.update({
        where: { key },
        data: { hitCount: entry.hitCount + 1 },
      });
    }
  } else {
    await prisma.rateLimitEntry.create({
      data: { key, hitCount: 1, windowStart: now },
    });
  }
}

export function withMiddleware(handler: VercelApiHandler, options: MiddlewareOptions) {
  return async (req: VercelRequest, res: VercelResponse) => {
    try {
      // 1. CORS setup
      const origin = process.env.FRONTEND_URL || 'http://localhost:5173';
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', options.methods.join(', ') + ', OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      res.setHeader('Access-Control-Allow-Credentials', 'true');

      // 2. Handle OPTIONS preflight
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }

      // 3. Check HTTP Method
      if (!options.methods.includes(req.method || '')) {
        throw new ApiError(405, `Method ${req.method} not allowed`, 'METHOD_NOT_ALLOWED');
      }

      // 4. Rate Limiting
      if (options.rateLimit) {
        const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
        const key = `${req.method}:${req.url}:${ip}`;
        await checkRateLimit(key, options.rateLimit.max, options.rateLimit.windowMinutes);
      }

      // 5. Authentication
      if (options.requireAuth) {
        const token = getTokenFromCookies(req);
        if (!token) {
          throw new ApiError(401, 'Unauthorized', 'UNAUTHORIZED');
        }
        try {
          const decoded = verifyToken(token);
          // Attach to custom property, since req doesn't have it typed, we can cast or extend
          (req as any).admin = decoded;
        } catch (err) {
          throw new ApiError(401, 'Invalid or expired token', 'INVALID_TOKEN');
        }
      }

      // 6. Call the actual handler
      return await handler(req, res);
    } catch (error) {
      // 7. Catch errors
      return handleApiError(error, res);
    }
  };
}
