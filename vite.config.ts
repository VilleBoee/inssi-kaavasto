import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// Relative base works when the built dist/ is served from any subpath,
// including https://<user>.github.io/<repo>/. Override with VITE_BASE=/repo/.
const base = process.env.VITE_BASE || "./";
const root = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  base,
  server: {
    host: "0.0.0.0",
    port: 8080,
    strictPort: true,
  },
  preview: {
    host: "127.0.0.1",
    port: 8081,
    strictPort: true,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(root, "src"),
    },
  },
});
