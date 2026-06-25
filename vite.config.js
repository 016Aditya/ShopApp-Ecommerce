import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
    // Force a single copy of React & ReactDOM across all packages (Zustand v5 fix)
    dedupe: ["react", "react-dom"],
  },
  optimizeDeps: {
    // Pre-bundle together so Vite doesn't create separate chunks with different React
    include: ["react", "react-dom", "zustand"],
  },
  build: {
    // Split CSS per chunk for better caching
    cssCodeSplit: true,
    // Disable sourcemaps in production (reduces bundle size)
    sourcemap: false,
    rollupOptions: {
      output: {
        // Manual chunk splitting: React core, router, state, and UI libs
        // get their own chunks so they are cached independently and
        // downloaded in parallel on first load.
        manualChunks(id) {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/react-router') || id.includes('node_modules/@remix-run')) {
            return 'vendor-router';
          }
          if (id.includes('node_modules/zustand')) {
            return 'vendor-zustand';
          }
          if (
            id.includes('node_modules/axios') ||
            id.includes('node_modules/react-hot-toast') ||
            id.includes('node_modules/lucide-react')
          ) {
            return 'vendor-ui';
          }
        },
      },
    },
  },
});
