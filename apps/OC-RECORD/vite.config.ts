import { defineConfig, loadEnv } from 'vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { fileURLToPath } from 'node:url'

const appRoot = fileURLToPath(new URL('.', import.meta.url))
const sourceRoot = fileURLToPath(new URL('./src', import.meta.url))

const config = defineConfig(({ mode }) => {
  const env: Partial<Record<string, string>> = loadEnv(mode, appRoot, '')
  const apiBaseUrl = requireEnv(env, 'API_BASE_URL')
  const s3PublicBase = requireEnv(env, 'S3_PUBLIC_BASE')

  return {
    base: '/record/',
    define: {
      'process.env.API_BASE_URL': JSON.stringify(apiBaseUrl),
      'process.env.S3_PUBLIC_BASE': JSON.stringify(s3PublicBase),
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

function requireEnv(env: Partial<Record<string, string>>, name: string) {
  const value = env[name]

  if (!value) {
    throw new Error(`Missing required env: ${name}`)
  }

  return value
}
