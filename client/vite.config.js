import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import { qrcode } from 'vite-plugin-qrcode'
import tailwindcss from '@tailwindcss/vite' // Bunu ekledik

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // Tailwind'i buraya aldık
    qrcode(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Water Intake Reminder',
        short_name: 'WaterApp',
        theme_color: '#3b82f6',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' }
        ]
      }
    })
  ],
  server: {
    host: true
  }
})