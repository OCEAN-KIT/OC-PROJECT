import { defineConfig, loadEnv } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'

const appRoot = fileURLToPath(new URL('.', import.meta.url))
const sourceRoot = fileURLToPath(new URL('./src', import.meta.url))

const config = defineConfig(({ mode }) => {
  const env: Partial<Record<string, string>> = {
    ...loadEnv(mode, sourceRoot, ''),
    ...loadEnv(mode, appRoot, ''),
    ...process.env,
  }

  return {
    base: '/record/',
    define: {
      'process.env.NEXT_PUBLIC_API_BASE_URL': JSON.stringify(
        env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
      ),
      'process.env.NEXT_PUBLIC_S3_PUBLIC_BASE': JSON.stringify(
        env.NEXT_PUBLIC_S3_PUBLIC_BASE ?? '',
      ),
    },
    resolve: {
      alias: [
        { find: /^#\//, replacement: `${sourceRoot}/` },
        { find: /^@\//, replacement: `${sourceRoot}/` },
        {
          find: 'next/navigation',
          replacement: `${sourceRoot}/shared/next-compat/navigation.ts`,
        },
        {
          find: 'next/link',
          replacement: `${sourceRoot}/shared/next-compat/link.tsx`,
        },
      ],
    },
    plugins: [
      tanstackRouter({
        target: 'react',
        autoCodeSplitting: true,
      }),
      tailwindcss(),
      viteReact(),
      VitePWA({
        base: '/record/',
        scope: '/record/',
        filename: 'sw.js',
        injectRegister: false,
        manifest: false,
        registerType: 'autoUpdate',
        workbox: {
          cleanupOutdatedCaches: true,
          clientsClaim: true,
          inlineWorkboxRuntime: true,
          skipWaiting: true,
          globPatterns: ['**/*.{js,css,html,png,svg,ico,webmanifest}'],
          navigateFallback: '/record/index.html',
          navigateFallbackDenylist: [/^\/api\//],
        },
      }),
    ],
  }
})

export default config
