import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import path from 'path'

export default defineConfig({
  plugins: [svelte()],
  resolve: {
    alias: {
      '@/app': path.resolve(__dirname, './src/app'),
      '@/core': path.resolve(__dirname, './src/core'),
      '@/infrastructure': path.resolve(__dirname, './src/infrastructure'),
      '@cook/shared': path.resolve(__dirname, '../../libs/shared')
    }
  }
})
