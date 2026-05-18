import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        name: 'Baby Name Swipe',
        short_name: 'BabyNames',
        description: 'Find the perfect baby name together',
        theme_color: '#8b5cf6',
        background_color: '#fce7f3',
        display: 'standalone',
        scope: '/silver-robot/',
        start_url: '/silver-robot/',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,ico,woff2}'],
        navigateFallback: '/silver-robot/index.html',
        navigateFallbackAllowlist: [/^\/silver-robot/],
      },
    }),
  ],
  base: '/silver-robot/',
})
