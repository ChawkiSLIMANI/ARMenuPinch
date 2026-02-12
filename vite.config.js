import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    basicSsl()
  ],
  server: {
    host: '0.0.0.0', // Explicitly bind to all interfaces
    cors: true
  },
  optimizeDeps: {
    include: ['three', '@mediapipe/hands', '@mediapipe/camera_utils']
  }
});
