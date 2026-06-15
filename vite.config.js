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
});
