import { defineConfig, loadEnv } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const config = defineConfig(({ mode }) => {
  const env: Record<string, string | undefined> = loadEnv(
    mode,
    process.cwd(),
    '',
  )

  return {
    define: {
      'process.env.NEXT_PUBLIC_API_BASE_URL': JSON.stringify(
        env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:4000',
      ),
    },
    resolve: { tsconfigPaths: true },
    plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact()],
  }
})

export default config
