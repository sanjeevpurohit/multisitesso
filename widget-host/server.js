import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequestHandler } from '@remix-run/express';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from build/client
app.use(express.static(path.join(__dirname, 'build/client')));

// Import the Remix server build
const build = await import('./build/server/index.js');

// Handle all routes with Remix
app.all('*', createRequestHandler({
  build: build.default || build,
  mode: process.env.NODE_ENV || 'production',
}));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Widget host server running on port ${PORT}`);
});

