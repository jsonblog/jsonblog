import type { Blog } from '@jsonblog/schema';
import type { SeoContext } from '@jsonblog/seo';
import {
  Document,
  EntryList,
  type PaginationView,
  Pagination,
  PostArticle,
  type PostSummary,
  type PostView,
  Prose,
  SiteFooter,
  SiteHeader,
  type SiteView,
  TagList,
} from '@jsonblog/ui';
import type { ComponentChildren } from 'preact';

export interface Assets {
  /** Stylesheet href (content-hashed for cache-busting). */
  stylesheet: string;
  /** woff2 font URLs to preload. */
  fonts: string[];
}

const THEME_COLOR: [string, string] = ['#ffffff', '#101014'];

/** The shared page shell: <head> + masthead + main + footer. */
export function Page(props: {
  blog: Blog;
  site: SiteView;
  seo: SeoContext;
  assets: Assets;
  children: ComponentChildren;
}) {
  const { blog, site, seo, assets, children } = props;
  return (
    <Document
      blog={blog}
      seo={seo}
      seoOptions={{ themeColor: THEME_COLOR }}
      stylesheets={[assets.stylesheet]}
      preloadFonts={assets.fonts}
      bodyClass="canvas"
    >
      <div class="canvas-wrap">
        <SiteHeader site={site} />
        <main id="main">{children}</main>
        <SiteFooter site={site} />
      </div>
    </Document>
  );
}

export function IndexPage(props: {
  blog: Blog;
  site: SiteView;
  seo: SeoContext;
  assets: Assets;
  intro?: string;
  posts: PostSummary[];
  pagination: PaginationView;
}) {
  const { intro, posts, pagination, ...shell } = props;
  return (
    <Page {...shell}>
      {intro ? <p class="canvas-lede">{intro}</p> : null}
      <EntryList posts={posts} />
      <Pagination pagination={pagination} />
    </Page>
  );
}

export function PostPage(props: {
  blog: Blog;
  site: SiteView;
  seo: SeoContext;
  assets: Assets;
  post: PostView;
  newer?: PostSummary;
  older?: PostSummary;
}) {
  const { post, newer, older, ...shell } = props;
  return (
    <Page {...shell}>
      <PostArticle post={post} newer={newer} older={older} />
    </Page>
  );
}

export function StaticPage(props: {
  blog: Blog;
  site: SiteView;
  seo: SeoContext;
  assets: Assets;
  title: string;
  html: string;
}) {
  const { title, html, ...shell } = props;
  return (
    <Page {...shell}>
      <article class="canvas-page">
        <h1 class="canvas-page-title">{title}</h1>
        <Prose html={html} />
      </article>
    </Page>
  );
}

export interface GridItem {
  title: string;
  url?: string;
  description?: string;
  thumbnail?: string;
  image?: string;
  date?: string;
}

export function GridPage(props: {
  blog: Blog;
  site: SiteView;
  seo: SeoContext;
  assets: Assets;
  title: string;
  items: GridItem[];
}) {
  const { title, items, ...shell } = props;
  return (
    <Page {...shell}>
      <article class="canvas-page">
        <h1 class="canvas-page-title">{title}</h1>
        <ul class="canvas-grid">
          {items.map((it) => (
            <li key={it.url || it.title} class="canvas-grid-item">
              <a href={it.url || '#'} rel="noopener">
                {it.thumbnail || it.image ? (
                  <img
                    class="canvas-grid-thumb"
                    src={it.thumbnail || it.image}
                    alt=""
                    loading="lazy"
                  />
                ) : null}
                <span class="canvas-grid-title">{it.title}</span>
                {it.description ? <span class="canvas-grid-desc">{it.description}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </Page>
  );
}

export function TagPage(props: {
  blog: Blog;
  site: SiteView;
  seo: SeoContext;
  assets: Assets;
  term: string;
  kind: 'tag' | 'category';
  posts: PostSummary[];
}) {
  const { term, kind, posts, ...shell } = props;
  return (
    <Page {...shell}>
      <article class="canvas-page">
        <p class="canvas-term-kicker">{kind}</p>
        <h1 class="canvas-page-title">{term}</h1>
        <EntryList posts={posts} />
      </article>
    </Page>
  );
}

/** A living styleguide rendering every component with sample data. */
export function StyleguidePage(props: {
  blog: Blog;
  site: SiteView;
  seo: SeoContext;
  assets: Assets;
}) {
  const sample: PostSummary[] = [
    { title: 'On writing software and shitty poetry', slug: 'sample-a', date: '2026-07-01', dateLabel: 'July 1, 2026', tags: ['essays'] },
    { title: 'A shorter note', slug: 'sample-b', date: '2026-06-14', dateLabel: 'June 14, 2026' },
  ];
  const post: PostView = {
    title: 'The anatomy of a post',
    slug: 'sample-a',
    date: '2026-07-01',
    dateLabel: 'July 1, 2026',
    readingMinutes: 4,
    tags: ['essays', 'craft'],
    html: '<p>Body copy renders through <code>@jsonblog/markdown</code>. Long-form prose sits in a comfortable measure with balanced headings.</p><h2>A heading</h2><p>Another paragraph, with a <a href="#">link</a> and <strong>emphasis</strong>.</p><blockquote><p>A pull quote for rhythm.</p></blockquote><pre class="shiki"><code>const x = 42;</code></pre>',
  };
  const section = (title: string, children: ComponentChildren) => (
    <section class="sg-section">
      <h2 class="sg-title">{title}</h2>
      <div class="sg-demo">{children}</div>
    </section>
  );
  return (
    <Page {...props}>
      <div class="sg">
        <header class="sg-header">
          <h1 class="canvas-page-title">Styleguide</h1>
          <p class="canvas-lede">Every component in the Canvas theme, rendered from @jsonblog/ui.</p>
        </header>
        {section('Post index', <EntryList posts={sample} />)}
        {section('Pagination', <Pagination pagination={{ page: 2, totalPages: 5, prevHref: '/', nextHref: '/page/3/' }} />)}
        {section('Tags', <TagList tags={['essays', 'craft', 'software']} />)}
        {section('Article', <PostArticle post={post} newer={sample[0]} older={sample[1]} />)}
        {section(
          'Typography',
          <Prose html="<h1>Heading one</h1><h2>Heading two</h2><h3>Heading three</h3><p>Body text in the reading measure. The quick brown fox jumps over the lazy dog.</p><ul><li>List item one</li><li>List item two</li></ul>" />
        )}
      </div>
    </Page>
  );
}
