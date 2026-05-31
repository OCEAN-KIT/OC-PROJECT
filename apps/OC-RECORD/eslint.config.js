// @ts-check

import { tanstackConfig } from '@tanstack/eslint-config'

export default [
  ...tanstackConfig,
  {
    ignores: [
      'node_modules/**',
      'dist/**',
      '.next/**',
      'middleware.ts',
      'next-env.d.ts',
      'public/**',
      'routeTree.gen.ts',
    ],
  },
  {
    plugins: {
      'react-hooks': {
        rules: {
          'exhaustive-deps': {
            meta: {
              schema: [],
            },
            create: () => ({}),
          },
        },
      },
    },
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-imports': 'off',
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      'import/no-cycle': 'off',
      'import/consistent-type-specifier-style': 'off',
      'import/order': 'off',
      'no-unused-vars': 'off',
      'pnpm/json-enforce-catalog': 'off',
      'react-hooks/exhaustive-deps': 'off',
      'sort-imports': 'off',
      '@stylistic/spaced-comment': 'off',
    },
  },
]
