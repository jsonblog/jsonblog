import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/dev-server.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: [
    'axios',
    'handlebars',
    'markdown-it',
    'pino',
    'pino-pretty',
    'rss',
    'slugify',
    'express',
    'chokidar',
    'ws',
  ],
});
