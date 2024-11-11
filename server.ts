import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';

const app = new Elysia();

// Use the static plugin to serve files from the 'dist' directory
app.use(
  staticPlugin({
    assets: 'dist',
    prefix: '/', // Serve files at the root URL
  })
);

// Start the server on port 3000 or the port specified in the environment variables
app.listen(Number(process.env.PORT) || 3000);
console.log('Server is running on http://localhost:3000');
