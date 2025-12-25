import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      manifest: {
        name: "Virus404 beats",
        short_name: "V404",
        description: "i make beat and mix music",
        theme_color: "rgba(218, 157, 157, 1)",//also used for splash screen
        icons: [
          {
            "src": "icons/V404_icon-48x48.png",
            "sizes": "48x48",
            "type": "image/png"
          },
          {
            "src": "icons/V404_icon-72x72.png",
            "sizes": "72x72",
            "type": "image/png"
          },
          {
            "src": "icons/V404_icon-96x96.png",
            "sizes": "96x96",
            "type": "image/png"
          },
          {
            "src": "icons/V404_icon-128x128.png",
            "sizes": "128x128",
            "type": "image/png"
          },
          {
            "src": "icons/V404_icon-144x144.png",
            "sizes": "144x144",
            "type": "image/png"
          },
          {
            "src": "icons/V404_icon-152x152.png",
            "sizes": "152x152",
            "type": "image/png"
          },
          {
            "src": "icons/V404_icon-192x192.png",
            "sizes": "192x192",
            "type": "image/png"
          },
          {
            "src": "icons/V404_icon-256x256.png",
            "sizes": "256x256",
            "type": "image/png"
          },
          {
            "src": "icons/V404_icon-384x384.png",
            "sizes": "384x384",
            "type": "image/png"
          },
          {
            "src": "icons/V404_icon-512x512.png",
            "sizes": "512x512",
            "type": "image/png"
          }
        ],//use https://pwa-icon-generator.vercel.app/ or something like that to create a zip file..keep icons in public folder
        start_url:".",
        display:"standalone"
      },
      workbox:{
        runtimeCaching:[
          {
            urlPattern:"*",
            handler:'CacheFirst'//cachefirst and network first
          }
        ]
      },
      registerType:'autoUpadate',
    })
  ],
})
