import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// base './' lets the built site run from any folder or static host (GitHub Pages, Netlify, cPanel…)
export default defineConfig({
  base: './',
  plugins: [react(), tailwindcss()],
});
