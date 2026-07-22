import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['preact', 'preact/jsx-runtime', 'preact-render-to-string', '@jsonblog/seo', '@jsonblog/helpers', '@jsonblog/schema'],
  esbuildOptions(o) {
    o.jsx = 'automatic';
    o.jsxImportSource = 'preact';
  },
});
