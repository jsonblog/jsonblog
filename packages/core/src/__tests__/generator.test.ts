import * as path from 'path';
import { fileURLToPath } from 'url';
import { describe, expect, it } from 'vitest';
import { createGenerator } from '../generator';
import type { Blog, GeneratedFile } from '../types';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, 'fixtures');
const templatesDir = path.join(fixturesDir, 'templates');

const makeGen = (over: Partial<Parameters<typeof createGenerator>[0]> = {}) =>
  createGenerator({
    templatesDir,
    cssSourceFile: 'main.css',
    generatorName: '@jsonblog/test-theme',
    generatorVersion: '9.9.9',
    ...over,
  });

const blog: Blog = {
  site: { title: 'Test Blog', description: 'a test', url: 'https://test.dev' },
  basics: { name: 'Tester' },
  settings: { postsPerPage: 2 },
  posts: [
    {
      title: 'Newest',
      createdAt: '2026-03-03',
      content: '# Newest\n\nHello **world**.',
      tags: ['alpha', 'beta'],
      categories: ['news'],
    },
    { title: 'Middle', createdAt: '2026-02-02', content: 'Middle body', tags: ['alpha'] },
    { title: 'Oldest', createdAt: '2026-01-01', content: 'Oldest body' },
  ],
  pages: [
    { title: 'About', content: 'About me' },
    {
      title: 'Links',
      layout: 'grid',
      items: [{ title: 'GitHub', url: 'https://github.com' }],
    },
  ],
};

const asMap = (files: GeneratedFile[]) => new Map(files.map((f) => [f.name, f.content]));

describe('createGenerator', () => {
  it('emits the expected file set with directory URLs', async () => {
    const files = await makeGen()(blog, process.cwd());
    const m = asMap(files);
    // core pages
    expect(m.has('index.html')).toBe(true);
    expect(m.has('main.css')).toBe(true);
    expect(m.has('rss.xml')).toBe(true);
    expect(m.has('sitemap.xml')).toBe(true);
    // pretty per-post URLs
    expect(m.has('newest/index.html')).toBe(true);
    expect(m.has('oldest/index.html')).toBe(true);
    // pages, incl. grid
    expect(m.has('about/index.html')).toBe(true);
    expect(m.get('links/index.html')).toContain('href="https://github.com"');
    // tag + category pages
    expect(m.has('tag/alpha/index.html')).toBe(true);
    expect(m.has('category/news/index.html')).toBe(true);
  });

  it('paginates by settings.postsPerPage and mirrors page 1 as index', async () => {
    const m = asMap(await makeGen()(blog, process.cwd()));
    // 3 posts / 2 per page => 2 pages
    expect(m.has('page/1/index.html')).toBe(true);
    expect(m.has('page/2/index.html')).toBe(true);
    expect(m.has('page/3/index.html')).toBe(false);
    expect(m.get('index.html')).toBe(m.get('page/1/index.html'));
    // newest-first ordering: index links Newest before Middle
    const idx = m.get('index.html')!;
    expect(idx.indexOf('/newest/')).toBeLessThan(idx.indexOf('/middle/'));
  });

  it('strips the first post <h1> by default and keeps it when stripPostTitle is false', async () => {
    const kept = asMap(await makeGen({ stripPostTitle: false })(blog, process.cwd()));
    const stripped = asMap(await makeGen()(blog, process.cwd()));
    // fixture post.hbs renders its own <h1>{{post.title}}</h1>; content also has "# Newest"
    expect((kept.get('newest/index.html')!.match(/<h1>/g) || []).length).toBe(2);
    expect((stripped.get('newest/index.html')!.match(/<h1>/g) || []).length).toBe(1);
  });

  it('derives canonical URLs from blog.site.url in rss + sitemap', async () => {
    const m = asMap(await makeGen()(blog, process.cwd()));
    expect(m.get('rss.xml')).toContain('https://test.dev/rss.xml');
    expect(m.get('rss.xml')).toContain('https://test.dev/newest/');
    expect(m.get('sitemap.xml')).toContain('<loc>https://test.dev/</loc>');
    expect(m.get('sitemap.xml')).toContain('<loc>https://test.dev/newest/</loc>');
  });

  it('is deterministic — building the same blog twice is byte-identical', async () => {
    const gen = makeGen();
    const a = asMap(await gen(blog, process.cwd()));
    const b = asMap(await gen(blog, process.cwd()));
    for (const [name, content] of a) {
      expect(b.get(name)).toBe(content);
    }
  });

  it('applies a theme formatDate override', async () => {
    const m = asMap(
      await makeGen({ helpers: { formatDate: (d: string) => `[${d}]` } })(blog, process.cwd())
    );
    expect(m.get('index.html')).toContain('[2026-03-03]');
  });

  it('surfaces generator name/version to templates', async () => {
    const m = asMap(await makeGen()(blog, process.cwd()));
    expect(m.get('index.html')).toContain('@jsonblog/test-theme 9.9.9');
  });

  it('throws on invalid blog input', async () => {
    const gen = makeGen();
    // @ts-expect-error deliberately invalid
    await expect(gen({}, process.cwd())).rejects.toThrow();
  });

  it('loads post/page content from local `source` and grid items from `itemsSource`', async () => {
    const withSources: Blog = {
      site: { title: 'S', description: '', url: 'https://s.dev' },
      basics: { name: 'S' },
      posts: [{ title: 'Sourced', createdAt: '2026-01-01', source: './content.md' }],
      pages: [{ title: 'Grid', layout: 'grid', itemsSource: './items.json' }],
    };
    const m = asMap(await makeGen()(withSources, fixturesDir));
    expect(m.get('sourced/index.html')).toContain('Loaded from a <strong>source</strong>');
    expect(m.get('grid/index.html')).toContain('href="https://ext.example"');
  });

  it('renders an error placeholder when a non-grid item has no content', async () => {
    const empty: Blog = {
      site: { title: 'E', description: '' },
      basics: { name: 'E' },
      posts: [{ title: 'Empty', createdAt: '2026-01-01' }],
    };
    const m = asMap(await makeGen()(empty, process.cwd()));
    expect(m.get('empty/index.html')).toContain('Error: No content found');
  });

  it('omits sitemap <lastmod> and rss dates for undated posts (still deterministic)', async () => {
    const undated: Blog = {
      site: { title: 'U', description: '', url: 'https://u.dev' },
      basics: { name: 'U' },
      posts: [{ title: 'NoDate', content: 'body' }],
    };
    const gen = makeGen();
    const a = asMap(await gen(undated, process.cwd()));
    const b = asMap(await gen(undated, process.cwd()));
    expect(a.get('sitemap.xml')).not.toContain('<lastmod>');
    expect(a.get('rss.xml')).toBe(b.get('rss.xml')); // deterministic even with no dates
  });
});
