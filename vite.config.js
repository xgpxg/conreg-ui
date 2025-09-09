import {defineConfig} from "vite";
import vue from "@vitejs/plugin-vue";
import {fileURLToPath, URL} from 'node:url'
import {createSvgIconsPlugin} from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig(async () => ({
    plugins: [vue(),
        createSvgIconsPlugin({
            // Specify the icon folder to be cached
            iconDirs: [fileURLToPath(new URL('./src/icons', import.meta.url))],
            // Specify symbolId format
            symbolId: 'icon-[dir]-[name]',
        }),
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            "@components": fileURLToPath(new URL('./src/components', import.meta.url)),
            "@images": fileURLToPath(new URL('./src/assets/images', import.meta.url)),
        }
    },
    server: {
        port: 9000,
        strictPort: true,
        proxy: {
            '/api/': {
                target: 'http://localhost:8000',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, "/")
            },
        }
    },
}));
