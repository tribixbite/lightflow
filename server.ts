import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import path from 'path';

const app = new Elysia();
const port = Number(process.env.PORT) || 3000;
// Use the static plugin to serve files from the 'dist' directory
app.use(
  staticPlugin({
    assets: 'dist',
    prefix: '/', // Serve files at the root URL
  })
);

// SPA fallback: Serve 'index.html' for all unmatched routes, preserving query params and hashes
app.get('/*', (ctx) => {
  const url = new URL(ctx.request.url);
  const indexPath = path.join(import.meta.dir, 'dist', 'index.html');

  // Redirect query parameters and hash for React Router compatibility
  const query = url.search;
  const hash = url.hash;

  return new Response(Bun.file(indexPath), {
    headers: { 'Content-Type': 'text/html' },
    status: 200,
  });
});


// Start the server on port 3000 or the port specified in the environment variables
app.listen(port);
console.log(`Server is running on http://localhost:${port}`);
