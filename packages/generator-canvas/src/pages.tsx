import type { Blog } from '@jsonblog/schema';
import type { SeoContext } from '@jsonblog/seo';
import {
  EntryList,
  type PaginationView,
  Pagination,
  PostArticle,
  type PostSummary,
  type PostView,
  Prose,
  TagList,
} from '@jsonblog/ui';
import type { ComponentChildren } from 'preact';
import { type Assets, type Chrome, Shell } from './home';

export type { Assets } from './home';

interface Common {
  blog: Blog;
  chrome: Chrome;
  seo: SeoContext;
  assets: Assets;
}

export function IndexPage(props: Common & { posts: PostSummary[]; pagination: PaginationView }) {
  const { posts, pagination, ...shell } = props;
  return (
    <Shell {...shell}>
      <div class="ed-list">
        <span class="ed-label">Essays</span>
        <EntryList posts={posts} />
        <Pagination pagination={pagination} />
      </div>
    </Shell>
  );
}

export function PostPage(props: Common & { post: PostView; newer?: PostSummary; older?: PostSummary }) {
  const { post, newer, older, ...shell } = props;
  return (
    <Shell {...shell}>
      <PostArticle post={post} newer={newer} older={older} />
    </Shell>
  );
}

export function StaticPage(props: Common & { title: string; html: string }) {
  const { title, html, ...shell } = props;
  return (
    <Shell {...shell}>
      <article class="canvas-page">
        <h1 class="canvas-page-title">{title}</h1>
        <Prose html={html} />
      </article>
    </Shell>
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

export function GridPage(props: Common & { title: string; items: GridItem[] }) {
  const { title, items, ...shell } = props;
  return (
    <Shell {...shell} wide>
      <article class="canvas-page canvas-page-wide">
        <h1 class="canvas-page-title">{title}</h1>
        <ul class="canvas-grid">
          {items.map((it) => (
            <li key={it.url || it.title} class="canvas-grid-item">
              <a href={it.url || '#'} rel="noopener">
                {it.thumbnail || it.image ? (
                  <img class="canvas-grid-thumb" src={it.thumbnail || it.image} alt="" loading="lazy" />
                ) : null}
                <span class="canvas-grid-title">{it.title}</span>
                {it.description ? <span class="canvas-grid-desc">{it.description}</span> : null}
              </a>
            </li>
          ))}
        </ul>
      </article>
    </Shell>
  );
}

export function TagPage(props: Common & { term: string; kind: 'tag' | 'category'; posts: PostSummary[] }) {
  const { term, kind, posts, ...shell } = props;
  return (
    <Shell {...shell}>
      <article class="canvas-page">
        <span class="ed-label">{kind}</span>
        <h1 class="canvas-page-title">{term}</h1>
        <EntryList posts={posts} />
      </article>
    </Shell>
  );
}

const section = (title: string, children: ComponentChildren) => (
  <section class="sg-section">
    <h2 class="sg-title">{title}</h2>
    <div class="sg-demo">{children}</div>
  </section>
);

export function StyleguidePage(props: Common) {
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
  return (
    <Shell {...props}>
      <div class="sg">
        <header class="sg-header">
          <h1 class="canvas-page-title">Styleguide</h1>
          <p class="canvas-lede">Every component in the Canvas theme, rendered from @jsonblog/ui.</p>
        </header>
        {section('Post index', <EntryList posts={sample} />)}
        {section('Pagination', <Pagination pagination={{ page: 2, totalPages: 5, prevHref: '/', nextHref: '/page/3/' }} />)}
        {section('Tags', <TagList tags={['essays', 'craft', 'software']} />)}
        {section('Article', <PostArticle post={post} newer={sample[0]} older={sample[1]} />)}
      </div>
    </Shell>
  );
}
