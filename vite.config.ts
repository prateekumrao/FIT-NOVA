// ========================================
// vite.config.ts
// Purpose: Vite build/dev-server settings. The React plugin enables JSX + fast refresh.
// ========================================
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
});
