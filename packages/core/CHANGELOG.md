# @jsonblog/core

## 1.0.0

### Major Changes

- Initial release. Extracts the shared generator engine that was previously duplicated across `@jsonblog/generator-boilerplate`, `@jsonblog/generator-tailwind`, and `@jsonblog/generator-mono` into one package. Generators become thin themes (templates + CSS + helper overrides) wired through `createGenerator`. Each generator now runs in an isolated Handlebars environment.
