# @jsonblog/core

> The shared engine that powers every [JsonBlog](https://jsonblog.dev) generator.

`@jsonblog/core` contains the markdown → HTML pipeline, pagination, tag/category pages, RSS + sitemap generation, and the base Handlebars helper set. A **generator** (theme) is just templates + CSS + optional helper overrides wired through `createGenerator`.

## The generator contract

```ts
import { createGenerator } from '@jsonblog/core';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generateBlog = createGenerator({
  templatesDir: path.join(__dirname, '../templates'),
  cssSourceFile: 'main.css', // stylesheet inside templatesDir, emitted as main.css
  generatorName: '@you/my-theme',
  generatorVersion: '1.0.0',
  // helpers: { formatDate: (d) => ... }  // override any base helper
});

export default generateBlog;
```

`createGenerator` returns the standard `generateBlog(blog, basePath, config?) => Promise<{ name, content }[]>`. The engine returns the file set; the CLI owns writing to disk.

## Templates

Each theme's `templates/` supplies: `layout.hbs`, `index.hbs`, `post.hbs`, `page.hbs`, `tag.hbs`, `category.hbs`, and (optionally) `page-grid.hbs` for `layout: "grid"` pages. Each generator runs in an **isolated Handlebars environment**, so helpers and partials never leak between themes sharing a process.

## Base helpers

`formatDate` (long-form; override for other formats), `slugify`, `eq`, `add`, `subtract`, `multiply`, `gt`, `lt`.

## License

MIT
