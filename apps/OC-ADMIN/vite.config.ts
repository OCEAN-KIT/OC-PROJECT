import { defineConfig, loadEnv } from 'vite'
import type { PluginOption } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

import { visualizer } from 'rollup-plugin-visualizer'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

const appRoot = fileURLToPath(new URL('.', import.meta.url))
const sharedS3Upload = fileURLToPath(
  new URL('../../packages/shared-s3/src/upload.ts', import.meta.url),
)

const config = defineConfig(({ mode }) => {
  const env: Partial<Record<string, string>> = loadEnv(mode, appRoot, '')
  const apiBaseUrl = requireEnv(env, 'API_BASE_URL')
  const s3PublicBase = requireEnv(env, 'S3_PUBLIC_BASE')
  const shouldAnalyze = env.ANALYZE === 'true' || env.ANALYZE === '1'
  const plugins: PluginOption[] = [
    tanstackRouter({
      target: 'react',
    }),
    devtools(),
    tailwindcss(),
    visualizer(),
    viteReact(),
  ]

  if (shouldAnalyze) {
    plugins.push(createClientBundleVisualizer())
  }

  return {
    base: '/admin/',
    define: {
      'process.env.API_BASE_URL': JSON.stringify(apiBaseUrl),
      'process.env.S3_PUBLIC_BASE': JSON.stringify(s3PublicBase),
    },
    resolve: {
      tsconfigPaths: true,
      alias: [
        {
          find: '@ocean-kit/shared-s3/upload',
          replacement: sharedS3Upload,
        },
      ],
    },
    plugins,
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

function createClientBundleVisualizer(): PluginOption {
  return visualizer({
    filename: 'dist/bundle-stats.html',
    title: 'OC-ADMIN Client Bundle',
    template: 'treemap',
    gzipSize: true,
    brotliSize: true,
  }) as PluginOption
}
