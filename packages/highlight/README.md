# @jsonblog/highlight

Build-time syntax highlighting for JsonBlog via [Shiki](https://shiki.style) — dual light/dark themes as CSS variables, zero runtime JS.

```ts
import { getHighlighter, highlightToHtml, containsCode } from '@jsonblog/highlight';
const hl = await getHighlighter();
const html = highlightToHtml(hl, 'const x = 1;', 'ts');
```
