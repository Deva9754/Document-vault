import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
    plugins: [
        react(),
        VitePWA({
            registerType: 'autoUpdate',
            manifest: {
                name: 'Document Vault',
                short_name: 'DocVault',
                description: 'Securely store and manage your important documents.',
                theme_color: '#6b5ca5',
                background_color: '#6b5ca5',
                display: 'standalone',
                start_url: '/',
                scope: '/',
                icons: [{
                        src: 'https://cdn.dribbble.com/userupload/37173060/file/original-171117241d9747c0989ed3d247aa9bfd.png?resize=1024x768&vertical=center',
                        sizes: '192x192',
                        type: 'image/png',
                    },
                    {
                        src: 'https://cdn.dribbble.com/userupload/37173060/file/original-171117241d9747c0989ed3d247aa9bfd.png?resize=1024x768&vertical=center',
                        sizes: '512x512',
                        type: 'image/png',
                    },
                ],
            },
        }),
    ],
})