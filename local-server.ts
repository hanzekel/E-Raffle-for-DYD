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

app.listen(port, () => {
  console.log(`🚀 Local dev API server running on http://localhost:${port}`);
});

