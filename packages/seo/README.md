# @jsonblog/seo

Complete, correct `<head>` metadata for a JsonBlog: canonical, Open Graph, Twitter cards, and JSON-LD (WebSite/BlogPosting).

```ts
import { seoHead } from '@jsonblog/seo';
const head = seoHead(blog, { kind: 'post', title: post.title, path: `/${post.slug}/`, datePublished: post.createdAt });
```

Drop `{{{seo}}}` in your `<head>` and get a perfect Lighthouse SEO score for free.
