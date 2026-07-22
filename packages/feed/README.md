# @jsonblog/feed

Deterministic RSS, sitemap, and robots.txt builders for JsonBlog.

```ts
import { buildRss, buildSitemap, buildRobots } from '@jsonblog/feed';
const rss = buildRss(blog, posts);
const sitemap = buildSitemap(blog, entries);
const robots = buildRobots(blog);
```
