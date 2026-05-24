import { defineConfig, loadEnv } from 'vite'
import type { PluginOption } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import { visualizer } from 'rollup-plugin-visualizer'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig(({ mode }) => {
  const env: Record<string, string | undefined> = loadEnv(
    mode,
    process.cwd(),
    '',
  )
  const shouldAnalyze = env.ANALYZE === 'true' || env.ANALYZE === '1'

  return {
    define: {
      'process.env.NEXT_PUBLIC_API_BASE_URL': JSON.stringify(
        env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
      ),
      'process.env.NEXT_PUBLIC_S3_PUBLIC_BASE': JSON.stringify(
        env.NEXT_PUBLIC_S3_PUBLIC_BASE ?? '',
      ),
    },
    resolve: { tsconfigPaths: true },
    build: {
      sourcemap: shouldAnalyze,
    },
    plugins: [
      devtools(),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      shouldAnalyze && createClientBundleVisualizer(),
    ].filter(Boolean),
  }
})

export default config

function createClientBundleVisualizer(): PluginOption {
  return Object.assign(
    visualizer({
      filename: 'dist/client/bundle-stats.html',
      title: 'OC-ADMIN Client Bundle',
      template: 'treemap',
      gzipSize: true,
      brotliSize: true,
    }),
    {
      applyToEnvironment: (environment) => environment.name === 'client',
    } satisfies Pick<NonNullable<PluginOption>, 'applyToEnvironment'>,
  )
}
