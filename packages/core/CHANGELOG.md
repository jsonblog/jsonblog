# @jsonblog/core

## 1.1.0

### Minor Changes

- [`dbf9106`](https://github.com/jsonblog/jsonblog/commit/dbf910655032a864362bfa96ccc4b63385af1ecb) Thanks [@thomasdavis](https://github.com/thomasdavis)! - Introduce `@jsonblog/core` — the shared generator engine (markdown pipeline, pagination, tag/category pages, RSS + sitemap, base helpers) behind a `createGenerator(theme)` contract — and `@jsonblog/generator-mono`, the "warm paper" editorial theme (graduated from the standalone `jsonblog-generator-mono`). All generators are now thin themes on core, each running in an isolated Handlebars environment.

### Patch Changes

- Updated dependencies [[`dbf9106`](https://github.com/jsonblog/jsonblog/commit/dbf910655032a864362bfa96ccc4b63385af1ecb)]:
  - @jsonblog/schema@3.2.0

## 1.0.0

### Major Changes

- Initial release. Extracts the shared generator engine that was previously duplicated across `@jsonblog/generator-boilerplate`, `@jsonblog/generator-tailwind`, and `@jsonblog/generator-mono` into one package. Generators become thin themes (templates + CSS + helper overrides) wired through `createGenerator`. Each generator now runs in an isolated Handlebars environment.
