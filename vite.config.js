import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mkcert from 'vite-plugin-mkcert';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mkcert()],
  base: "/jammming",
  server: {
    host: "67.242.161.78",
    port: 5173,
  }
})
