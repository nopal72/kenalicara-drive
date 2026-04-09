import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Semua chunk digabung ke satu file — wajib untuk GAS HtmlService
        inlineDynamicImports: true,
        entryFileNames: "index-[hash].js",
        format: "iife",
      },
    },
  },
});
