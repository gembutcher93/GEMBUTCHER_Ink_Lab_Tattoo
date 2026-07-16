import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    // Forziamo Vite a non ottimizzare troppo aggressivamente queste librerie critiche
    include: ['three', '@react-three/fiber', '@react-three/drei', 'use-sync-external-store/shim/with-selector'],
    force: true
  },
  build: {
    commonjsOptions: {
      // Questo risolve l'errore del 'default export'
      transformMixedEsModules: true,
    },
  },
})