import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { createPrediction, getPrediction, listPredictions } from '@/lib/replicate';


const app = new Elysia();
const port = Number(process.env.PORT) || 3000;

// Basic sanitization for prompt text
function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    // Remove any control characters
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '')
    // Convert multiple spaces to single space
    .replace(/\s+/g, ' ')
    // Remove any potentially harmful characters
    .replace(/[<>]/g, '');
}

app.get('/remix', async ({ query }) => {
  // If predictionId is provided, get the prediction status/result
  if (query.id) {
    return await getPrediction(query.id);
  }

  // If no image URL is provided when creating a new prediction
  if (!query.image) {
    return {
      error: 'Missing required parameter: image',
      status: 400
    };
  }

  // Decode and sanitize the input parameters
  try {
    const imageUrl = decodeURIComponent(query.image);
    
    // Handle the prompt if provided
    const prompt = query.prompt 
      ? sanitizePrompt(decodeURIComponent(query.prompt))
      : undefined;

    // Create new prediction
    return await createPrediction(imageUrl, prompt);
    
  } catch (error) {
    return {
      error: 'Invalid input parameters',
      details: (error as Error).message,
      status: 400
    };
  }
})
.get('/remix/list', async () => {
  return await listPredictions();
});

// Use the static plugin to serve files from the 'dist' directory
app.use(
  staticPlugin({
    assets: 'dist',
    prefix: '/', // Serve files at the root URL
  })
);

// SPA fallback: Serve 'index.html' for all unmatched routes, preserving query params and hashes
// app.get('*', (ctx) => {
//   // Skip if requesting /index directly
//   if (ctx.request.url.endsWith('/index')) {
//     return;
//   }

//   const url = new URL(ctx.request.url);
//   const indexPath = path.join(import.meta.dir, 'dist', 'index.html');
//   console.log({url})

//   // Redirect query parameters and hash for React Router compatibility
//   const query = url.search;
//   const hash = url.hash;

//   return new Response(Bun.file(indexPath), {
//     headers: { 'Content-Type': 'text/html' },
//     status: 200,
//   });
// });


// Start the server on port 3000 or the port specified in the environment variables
app.listen(port);
console.log(`Server is running on http://localhost:${port}`);
