/**
 * @jsonblog/feed — RSS, sitemap, and robots.txt for JsonBlog.
 *
 * All builders are deterministic: dates come from content (never `new Date()`),
 * so building the same blog twice produces byte-identical output.
 */
import type { Blog } from '@jsonblog/schema';
import RSS from 'rss';

export interface FeedItem {
  title: string;
  slug?: string;
  description?: string;
  excerpt?: string;
  content?: string;
  createdAt?: string;
  updatedAt?: string;
  tags?: string[];
  categories?: string[];
}

const trimSlashes = (s: string): string => s.replace(/\/+$/, '');

/** Resolve the canonical site origin from a blog. */
export function siteUrlOf(blog: Blog): string {
  return trimSlashes(blog.site.url || '');
}

const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '').trim();

/** Build an RSS 2.0 feed. Deterministic — no build-time timestamps. */
export function buildRss(blog: Blog, posts: FeedItem[], opts: { limit?: number } = {}): string {
  const siteUrl = siteUrlOf(blog);
  const feedPubDate = posts.find((p) => p.createdAt)?.createdAt;

  const feed = new RSS({
    title: blog.site.title,
    description: blog.site.description,
    generator: 'JsonBlog Generator',
    feed_url: `${siteUrl}/rss.xml`,
    site_url: siteUrl,
    image_url: (blog.basics as { image?: string }).image,
    language: 'en',
    ...(feedPubDate ? { pubDate: feedPubDate } : {}),
    ttl: 60,
  });

  for (const post of posts.slice(0, opts.limit ?? 20)) {
    const plain = post.content ? stripHtml(post.content) : '';
    const desc =
      post.description ||
      post.excerpt ||
      plain.substring(0, 200) + (plain.length > 200 ? '...' : '');
    const item: Record<string, unknown> = {
      title: post.title,
      description: desc,
      url: `${siteUrl}/${post.slug}/`,
      guid: `${siteUrl}/${post.slug}/`,
      categories: [...(post.tags || []), ...(post.categories || [])],
    };
    if (post.createdAt) item.date = post.createdAt;
    feed.item(item as unknown as Parameters<typeof feed.item>[0]);
  }

  // The rss library injects a non-deterministic <lastBuildDate>; pin it (or drop it).
  const xml = feed.xml({ indent: true });
  return feedPubDate
    ? xml.replace(
        /<lastBuildDate>[^<]*<\/lastBuildDate>/,
        `<lastBuildDate>${new Date(feedPubDate).toUTCString()}</lastBuildDate>`
      )
    : xml.replace(/<lastBuildDate>[^<]*<\/lastBuildDate>\s*/, '');
}

export interface SitemapEntry {
  /** Path relative to the site origin, e.g. "/my-post/". */
  path: string;
  lastmod?: string;
  changefreq?: string;
  priority?: number;
}

/** Build a sitemap.xml from a set of entries. */
export function buildSitemap(blog: Blog, entries: SitemapEntry[]): string {
  const siteUrl = siteUrlOf(blog);
  const urls = entries.map((e) => {
    const loc = `${siteUrl}${e.path.startsWith('/') ? e.path : `/${e.path}`}`;
    const lastmod = e.lastmod ? `\n    <lastmod>${e.lastmod}</lastmod>` : '';
    const changefreq = e.changefreq ? `\n    <changefreq>${e.changefreq}</changefreq>` : '';
    const priority = e.priority != null ? `\n    <priority>${e.priority.toFixed(1)}</priority>` : '';
    return `  <url>\n    <loc>${loc}</loc>${lastmod}${changefreq}${priority}\n  </url>`;
  });
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
}

/** Build a robots.txt (with a Sitemap pointer when the site has a url). */
export function buildRobots(blog: Blog): string {
  const siteUrl = siteUrlOf(blog);
  return `User-agent: *\nAllow: /\n${siteUrl ? `\nSitemap: ${siteUrl}/sitemap.xml\n` : ''}`;
}
