// Local Express development server loading .env and bridging requests into api/index.ts
import { config } from 'dotenv';
config();

import express from 'express';
import cors from 'cors';
import apiHandler from './api/index';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// Express 5 app.use('/api', ...) matches all /api/* subpaths and delegates to Vercel handler
app.use('/api', (req, res) => {
  apiHandler(req as any, res as any);
});

app.listen(port, () => {
  console.log(`\n  DYD 2026 Local API Server running at:`);
  console.log(`  http://localhost:${port}/api/config`);
  console.log(`  http://localhost:${port}/api/tickets/all\n`);
});
