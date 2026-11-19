// Zero-dependency Vercel Serverless API router (Hobby plan: 1 function total)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { handleApiError } from './_lib/errors';

import configHandler from './_routes/config';
import registerHandler from './_routes/register';
import uploadUrlHandler from './_routes/upload-url';
import paymentHandler from './_routes/payment';
import allTicketsHandler from './_routes/tickets/all';
import getTicketsHandler from './_routes/tickets/[orderId]';
import verifyEmailHandler from './_routes/auth/verify-email';
import adminLoginHandler from './_routes/admin/login';
import adminLogoutHandler from './_routes/admin/logout';
import adminMeHandler from './_routes/admin/me';
import adminDashboardHandler from './_routes/admin/dashboard';
import adminApproveHandler from './_routes/admin/approve/[id]';
import adminRejectHandler from './_routes/admin/reject/[id]';
import adminDeleteHandler from './_routes/admin/delete/[id]';
import adminDrawHandler from './_routes/admin/draw';
import adminVoidDrawHandler from './_routes/admin/void-draw';
import adminWinnersHandler from './_routes/admin/winners';
import adminTestEmailHandler from './_routes/admin/test-email';
import raffleWinnersHandler from './_routes/raffle/winners';

type RouteHandler = (req: VercelRequest, res: VercelResponse) => Promise<any> | any;

const STATIC_ROUTES: Record<string, RouteHandler> = {
  '/config': configHandler,
  '/register': registerHandler,
  '/upload-url': uploadUrlHandler,
  '/payment': paymentHandler,
  '/tickets/all': allTicketsHandler,
  '/auth/verify-email': verifyEmailHandler,
  '/admin/login': adminLoginHandler,
  '/admin/logout': adminLogoutHandler,
  '/admin/me': adminMeHandler,
  '/admin/dashboard': adminDashboardHandler,
  '/admin/winners': adminWinnersHandler,
  '/admin/draw': adminDrawHandler,
  '/admin/draw/void': adminVoidDrawHandler,
  '/admin/void-draw': adminVoidDrawHandler,
  '/admin/test-email': adminTestEmailHandler,
  '/raffle/winners': raffleWinnersHandler,
};

const DYNAMIC_ROUTES: { prefix: string; paramKey: string; handler: RouteHandler }[] = [
  { prefix: '/tickets/', paramKey: 'orderId', handler: getTicketsHandler },
  { prefix: '/admin/approve/', paramKey: 'id', handler: adminApproveHandler },
  { prefix: '/admin/reject/', paramKey: 'id', handler: adminRejectHandler },
  { prefix: '/admin/delete/', paramKey: 'id', handler: adminDeleteHandler },
];

// Normalize route path from Vercel rewrite (__path) or direct request URL
function resolveRoutePath(req: VercelRequest): string {
  const rewritten = req.query?.__path;
  let rawPath = '';

  if (typeof rewritten === 'string' && rewritten.length > 0) {
    rawPath = `/${rewritten}`;
  } else if (Array.isArray(rewritten) && rewritten.length > 0) {
    rawPath = `/${rewritten.join('/')}`;
  } else {
    try {
      rawPath = new URL(req.url || '/', 'http://localhost').pathname;
    } catch {
      rawPath = (req.url || '/').split('?')[0];
    }
  }

  // Strip /api prefix and trailing slash so both /api/config and /config resolve cleanly
  let normalized = rawPath.replace(/^\/api(?=\/|$)/, '') || '/';
  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Ensure req.query is always an object for param injection
    if (!req.query) {
      (req as any).query = {};
    }

    // Parse raw JSON string bodies defensively if an upstream proxy skipped parsing
    if (typeof req.body === 'string' && req.body.trim().startsWith('{')) {
      try {
        (req as any).body = JSON.parse(req.body);
      } catch {
        return res.status(400).json({
          success: false,
          error: { code: 'INVALID_JSON', message: 'Invalid JSON request payload.' },
        });
      }
    }

    const routePath = resolveRoutePath(req);

    // 1. Exact static route match
    const staticHandler = STATIC_ROUTES[routePath];
    if (staticHandler) {
      return await staticHandler(req, res);
    }

    // 2. Single-segment dynamic route match
    for (const route of DYNAMIC_ROUTES) {
      if (routePath.startsWith(route.prefix)) {
        const paramValue = routePath.slice(route.prefix.length);
        if (paramValue && !paramValue.includes('/')) {
          (req.query as Record<string, string>)[route.paramKey] = decodeURIComponent(paramValue);
          return await route.handler(req, res);
        }
      }
    }

    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: `API endpoint not found: ${routePath}` },
    });
  } catch (err) {
    if (!res.headersSent) {
      return handleApiError(err, res);
    }
  }
}
