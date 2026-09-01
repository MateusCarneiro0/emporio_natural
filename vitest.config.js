import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    include: ['src/test/*'],
    exclude: ['src/test/setup.js'],
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
    globals: true,
    server: {
      deps: {
        inline: ["styled-components", "react-loader-spinner"],
      },
    },
  },
});
