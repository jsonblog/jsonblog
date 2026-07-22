import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    // Integration tests spawn the built CLI (which loads the generator + Shiki).
    testTimeout: 30000,
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text-summary', 'json-summary'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/__tests__/**', 'src/dev-server.ts'],
    },
  },
});
