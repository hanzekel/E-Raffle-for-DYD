import express from 'express';
import cors from 'cors';
import { config } from 'dotenv';

// Load environment variables
config();

import configHandler from './api/config.ts';
import registerHandler from './api/register.ts';
import uploadUrlHandler from './api/upload-url.ts';
import paymentHandler from './api/payment.ts';
import allTicketsHandler from './api/tickets/all.ts';
import verifyEmailHandler from './api/auth/verify-email.ts';
import adminLoginHandler from './api/admin/login.ts';
import adminLogoutHandler from './api/admin/logout.ts';
import adminMeHandler from './api/admin/me.ts';
import adminDashboardHandler from './api/admin/dashboard.ts';
import adminApproveHandler from './api/admin/approve/[id].ts';
import adminRejectHandler from './api/admin/reject/[id].ts';
import adminDeleteHandler from './api/admin/delete/[id].ts';
import getTicketsHandler from './api/tickets/[orderId].ts';
import adminDrawHandler from './api/admin/draw.ts';
import adminVoidDrawHandler from './api/admin/void-draw.ts';
import adminWinnersHandler from './api/admin/winners.ts';
import raffleWinnersHandler from './api/raffle/winners.ts';

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.all('/api/config', async (req, res) => {
  try { await configHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/register', async (req, res) => {
  try { await registerHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/upload-url', async (req, res) => {
  try { await uploadUrlHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/payment', async (req, res) => {
  try { await paymentHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/tickets/all', async (req, res) => {
  try { await allTicketsHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/auth/verify-email', async (req, res) => {
  try { await verifyEmailHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/admin/login', async (req, res) => {
  try { await adminLoginHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/admin/logout', async (req, res) => {
  try { await adminLogoutHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/admin/me', async (req, res) => {
  try { await adminMeHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/admin/dashboard', async (req, res) => {
  try { await adminDashboardHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/admin/winners', async (req, res) => {
  try { await adminWinnersHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/admin/approve/:id', async (req, res) => {
  try { 
    req.query.id = req.params.id;
    await adminApproveHandler(req as any, res as any); 
  } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/admin/reject/:id', async (req, res) => {
  try { 
    req.query.id = req.params.id;
    await adminRejectHandler(req as any, res as any); 
  } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/admin/delete/:id', async (req, res) => {
  try { 
    req.query.id = req.params.id;
    await adminDeleteHandler(req as any, res as any); 
  } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/tickets/:orderId', async (req, res) => {
  try { 
    req.query.orderId = req.params.orderId;
    await getTicketsHandler(req as any, res as any); 
  } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/admin/draw', async (req, res) => {
  try { await adminDrawHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/admin/draw/void', async (req, res) => {
  try { await adminVoidDrawHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.all('/api/raffle/winners', async (req, res) => {
  try { await raffleWinnersHandler(req as any, res as any); } 
  catch (e) { res.status(500).json({ error: e }); }
});

app.listen(port, () => {
  console.log(`🚀 Local dev API server running on http://localhost:${port}`);
});
