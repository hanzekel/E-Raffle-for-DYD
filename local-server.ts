// Local Express development server matching Vercel single-function environment
import { app } from './api/index';

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`\n  DYD 2026 Local API Server running at:`);
  console.log(`  http://localhost:${port}/api/config`);
  console.log(`  http://localhost:${port}/api/tickets/all\n`);
});
