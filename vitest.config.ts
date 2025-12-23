import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      // @radix-ui/*
      {
        find: /(@radix-ui\/[^@]+)@\d+\.\d+\.\d+/,
        replacement: '$1',
      },
      // lucide-react
      {
        find: /lucide-react@\d+\.\d+\.\d+/,
        replacement: 'lucide-react',
      },
      // class-variance-authority
      {
        find: /class-variance-authority@\d+\.\d+\.\d+/,
        replacement: 'class-variance-authority',
      },
      // next-themes
      {
        find: /next-themes@\d+\.\d+\.\d+/,
        replacement: 'next-themes',
      },
      // sonner
      {
        find: /sonner@\d+\.\d+\.\d+/,
        replacement: 'sonner',
      },
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.ts',
  },
})
