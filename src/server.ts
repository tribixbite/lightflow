import { Elysia } from 'elysia';
import { staticPlugin } from '@elysiajs/static';
import { createPrediction, listPredictions } from '@/lib/replicate';

const app = new Elysia();
const port = Number(process.env.PORT) || 3000;

// Configuration Constants
const LLM_SUBDOMAIN_HOST = 'llm.synq.chat';
const MAIN_DOMAIN_HOST = 'synq.chat';
const LLM_ASSETS_PATH = 'public/llm';
const CACHE_CONTROL_STATIC = 'public, max-age=300, stale-while-revalidate=60'; // 5 min cache, 1 min stale
const CACHE_CONTROL_REDIRECT = 'public, max-age=3600'; // Cache redirect for 1 hour

// Create a separate app instance for llm subdomain with optimized settings
const llmApp = new Elysia()
  .use(staticPlugin({
    assets: LLM_ASSETS_PATH,
    prefix: '/',
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': CACHE_CONTROL_STATIC,
      'Vary': 'Accept-Encoding', // Important for caching compressed content
    },
    alwaysStatic: true, // Optimization: skip directory listing checks
    staticLimit: 1024 * 1024, // 1MB file size limit for safety
    ignorePatterns: ['.git', '.env', 'node_modules'] // Security: ignore sensitive files
  }));

// Optimized hostname check with early return
const ALLOWED_HOSTS = new Set([LLM_SUBDOMAIN_HOST]); 

// Handle llm subdomain requests and redirects
app.onRequest(async ({ request, set }) => {
  const host = request.headers.get('host') || '';
  const url = new URL(request.url);
  const path = url.pathname;
  
  // Check for llm subdomain
  if (host === LLM_SUBDOMAIN_HOST) {
    if (!ALLOWED_HOSTS.has(host)) {
      set.status = 400;
      return 'Invalid hostname';
    }
    
    // Handle the request using the llmApp
    return llmApp.handle(request);
  }
  
  // Redirect /llm path on main domain to llm subdomain
  if (host === MAIN_DOMAIN_HOST && path.startsWith('/llm')) {
    const newPath = path.replace(/^\/llm/, '') || '/';
    const newUrl = `https://${LLM_SUBDOMAIN_HOST}${newPath}${url.search}${url.hash}`;
    
    set.headers = {
      'Location': newUrl,
      'Cache-Control': CACHE_CONTROL_REDIRECT
    };
    set.status = 301; // Permanent redirect
    return; // Stop further processing
  }
});

// Basic sanitization for prompt text
function sanitizePrompt(prompt: string): string {
  return prompt
    .trim()
    .replace(/[\x00-\x1F\x7F-\x9F]/g, '') // Remove control characters
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/[<>]/g, ''); // Remove potential HTML tags
}

app.get('/remix', async ({ query }) => {
  // If predictionId is provided, get the prediction status/result
  if (query.list) {
    return await listPredictions();
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


// Start the server on port 3000 or the port specified in the environment variables
app.listen(port);
console.log(`Server is running on http://localhost:${port}`);
