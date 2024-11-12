
export const SEO = () => (
  <>
    <title>RepoZen - Find Tranquility in Tech Discovery</title>
    <meta name="description" content="Discover GitHub projects by tech components in a peaceful, focused interface." />
    <meta name="keywords" content="GitHub, tech discovery, project search, development tools, open-source projects, JavaScript, Python" />
    <meta name="author" content="tribixbite" />
    <meta name="robots" content="index, follow" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    {/* Open Graph */}
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://repozen.com" />
    <meta property="og:title" content="RepoZen - Find Tranquility in Tech Discovery" />
    <meta property="og:description" content="Discover GitHub projects by tech components in a peaceful, focused interface." />
    <meta property="og:image" content="/src/assets/screenshot.png" />

    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:url" content="https://repozen.com" />
    <meta name="twitter:title" content="RepoZen - Find Tranquility in Tech Discovery" />
    <meta name="twitter:description" content="Discover GitHub projects by tech components in a peaceful, focused interface." />
    <meta name="twitter:image" content="/src/assets/screenshot.png" />

    {/* Favicon and Apple Touch Icon */}
    <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    <link rel="icon" href="/icons/favicon.ico" />

    {/* Web App Manifest */}
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#0D0D0D" />

    {/* Service Worker */}
    <script>
      {/* if (window && "serviceWorker" in navigator && "addEventListener" in window) {
        window.addEventListener("load", () => {
          navigator.serviceWorker
            .register("/service-worker.js")
            .then(reg => console.log("Service Worker registered!", reg))
            .catch(err => console.log("Service Worker registration failed:", err));
        });
      } */}
    </script>
  </>
);
