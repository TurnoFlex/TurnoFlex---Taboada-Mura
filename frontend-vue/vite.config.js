import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
 
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve('./src')
    }
  },
  test: {
    globals: true,
    environment: 'jsdom',
    environmentOptions: {
      jsdom: {
        url: 'http://localhost:3000/'
      }
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov', 'json', 'html'],
      reportsDirectory: './coverage',
      exclude: [
        '*.config.js',
        'src/main.js',
        'src/components/HelloWorld.vue',
        'node_modules/**',
        'dist/**'
      ],
      thresholds: {
        lines: 85,
        statements: 85,
        branches: 60,
        functions: 35
      }
    }
  }
})