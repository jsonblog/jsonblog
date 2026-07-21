# Architecture

JsonBlog is a small ecosystem for turning a single `blog.json` into a static site. It's a pnpm + Turborepo monorepo.

## Packages

```
@jsonblog/schema ──┐
                   ├─▶ @jsonblog/core ─▶ generator-{boilerplate,tailwind,mono} ─▶ @jsonblog/cli ─▶ @jsonblog/homepage
@jsonblog/tsconfig (dev-time config, everywhere)
```

| Package | Kind | Role |
|---|---|---|
| `@jsonblog/schema` | public lib | The `blog.json` schema (Zod) + `validateBlog`. Single source of truth for the data model. |
| `@jsonblog/core` | public lib | The **engine**: markdown pipeline, pagination, tag/category pages, RSS + sitemap, base Handlebars helpers, and the `createGenerator(theme)` contract. |
| `@jsonblog/generator-boilerplate` | public lib | Minimal starter theme (hand-written CSS). |
| `@jsonblog/generator-tailwind` | public lib | Tailwind theme. |
| `@jsonblog/generator-mono` | public lib | "Warm paper" editorial theme (powers ajaxdavis.dev). |
| `@jsonblog/tsconfig` | internal | Shared TypeScript base config. |
| `@jsonblog/cli` | public app | `jsonblog init/validate/build/serve/watch/dev`. Loads a generator, validates, writes files. |
| `@jsonblog/homepage` | private app | The jsonblog.dev marketing site + generator marketplace (Next.js, Vercel). |

The layering is acyclic. Generators depend only on `core` (+ `schema` for types); the CLI depends on the generators; nothing depends "up".

## The generator contract

A **generator** is a theme: templates + CSS + optional helper overrides. All engine logic lives in `@jsonblog/core`; a generator is built with `createGenerator`:

```ts
import { createGenerator } from '@jsonblog/core';

export const generateBlog = createGenerator({
  templatesDir,             // dir of *.hbs templates + the stylesheet
  cssSourceFile: 'main.css',// emitted as /main.css
  generatorName, generatorVersion,
  helpers: { /* e.g. formatDate */ },
  stripPostTitle: true,     // strip the first <h1> from post markdown
});
```

`generateBlog(blog, basePath, config?)` returns `{ name, content }[]` — the file set to write. **The engine never touches disk**; the CLI owns I/O. Each generator runs in an isolated Handlebars environment, so helpers/partials never leak between themes.

Templates: `layout.hbs`, `index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `category.hbs`, and optional `page-grid.hbs`. Pages use `{{#> layout}}{{#*inline "content"}}…{{/inline}}{{/layout}}`.

## Invariants

- **Pretty URLs**: every page is `slug/index.html` (works on any static host).
- **Deterministic builds**: building the same `blog.json` twice is byte-identical (no `new Date()` in output).
- **Canonical origin**: `blog.site.url` drives canonical `<link>`, OG, RSS and sitemap URLs.

## Tooling

pnpm workspaces · Turborepo (`build`/`typecheck`/`test`/`lint`) · tsup (dual ESM+CJS + types) · Vitest · Biome · Changesets + npm OIDC Trusted Publishing (provenance) · publint + are-the-types-wrong on publish.
