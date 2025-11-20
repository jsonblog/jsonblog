import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  clean: true,
  external: [
    '@jsonblog/schema',
    '@jsonblog/generator-boilerplate',
    'commander',
    'fs-extra',
    'express',
    'chokidar',
    'pino',
    'pino-pretty',
    'chalk',
  ],
  banner: {
    js: '#!/usr/bin/env node',
  },
});
