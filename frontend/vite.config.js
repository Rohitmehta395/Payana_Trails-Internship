import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // Vite's default chunking is safer and already benefits from 
        // the React.lazy() splitting in App.jsx.
      },
    },
    // Warn if any chunk exceeds 800 KiB
    chunkSizeWarningLimit: 800,
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
});
