import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path'

export default {
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        mempool: resolve(__dirname, 'mempool/index.html')
      }
    }
  },
  plugins: [
    VitePWA({
      // your PWA plugin configuration
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'robots.txt'], // Additional assets to cache
      manifest: {
        name: "Timechain Cube",
        short_name: "Timechain Cube",
        description: "Bitcoin data displayed on beautifully rotating cube.",
        "display": "standalone",
        theme_color: '#000000',
        icons: [
          {
            src: '/android-chrome-192x192.png', // Path to your icons
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/android-chrome-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
        ],
        "orientation": "portrait",
      },
    }),
  ],
}
