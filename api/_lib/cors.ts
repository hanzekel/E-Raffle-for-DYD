// Shared CORS header setup supporting configured domain, Vercel URLs, same-host requests, and local dev
import type { VercelRequest, VercelResponse } from '@vercel/node';

export function applyCorsHeaders(req: VercelRequest, res: VercelResponse, methods: string[]): void {
  const requestOrigin = (req.headers.origin as string) || '';
  const host = (req.headers.host as string) || '';

  const allowedOrigins = [
    process.env.FRONTEND_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    host ? `https://${host}` : undefined,
    host ? `http://${host}` : undefined,
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ].filter(Boolean) as string[];

  const matchedOrigin = allowedOrigins.find((o) => o === requestOrigin);

  if (matchedOrigin) {
    res.setHeader('Access-Control-Allow-Origin', matchedOrigin);
  } else if (process.env.FRONTEND_URL) {
    res.setHeader('Access-Control-Allow-Origin', process.env.FRONTEND_URL);
  } else if (host) {
    res.setHeader('Access-Control-Allow-Origin', `https://${host}`);
  } else {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  }

  res.setHeader('Access-Control-Allow-Methods', methods.join(', ') + ', OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Vary', 'Origin');
}
