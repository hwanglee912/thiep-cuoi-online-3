import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { weddingData } from './src/config/weddingData.js'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), {
    name: 'preload-wedding-photo',
    transformIndexHtml() {
      return [
        { tag: 'link', attrs: { rel: 'preload', as: 'image', href: weddingData.couple.heroImage, fetchpriority: 'high' }, injectTo: 'head' },
        ...['playfair-display-0.woff2', 'playfair-display-1.woff2'].map((font) => ({
          tag: 'link', attrs: { rel: 'preload', as: 'font', type: 'font/woff2', crossorigin: '', href: `/assets/fonts/${font}` }, injectTo: 'head',
        })),
      ]
    },
  }],
  server: {
    port: 3000,
    open: false
  }
})
