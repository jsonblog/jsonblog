# @jsonblog/generator-mono

## 0.3.0

### Minor Changes

- [`dbf9106`](https://github.com/jsonblog/jsonblog/commit/dbf910655032a864362bfa96ccc4b63385af1ecb) Thanks [@thomasdavis](https://github.com/thomasdavis)! - Introduce `@jsonblog/core` — the shared generator engine (markdown pipeline, pagination, tag/category pages, RSS + sitemap, base helpers) behind a `createGenerator(theme)` contract — and `@jsonblog/generator-mono`, the "warm paper" editorial theme (graduated from the standalone `jsonblog-generator-mono`). All generators are now thin themes on core, each running in an isolated Handlebars environment.

### Patch Changes

- Updated dependencies [[`dbf9106`](https://github.com/jsonblog/jsonblog/commit/dbf910655032a864362bfa96ccc4b63385af1ecb), [`dbf9106`](https://github.com/jsonblog/jsonblog/commit/dbf910655032a864362bfa96ccc4b63385af1ecb)]:
  - @jsonblog/core@1.1.0
  - @jsonblog/schema@3.2.0

## 0.2.0

### Minor Changes

- Graduated into the `jsonblog/jsonblog` monorepo as `@jsonblog/generator-mono` (from the standalone `jsonblog-generator-mono@0.2.0` that powered ajaxdavis.dev). Same warm-paper editorial theme; now built, tested, and released alongside the rest of the JsonBlog ecosystem.
