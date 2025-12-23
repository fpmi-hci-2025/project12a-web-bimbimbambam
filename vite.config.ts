import { defineConfig } from 'vite'
import type { Plugin } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { viteSingleFile } from "vite-plugin-singlefile"
import tailwindcss from '@tailwindcss/vite'

function removeVersionSpecifiers(): Plugin {
  const VERSION_PATTERN = /@\d+\.\d+\.\d+/;

  return {
    name: 'remove-version-specifiers',
    resolveId(id: string, importer) {
      if (VERSION_PATTERN.test(id)) {
        const cleanId = id.replace(VERSION_PATTERN, '');
        return this.resolve(cleanId, importer, { skipSelf: true });
      }
      return null;
    },
  }
}

function figmaAssetsResolver(): Plugin {
  const FIGMA_ASSETS_PREFIX = 'figma:asset/';

  return {
    name: 'figma-assets-resolver',
    resolveId(id: string) {
      if (id.startsWith(FIGMA_ASSETS_PREFIX)) {
        const assetPath = id.substring(FIGMA_ASSETS_PREFIX.length);
        return path.resolve(__dirname, './src/assets', assetPath);
      }
      return null;
    },
  };
}

const produceSingleFile = process.env.SINGLE_FILE === 'true';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    figmaAssetsResolver(),
    removeVersionSpecifiers(),
    ...(produceSingleFile ? [viteSingleFile()] : []),
  ],

  // 🔥🔥🔥 THIS FIXES CI HANG 🔥🔥🔥
  test: {
    environment: 'jsdom',

    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },

    testTimeout: 10000,
    hookTimeout: 10000,
  },
});
