// Unified single serverless entrypoint for all DYD26 API endpoints (Vercel Hobby plan compatible)
import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables for local testing
config();

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
import raffleWinnersHandler from './_routes/raffle/winners';

const app = express();

// Global middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json());

const router = express.Router();

// Helper to bridge Express params to Vercel req.query
const wrap = (handler: any, paramMap?: { [key: string]: string }) => {
  return async (req: express.Request, res: express.Response) => {
    try {
      if (paramMap) {
        req.query = req.query || {};
        for (const [paramName, queryName] of Object.entries(paramMap)) {
          if (req.params[paramName]) {
            req.query[queryName] = req.params[paramName];
          }
        }
      }
      await handler(req as any, res as any);
    } catch (err: any) {
      if (!res.headersSent) {
        res.status(err.statusCode || 500).json({
          error: err.message || 'Internal Server Error',
          code: err.code || 'INTERNAL_ERROR',
        });
      }
    }
  };
};

// Route definitions
router.all('/config', wrap(configHandler));
router.all('/register', wrap(registerHandler));
router.all('/upload-url', wrap(uploadUrlHandler));
router.all('/payment', wrap(paymentHandler));
router.all('/tickets/all', wrap(allTicketsHandler));
router.all('/tickets/:orderId', wrap(getTicketsHandler, { orderId: 'orderId' }));
router.all('/auth/verify-email', wrap(verifyEmailHandler));
router.all('/admin/login', wrap(adminLoginHandler));
router.all('/admin/logout', wrap(adminLogoutHandler));
router.all('/admin/me', wrap(adminMeHandler));
router.all('/admin/dashboard', wrap(adminDashboardHandler));
router.all('/admin/winners', wrap(adminWinnersHandler));
router.all('/admin/approve/:id', wrap(adminApproveHandler, { id: 'id' }));
router.all('/admin/reject/:id', wrap(adminRejectHandler, { id: 'id' }));
router.all('/admin/delete/:id', wrap(adminDeleteHandler, { id: 'id' }));
router.all('/admin/draw', wrap(adminDrawHandler));
router.all('/admin/draw/void', wrap(adminVoidDrawHandler));
router.all('/admin/void-draw', wrap(adminVoidDrawHandler));
router.all('/raffle/winners', wrap(raffleWinnersHandler));

// Mount under both /api and / to handle all rewrite variants seamlessly
app.use('/api', router);
app.use('/', router);

// Export for Vercel Serverless Function deployment
export default function handler(req: any, res: any) {
  return app(req, res);
}

// Named export for local Express testing
export { app };

