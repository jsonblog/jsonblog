import { createHash } from 'node:crypto';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildRobots, buildRss, buildSitemap, type SitemapEntry } from '@jsonblog/feed';
import { collectTerms, longFormDate, paginate, readingTime, slug as slugify } from '@jsonblog/helpers';
import { createMarkdownFor, excerpt as toExcerpt, render as renderMd, stripFirstH1 } from '@jsonblog/markdown';
import type { Blog } from '@jsonblog/schema';
import { type PostSummary, type PostView, renderDocument } from '@jsonblog/ui';
import { h } from 'preact';
import { chromeFrom, type HomeConfig, HomePage } from './home';
import { GridPage, IndexPage, PostPage, StaticPage, StyleguidePage, TagPage } from './pages';

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

export async function generate(blog: Blog, basePath: string): Promise<OutputFile[]> {
  if (!blog?.site?.title) throw new Error('blog.site.title is required');
  if (!blog?.basics?.name) throw new Error('blog.basics.name is required');

  const rawPosts = await Promise.all((blog.posts || []).map((p) => resolveRaw(p, basePath)));
  const rawPages = await Promise.all(
    (blog.pages || []).map((p) => resolveRaw(p as { content?: string; source?: string }, basePath))
  );
  const md = await createMarkdownFor([...rawPosts, ...rawPages]);

  const posts: PostView[] = (blog.posts || [])
    .map((p, i): PostView => {
      const rendered = rawPosts[i] ? stripFirstH1(renderMd(md, rawPosts[i])) : '';
      return {
        title: p.title,
        slug: slugify(p.title),
        html: rendered,
        excerpt: toExcerpt(rendered),
        date: p.createdAt,
        dateLabel: p.createdAt ? longFormDate(p.createdAt) : undefined,
        tags: p.tags,
        categories: p.categories,
        type: p.type,
        readingMinutes: readingTime(rendered),
      };
    })
    .sort((a, b) => new Date(b.date || '').getTime() - new Date(a.date || '').getTime());

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
  const chrome = chromeFrom(home, blog);

  const css = fs.readFileSync(path.join(PKG_ROOT, 'styles', 'theme.css'), 'utf8');
  const cssHash = createHash('sha256').update(css).digest('hex').slice(0, 8);
  const assets = {
    stylesheet: `/canvas.css?v=${cssHash}`,
    fonts: ['/fonts/source-serif-4.woff2', '/fonts/jetbrains-mono.woff2'],
  };

  const files: OutputFile[] = [];
  const html = (vnode: Parameters<typeof renderDocument>[0]) => renderDocument(vnode);

  // Paginated essay list at /page/N (page 1 = the full list).
  const perPage = blog.settings?.postsPerPage || 10;
  const paged = paginate(posts, perPage);
  for (const pg of paged) {
    const pagination = {
      page: pg.page,
      totalPages: pg.totalPages,
      prevHref: pg.prevPage ? `/page/${pg.prevPage}/` : undefined,
      nextHref: pg.nextPage ? `/page/${pg.nextPage}/` : undefined,
    };
    files.push({
      name: `page/${pg.page}/index.html`,
      content: html(
        h(IndexPage, {
          blog,
          chrome,
          seo: { kind: 'home', title: 'Essays', path: `/page/${pg.page}/` },
          assets,
          posts: pg.items.map(summary),
          pagination,
        })
      ),
    });
  }

  // Homepage: the rich editorial page when home.json is present, else the essay list.
  const homeNode = home
    ? h(HomePage, { blog, home, chrome, seo: { kind: 'home', title: blog.site.title, path: '/' }, assets })
    : h(IndexPage, {
        blog,
        chrome,
        seo: { kind: 'home', title: blog.site.title, path: '/' },
        assets,
        posts: (paged[0]?.items || []).map(summary),
        pagination: { page: 1, totalPages: paged.length, nextHref: paged.length > 1 ? '/page/2/' : undefined },
      });
  files.push({ name: 'index.html', content: html(homeNode) });

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

  // Styleguide.
  files.push({
    name: 'styleguide/index.html',
    content: html(
      h(StyleguidePage, { blog, chrome, seo: { kind: 'page', title: 'Styleguide', path: '/styleguide/' }, assets })
    ),
  });

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
    ...posts.map((p) => ({ path: `/${p.slug}/`, lastmod: p.date, changefreq: 'monthly', priority: 0.8 })),
    ...pages.map((p) => ({ path: `/${p.slug}/`, changefreq: 'monthly', priority: 0.6 })),
    ...[...tagMap.keys()].map((t) => ({ path: `/tag/${slugify(t)}/`, changefreq: 'weekly', priority: 0.5 })),
    ...[...catMap.keys()].map((c) => ({ path: `/category/${slugify(c)}/`, changefreq: 'weekly', priority: 0.5 })),
    ...paged.map((pg) => ({ path: `/page/${pg.page}/`, changefreq: 'daily', priority: 0.7 })),
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
