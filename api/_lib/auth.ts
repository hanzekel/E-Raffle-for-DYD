import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const JWT_EXPIRY = process.env.JWT_EXPIRY || '2h';
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || '12', 10);
const TOKEN_COOKIE_NAME = 'dyd26_admin_token';

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyToken(token: string): string | jwt.JwtPayload {
  return jwt.verify(token, JWT_SECRET);
}

export function getTokenFromCookies(req: VercelRequest): string | null {
  if (req.cookies && req.cookies[TOKEN_COOKIE_NAME]) {
    return req.cookies[TOKEN_COOKIE_NAME];
  }
  return null;
}

export function setTokenCookie(res: VercelResponse, token: string): void {
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `${TOKEN_COOKIE_NAME}=${token}; HttpOnly; Path=/; ${
      isProd ? 'Secure; ' : ''
    }SameSite=Strict; Max-Age=7200`
  );
}

export function clearTokenCookie(res: VercelResponse): void {
  const isProd = process.env.NODE_ENV === 'production';
  res.setHeader(
    'Set-Cookie',
    `${TOKEN_COOKIE_NAME}=; HttpOnly; Path=/; ${
      isProd ? 'Secure; ' : ''
    }SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  );
}
