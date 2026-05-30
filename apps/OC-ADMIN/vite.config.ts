import { defineConfig, loadEnv } from 'vite'
import type { PluginOption } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

import { visualizer } from 'rollup-plugin-visualizer'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig(({ mode }) => {
  const env: Partial<Record<string, string>> = loadEnv(mode, process.cwd(), '')
  const apiBaseUrl =
    env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000'
  const s3PublicBase = env.NEXT_PUBLIC_S3_PUBLIC_BASE || ''
  const shouldAnalyze = env.ANALYZE === 'true' || env.ANALYZE === '1'
  const plugins: PluginOption[] = [
    tanstackRouter({
      target: 'react',
    }),
    devtools(),
    tailwindcss(),
    viteReact(),
  ]

  if (shouldAnalyze) {
    plugins.push(createClientBundleVisualizer())
  }

  return {
    define: {
      'process.env.NEXT_PUBLIC_API_BASE_URL': JSON.stringify(apiBaseUrl),
      'process.env.NEXT_PUBLIC_S3_PUBLIC_BASE': JSON.stringify(s3PublicBase),
    },
    resolve: { tsconfigPaths: true },
    build: {
      sourcemap: shouldAnalyze,
    },
    plugins,
  }
})

export default config

function createClientBundleVisualizer(): PluginOption {
  return visualizer({
    filename: 'dist/bundle-stats.html',
    title: 'OC-ADMIN Client Bundle',
    template: 'treemap',
    gzipSize: true,
    brotliSize: true,
  }) as PluginOption
}
