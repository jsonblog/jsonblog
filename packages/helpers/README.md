# @jsonblog/helpers

Handlebars helpers and content utilities for JsonBlog theme authors: dates, slugs, reading time, JSON-LD escaping, and comparison/logic helpers.

```ts
import { registerHelpers, readingTime, slug } from '@jsonblog/helpers';
registerHelpers(Handlebars); // formatDate, isoDate, slugify, readingTime, eq, gt, or, and, json, ...
```
