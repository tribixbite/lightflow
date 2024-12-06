import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(),
    VitePWA({
      manifest: {
        name: "RepoZen",
        short_name: "RepoZen",
        description: "Find GitHub projects by tech components in a peaceful, focused interface.",
        theme_color: "#0D0D0D",
        background_color: "#000000",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      registerType: "autoUpdate",
      workbox: {
        cleanupOutdatedCaches: true,
      },
    }),
    svgr({
      svgrOptions: {
        // svgProps: { width: "", height: "" },
        plugins: [
          // "@svgr/plugin-svgo",  // TODO: this breaks the animated svgs
          "@svgr/plugin-jsx"],
        svgoConfig: {
          floatPrecision: 2,
        },
      },
      include: "**/*.svg?react",
    })
  ],
  publicDir: 'public',
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  assetsInclude: ['**/*.md'],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components')
    }
  }
});
