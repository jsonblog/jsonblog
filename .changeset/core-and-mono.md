---
"@jsonblog/core": minor
"@jsonblog/generator-mono": minor
---

Introduce `@jsonblog/core` — the shared generator engine (markdown pipeline, pagination, tag/category pages, RSS + sitemap, base helpers) behind a `createGenerator(theme)` contract — and `@jsonblog/generator-mono`, the "warm paper" editorial theme (graduated from the standalone `jsonblog-generator-mono`). All generators are now thin themes on core, each running in an isolated Handlebars environment.
