import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
  server: {
    headers: {
      "Content-Security-Policy":
        "default-src 'self'; connect-src 'self' https://onrender.com; style-src 'self' 'unsafe-inline' https://googleapis.com; font-src 'self' https://gstatic.com;",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
  },
});
