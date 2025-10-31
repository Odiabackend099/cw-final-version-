import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import sourceIdentifierPlugin from 'vite-plugin-source-identifier'

const isProd = process.env.BUILD_MODE === 'prod'
const isTestMode = process.env.TEST_MODE === 'true'

export default defineConfig({
  plugins: [
    react(), 
    sourceIdentifierPlugin({
      enabled: !isProd,
      attributePrefix: 'data-matrix',
      includeProps: true,
    })
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: isTestMode ? '0.0.0.0' : true, // Allow external connections when testing
    port: 5173,
    strictPort: true,
    hmr: {
      // For TestSprite tunnel, disable HMR WebSocket or configure for tunnel
      ...(isTestMode ? { clientPort: 5173 } : {}),
    },
    // Allow CORS for tunnel access
    cors: isTestMode ? true : undefined,
    // Increase timeouts for tunnel connections
    watch: {
      usePolling: isTestMode ? false : undefined,
    },
  },
  preview: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    cors: true,
  },
})

