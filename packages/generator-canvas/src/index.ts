import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRobots, buildRss, buildSitemap, type SitemapEntry } from '@jsonblog/feed';
import { collectTerms, longFormDate, readingTime, slug as slugify } from '@jsonblog/helpers';
import { createMarkdownFor, excerpt as toExcerpt, render as renderMd, stripFirstH1 } from '@jsonblog/markdown';
import type { Blog } from '@jsonblog/schema';
import { type PostSummary, type PostView, renderDocument } from '@jsonblog/ui';
import { h } from 'preact';
import { chromeFrom, type HomeConfig, HomePage } from './home';
import { GridPage, ListPage, PostPage, StaticPage, StyleguidePage, TagPage } from './pages';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_ROOT = path.join(__dirname, '..');
const FONT_FILES = ['source-serif-4.woff2', 'source-serif-4-italic.woff2', 'jetbrains-mono.woff2'];

/** An output file: written from `content`, or copied verbatim from `copyFrom` (binary assets). */
export interface OutputFile {
  name: string;
  content?: string;
  copyFrom?: string;
}

async function fetchFile(uri: string, basePath: string): Promise<string | undefined> {
  try {
    if (uri.startsWith('http')) {
      const res = await fetch(uri);
      return res.ok ? await res.text() : undefined;
    }
    const file = path.resolve(basePath, uri.replace(/^\.\//, ''));
    return fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : undefined;
  } catch {
    return undefined;
  }
}

interface LoadedPage {
  title: string;
  slug: string;
  html: string;
  layout?: string;
  items?: unknown[];
}

async function resolveRaw(item: { content?: string; source?: string }, basePath: string): Promise<string> {
  if (item.source) {
    const fetched = await fetchFile(item.source, basePath);
    if (fetched) return fetched;
  }
  return item.content || '';
}

/** Human/AI provenance the author annotates at the top of a post. */
export interface Provenance {
  text?: string;
  code?: string;
}

const PROV_RE = /^\*\*(text|code):\*\*\s*(.+?)\s*$/i;
// A provenance *value* is a short token like "human", "AI", "Human-ish" — never a
// full sentence (some AI posts reuse `**text:**` as an in-body paragraph label).
const isProvToken = (v: string) => v.length <= 24 && v.split(/\s+/).length <= 3;

/**
 * Pull the leading `**text:** …` / `**code:** …` provenance block (the contiguous
 * run right after the H1) out of the raw markdown. Returns the cleaned body plus the
 * parsed provenance, so it renders as a byline instead of leaking into the excerpt.
 */
function extractProvenance(raw: string): { provenance?: Provenance; body: string } {
  const lines = raw.split(/\r?\n/);
  let i = 0;
  while (i < lines.length && lines[i].trim() === '') i++;
  if (i < lines.length && /^#\s/.test(lines[i])) {
    i++;
    while (i < lines.length && lines[i].trim() === '') i++;
  }
  const prov: Provenance = {};
  const remove = new Set<number>();
  for (let j = i; j < lines.length; j++) {
    const m = lines[j].match(PROV_RE);
    if (!m || !isProvToken(m[2])) break;
    prov[m[1].toLowerCase() as 'text' | 'code'] = m[2];
    remove.add(j);
  }
  if (!remove.size) return { body: raw };
  return { provenance: prov, body: lines.filter((_, idx) => !remove.has(idx)).join('\n') };
}

export async function generate(blog: Blog, basePath: string): Promise<OutputFile[]> {
  if (!blog?.site?.title) throw new Error('blog.site.title is required');
  if (!blog?.basics?.name) throw new Error('blog.basics.name is required');

  const rawPosts = await Promise.all((blog.posts || []).map((p) => resolveRaw(p, basePath)));
  const rawPages = await Promise.all(
    (blog.pages || []).map((p) => resolveRaw(p as { content?: string; source?: string }, basePath))
  );
  const parsedPosts = rawPosts.map(extractProvenance);
  const postBodies = parsedPosts.map((p) => p.body);
  const md = await createMarkdownFor([...postBodies, ...rawPages]);

  type PostViewX = PostView & { provenance?: Provenance };
  const posts: PostViewX[] = (blog.posts || [])
    .map((p, i): PostViewX => {
      const rendered = postBodies[i] ? stripFirstH1(renderMd(md, postBodies[i])) : '';
      return {
        title: p.title,
        // Explicit `slug` pins the URL (e.g. to keep an already-shared link stable
        // when the title changes); otherwise derive it from the title.
        slug: (p as { slug?: string }).slug || slugify(p.title),
        html: rendered,
        excerpt: toExcerpt(rendered),
        date: p.createdAt,
        dateLabel: p.createdAt ? longFormDate(p.createdAt) : undefined,
        tags: p.tags,
        categories: p.categories,
        type: p.type,
        provenance: parsedPosts[i].provenance,
        readingMinutes: readingTime(rendered),
      };
    })
    .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());

  // Human essays vs the AI-written devlog (weekly-activity posts carry type: 'ai').
  const essays = posts.filter((p) => p.type !== 'ai');
  const devlog = posts.filter((p) => p.type === 'ai');

  const pages: LoadedPage[] = await Promise.all(
    (blog.pages || []).map(async (p, i): Promise<LoadedPage> => {
      let items = p.items as unknown[] | undefined;
      if (p.itemsSource) {
        const raw = await fetchFile(p.itemsSource, basePath);
        if (raw) {
          try {
            items = JSON.parse(raw);
          } catch {
            /* keep inline items */
          }
        }
      }
      return {
        title: p.title,
        slug: slugify(p.title),
        html: rawPages[i] ? renderMd(md, rawPages[i]) : '',
        layout: p.layout,
        items,
      };
    })
  );

  const summary = (p: PostView): PostSummary => ({
    title: p.title,
    slug: p.slug,
    date: p.date,
    dateLabel: p.dateLabel,
    tags: p.tags,
    type: p.type,
  });

  // Optional rich homepage config (home.json alongside blog.json).
  let home: HomeConfig | undefined;
  const homePath = path.join(basePath, 'home.json');
  if (fs.existsSync(homePath)) {
    try {
      home = JSON.parse(fs.readFileSync(homePath, 'utf8'));
    } catch {
      /* ignore malformed home.json */
    }
  }
  if (home?.hero && !home.hero.lastUpdated) home.hero.lastUpdated = posts[0]?.dateLabel;
  const chrome = chromeFrom(home, blog);

  const css = fs.readFileSync(path.join(PKG_ROOT, 'styles', 'theme.css'), 'utf8');
  const cssHash = createHash('sha256').update(css).digest('hex').slice(0, 8);
  const assets = {
    stylesheet: `/canvas.css?v=${cssHash}`,
    fonts: ['/fonts/source-serif-4.woff2', '/fonts/jetbrains-mono.woff2'],
  };

  const files: OutputFile[] = [];
  const html = (vnode: Parameters<typeof renderDocument>[0]) => renderDocument(vnode);

  // Homepage: the rich editorial page when home.json is present, else the essay list.
  const featured = essays[0]
    ? { title: essays[0].title, summary: essays[0].excerpt, href: `/${essays[0].slug}/` }
    : undefined;
  const homeNode = home
    ? h(HomePage, {
        blog,
        home,
        chrome,
        seo: { kind: 'home', title: blog.site.title, path: '/' },
        assets,
        featured,
        essays: essays.slice(0, 6).map(summary),
        devlog: devlog.slice(0, 8).map(summary),
      })
    : h(ListPage, {
        blog,
        chrome,
        seo: { kind: 'home', title: blog.site.title, path: '/' },
        assets,
        title: blog.site.title,
        posts: posts.map(summary),
      });
  files.push({ name: 'index.html', content: html(homeNode) });

  // Essays (human) + devlog (AI) list pages.
  files.push({
    name: 'essays/index.html',
    content: html(
      h(ListPage, {
        blog,
        chrome,
        seo: { kind: 'page', title: 'Essays', path: '/essays/' },
        assets,
        title: 'Essays',
        note: 'Longer pieces — written by a human.',
        posts: essays.map(summary),
      })
    ),
  });
  if (devlog.length) {
    files.push({
      name: 'devlog/index.html',
      content: html(
        h(ListPage, {
          blog,
          chrome,
          seo: { kind: 'page', title: 'The devlog', path: '/devlog/' },
          assets,
          title: 'The devlog',
          note: 'Written by AI — an autonomous log of what shipped each week. Not human essays.',
          posts: devlog.map(summary),
        })
      ),
    });
  }

  // Posts.
  posts.forEach((post, i) => {
    files.push({
      name: `${post.slug}/index.html`,
      content: html(
        h(PostPage, {
          blog,
          chrome,
          seo: {
            kind: 'post',
            title: post.title,
            path: `/${post.slug}/`,
            description: post.excerpt,
            datePublished: post.date,
            tags: post.tags,
          },
          assets,
          post,
          provenance: post.provenance,
          newer: posts[i - 1] ? summary(posts[i - 1]) : undefined,
          older: posts[i + 1] ? summary(posts[i + 1]) : undefined,
        })
      ),
    });
  });

  // Static + grid pages.
  for (const pg of pages) {
    const seo = { kind: 'page' as const, title: pg.title, path: `/${pg.slug}/`, description: toExcerpt(pg.html) };
    const node =
      pg.layout === 'grid'
        ? h(GridPage, { blog, chrome, seo, assets, title: pg.title, items: (pg.items || []) as never[] })
        : h(StaticPage, { blog, chrome, seo, assets, title: pg.title, html: pg.html });
    files.push({ name: `${pg.slug}/index.html`, content: html(node) });
  }

  // Tag + category archives.
  const renderTerms = (map: Map<string, PostView[]>, kind: 'tag' | 'category') => {
    for (const [term, termPosts] of map) {
      const tslug = slugify(term);
      files.push({
        name: `${kind}/${tslug}/index.html`,
        content: html(
          h(TagPage, {
            blog,
            chrome,
            seo: { kind: 'page' as const, title: `${kind}: ${term}`, path: `/${kind}/${tslug}/` },
            assets,
            term,
            kind,
            posts: termPosts.map(summary),
          })
        ),
      });
    }
  };
  const tagMap = collectTerms(posts, (p) => p.tags);
  const catMap = collectTerms(posts, (p) => p.categories);
  renderTerms(tagMap, 'tag');
  renderTerms(catMap, 'category');

  // Styleguide — theme-dev component gallery; opt-in via home.styleguide.
  if (home?.styleguide) {
    files.push({
      name: 'styleguide/index.html',
      content: html(
        h(StyleguidePage, { blog, chrome, seo: { kind: 'page', title: 'Styleguide', path: '/styleguide/' }, assets })
      ),
    });
  }

  // Feed / sitemap / robots.
  const feedItems = posts.map((p) => ({
    title: p.title,
    slug: p.slug,
    description: p.excerpt,
    content: p.html,
    createdAt: p.date,
    tags: p.tags,
    categories: p.categories,
  }));
  files.push({ name: 'rss.xml', content: buildRss(blog, feedItems) });

  const sitemapEntries: SitemapEntry[] = [
    { path: '/', changefreq: 'daily', priority: 1 },
    { path: '/essays/', changefreq: 'weekly', priority: 0.7 },
    ...(devlog.length ? [{ path: '/devlog/', changefreq: 'daily', priority: 0.7 }] : []),
    ...posts.map((p) => ({ path: `/${p.slug}/`, lastmod: p.date, changefreq: 'monthly', priority: 0.8 })),
    ...pages.map((p) => ({ path: `/${p.slug}/`, changefreq: 'monthly', priority: 0.6 })),
    ...[...tagMap.keys()].map((t) => ({ path: `/tag/${slugify(t)}/`, changefreq: 'weekly', priority: 0.5 })),
    ...[...catMap.keys()].map((c) => ({ path: `/category/${slugify(c)}/`, changefreq: 'weekly', priority: 0.5 })),
  ];
  files.push({ name: 'sitemap.xml', content: buildSitemap(blog, sitemapEntries) });
  files.push({ name: 'robots.txt', content: buildRobots(blog) });

  // CSS + fonts.
  files.push({ name: 'canvas.css', content: css });
  for (const f of FONT_FILES) files.push({ name: `fonts/${f}`, copyFrom: path.join(PKG_ROOT, 'fonts', f) });

  return files;
}

export const generateBlog = generate;
export default generate;
export type { Assets } from './home';
