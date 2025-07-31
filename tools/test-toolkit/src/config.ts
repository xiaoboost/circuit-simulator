import { defineConfig as VitestDefineConfig, ViteUserConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import * as path from 'path';

export const defineConfig = (config?: ViteUserConfig) => {
  return VitestDefineConfig({
    ...config,
    plugins: [react(), ...(config?.plugins ?? [])],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: path.resolve(import.meta.dirname, './setup.js'),
      include: ['tests/**/*.test.ts', 'tests/**/*.spec.ts'],
      ...config?.test,
    },
  });
};
