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
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vendor chunks - separate large libraries
          if (id.includes('node_modules')) {
            // React core
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'react-vendor';
            }
            // Supabase
            if (id.includes('@supabase')) {
              return 'supabase-vendor';
            }
            // Radix UI components
            if (id.includes('@radix-ui')) {
              return 'radix-vendor';
            }
            // Charts
            if (id.includes('recharts')) {
              return 'chart-vendor';
            }
            // Lucide icons
            if (id.includes('lucide-react')) {
              return 'icon-vendor';
            }
            // Vapi
            if (id.includes('@vapi-ai')) {
              return 'vapi-vendor';
            }
            // Other node_modules
            return 'vendor';
          }
        }
      }
    },
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 500,
    // Enable minification with esbuild (default, faster than terser)
    minify: 'esbuild',
    // Source map for production debugging
    sourcemap: false,
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

