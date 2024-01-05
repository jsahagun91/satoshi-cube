import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mempool: resolve(__dirname, 'mempool/mempool.html')
      }
    }
  },
  plugins: [
    VitePWA({
      // your PWA plugin configuration
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'], // Additional assets to cache
      manifest: {
        name: `Satoshi's Cube`,
        short_name: `Satoshi's Cube`,
        theme_color: '#000000',
        icons: [
          {
            src: '/public/android-chrome-192x192.png', // Path to your icons
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/public/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        "orientation": "portrait",
      },
    }),
  ],
}
