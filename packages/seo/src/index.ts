/**
 * @jsonblog/seo — canonical, Open Graph, Twitter, and JSON-LD for JsonBlog.
 *
 * A theme calls `seoHead(blog, ctx)` in its `<head>` and gets correct, complete
 * metadata for free. All values are escaped; JSON-LD is emitted as valid JSON.
 */
import type { Blog } from '@jsonblog/schema';

export type SeoKind = 'home' | 'post' | 'page';

export interface SeoContext {
  kind: SeoKind;
  /** Page title, without the site name. */
  title: string;
  description?: string;
  /** Path appended to `blog.site.url` for canonical/og:url, e.g. "/my-post/". */
  path?: string;
  /** Absolute URL or path to a representative image. */
  image?: string;
  datePublished?: string;
  dateModified?: string;
  /** Tags/keywords for the page. */
  tags?: string[];
}

export interface SeoOptions {
  /** theme-color for light/dark, e.g. ['#faf7f1', '#14130f']. */
  themeColor?: [string, string];
  /** Twitter @handle (without the @). */
  twitterSite?: string;
}

const escAttr = (s: string): string =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

const trimSlashes = (s: string): string => s.replace(/\/+$/, '');

/** Absolute URL for a path against the site origin (empty if the site has no url). */
export function absoluteUrl(blog: Blog, path = ''): string {
  const base = blog.site.url ? trimSlashes(blog.site.url) : '';
  if (!base) return '';
  if (!path || path === '/') return `${base}/`;
  return `${base}/${path.replace(/^\/+/, '')}`;
}

/** The full document title, e.g. "My Post — My Blog". */
export function pageTitle(blog: Blog, ctx: SeoContext): string {
  return ctx.kind === 'home' ? blog.site.title : `${ctx.title} — ${blog.site.title}`;
}

function description(blog: Blog, ctx: SeoContext): string {
  return ctx.description || blog.site.description || '';
}

function imageUrl(blog: Blog, ctx: SeoContext): string {
  const img = ctx.image || (blog.basics as { image?: string }).image;
  if (img) return img.startsWith('http') ? img : absoluteUrl(blog, img);
  return blog.site.url ? absoluteUrl(blog, 'og.png') : '';
}

/** `<meta>`/`<link>` tags: title, description, canonical, Open Graph, Twitter, author, theme-color. */
export function metaTags(blog: Blog, ctx: SeoContext, opts: SeoOptions = {}): string {
  const url = absoluteUrl(blog, ctx.path);
  const desc = description(blog, ctx);
  const img = imageUrl(blog, ctx);
  const author = (blog.basics as { name?: string }).name;
  const tags: string[] = [];
  const push = (t: string) => tags.push(`  ${t}`);

  push(`<title>${escAttr(pageTitle(blog, ctx))}</title>`);
  if (desc) push(`<meta name="description" content="${escAttr(desc)}">`);
  if (author) push(`<meta name="author" content="${escAttr(author)}">`);
  if (opts.themeColor) {
    push(`<meta name="theme-color" content="${opts.themeColor[0]}" media="(prefers-color-scheme: light)">`);
    push(`<meta name="theme-color" content="${opts.themeColor[1]}" media="(prefers-color-scheme: dark)">`);
  }
  if (url) push(`<link rel="canonical" href="${escAttr(url)}">`);

  push(`<meta property="og:site_name" content="${escAttr(blog.site.title)}">`);
  push(`<meta property="og:type" content="${ctx.kind === 'post' ? 'article' : 'website'}">`);
  push(`<meta property="og:title" content="${escAttr(ctx.kind === 'home' ? blog.site.title : ctx.title)}">`);
  if (desc) push(`<meta property="og:description" content="${escAttr(desc)}">`);
  if (url) push(`<meta property="og:url" content="${escAttr(url)}">`);
  if (img) push(`<meta property="og:image" content="${escAttr(img)}">`);

  push(`<meta name="twitter:card" content="${img ? 'summary_large_image' : 'summary'}">`);
  if (opts.twitterSite) push(`<meta name="twitter:site" content="@${escAttr(opts.twitterSite)}">`);
  push(`<meta name="twitter:title" content="${escAttr(ctx.kind === 'home' ? blog.site.title : ctx.title)}">`);
  if (desc) push(`<meta name="twitter:description" content="${escAttr(desc)}">`);
  if (img) push(`<meta name="twitter:image" content="${escAttr(img)}">`);

  return tags.join('\n');
}

/** JSON-LD structured data: `WebSite`+`Person` on the home page, `BlogPosting` per post. */
export function jsonLd(blog: Blog, ctx: SeoContext): string {
  const author = (blog.basics as { name?: string }).name;
  const person = author ? { '@type': 'Person', name: author } : undefined;
  let data: Record<string, unknown>;

  if (ctx.kind === 'post') {
    data = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: ctx.title,
      ...(absoluteUrl(blog, ctx.path) ? { url: absoluteUrl(blog, ctx.path) } : {}),
      ...(ctx.datePublished ? { datePublished: ctx.datePublished } : {}),
      ...(ctx.dateModified ? { dateModified: ctx.dateModified } : {}),
      ...(ctx.description ? { description: ctx.description } : {}),
      ...(ctx.tags?.length ? { keywords: ctx.tags.join(', ') } : {}),
      ...(person ? { author: person } : {}),
    };
  } else if (ctx.kind === 'home') {
    data = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: blog.site.title,
      ...(blog.site.url ? { url: absoluteUrl(blog) } : {}),
      ...(blog.site.description ? { description: blog.site.description } : {}),
      ...(person ? { author: person } : {}),
    };
  } else {
    return '';
  }
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/** Everything for the `<head>`: meta tags + JSON-LD. */
export function seoHead(blog: Blog, ctx: SeoContext, opts: SeoOptions = {}): string {
  const ld = jsonLd(blog, ctx);
  return `${metaTags(blog, ctx, opts)}${ld ? `\n  ${ld}` : ''}`;
}
