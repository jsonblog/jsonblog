# @jsonblog/markdown

The markdown pipeline for JsonBlog: markdown-it + optional Shiki highlighting + excerpts.

```ts
import { createMarkdownFor, render, excerpt } from '@jsonblog/markdown';
const md = await createMarkdownFor(allPostBodies); // loads Shiki only if there's code
const html = render(md, body);
const summary = excerpt(html, 160);
```
