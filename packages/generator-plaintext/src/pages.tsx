import type { Blog } from '@jsonblog/schema';
import type { SeoContext } from '@jsonblog/seo';
import { type PostSummary, type PostView, Prose } from '@jsonblog/ui';
import { type Assets, type Chrome, type HomeConfig, isoDay, Lines, Shell } from './layout';

interface Common {
  blog: Blog;
  chrome: Chrome;
  seo: SeoContext;
  assets: Assets;
}

export interface Provenance {
  text?: string;
  code?: string;
}

const AI_NOTE = 'written by AI — an autonomous weekly log of what shipped, not a human essay.';

/** The homepage: one column, top to bottom — a short bio, then projects. Posts live on /essays/ and /devlog/. */
export function HomePage(props: Common & { home: HomeConfig }) {
  const { home, ...shell } = props;
  const hero = home.hero || {};
  return (
    <Shell {...shell}>
      {hero.headline || hero.intro ? (
        <section class="pt-section">
          {hero.headline ? (
            <h1 class="pt-title">
              {hero.headline}
              {hero.subhead ? ` ${hero.subhead}` : ''}
            </h1>
          ) : null}
          {hero.intro ? <p>{hero.intro}</p> : null}
        </section>
      ) : null}

      {home.projects?.length ? (
        <section class="pt-section">
          <h2 class="pt-h">projects</h2>
          <ul class="pt-items">
            {home.projects.map((p) => (
              <li key={p.name}>
                <a href={p.href || '#'} rel="noopener">
                  {p.name}
                </a>
                {p.status ? <span class="pt-meta"> [{p.status.toLowerCase()}]</span> : null}
                <p>{p.description}</p>
              </li>
            ))}
          </ul>
          <p class="pt-more">
            <a href="/projects/">all projects →</a>
          </p>
        </section>
      ) : null}
    </Shell>
  );
}

/** A titled list of posts (essays, devlog). */
export function ListPage(props: Common & { title: string; note?: string; posts: PostSummary[] }) {
  const { title, note, posts, ...shell } = props;
  return (
    <Shell {...shell}>
      <h1 class="pt-title">{title}</h1>
      {note ? <p class="pt-note">{note}</p> : null}
      <Lines posts={posts} />
    </Shell>
  );
}

export function PostPage(
  props: Common & { post: PostView; provenance?: Provenance; newer?: PostSummary; older?: PostSummary }
) {
  const { post, provenance, newer, older, ...shell } = props;
  const isAi = post.type === 'ai';
  const meta = [
    isoDay(post.date),
    post.readingMinutes ? `${post.readingMinutes} min read` : null,
    provenance?.text ? `words: ${provenance.text.toLowerCase()}` : null,
    provenance?.code ? `code: ${provenance.code.toLowerCase()}` : null,
  ].filter(Boolean);
  return (
    <Shell {...shell}>
      <article class="pt-post">
        <p class="pt-back">
          <a href={isAi ? '/devlog/' : '/'}>{isAi ? '← devlog' : '← index'}</a>
        </p>
        <h1 class="pt-title">{post.title}</h1>
        <p class="pt-meta">{meta.join(' · ')}</p>
        {isAi ? <p class="pt-box">devlog entry — {AI_NOTE}</p> : null}
        <Prose html={post.html} />
        {post.tags?.length ? (
          <p class="pt-tags">
            {post.tags.map((t) => (
              <a key={t} href={`/tag/${t.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}/`}>
                #{t}
              </a>
            ))}
          </p>
        ) : null}
      </article>
      {newer || older ? (
        <nav class="pt-postnav" aria-label="More posts">
          {newer ? (
            <p>
              newer: <a href={`/${newer.slug}/`}>{newer.title}</a>
            </p>
          ) : null}
          {older ? (
            <p>
              older: <a href={`/${older.slug}/`}>{older.title}</a>
            </p>
          ) : null}
        </nav>
      ) : null}
    </Shell>
  );
}

export function StaticPage(props: Common & { title: string; html: string }) {
  const { title, html, ...shell } = props;
  return (
    <Shell {...shell}>
      <h1 class="pt-title">{title}</h1>
      <Prose html={html} />
    </Shell>
  );
}

export interface Item {
  title: string;
  url?: string;
  description?: string;
  date?: string;
}

/** `layout: "grid"` pages (e.g. videos) render as a plain list — no thumbnails, no grid. */
export function ItemsPage(props: Common & { title: string; items: Item[] }) {
  const { title, items, ...shell } = props;
  return (
    <Shell {...shell}>
      <h1 class="pt-title">{title}</h1>
      <ul class="pt-items">
        {items.map((it) => (
          <li key={it.url || it.title}>
            {it.date ? <time datetime={it.date}>{isoDay(it.date)} </time> : null}
            <a href={it.url || '#'} rel="noopener">
              {it.title}
            </a>
            {it.description ? <p>{it.description}</p> : null}
          </li>
        ))}
      </ul>
    </Shell>
  );
}

export function TagPage(props: Common & { term: string; kind: 'tag' | 'category'; posts: PostSummary[] }) {
  const { term, kind, posts, ...shell } = props;
  return (
    <Shell {...shell}>
      <h1 class="pt-title">
        {kind}: {term}
      </h1>
      <Lines posts={posts} />
    </Shell>
  );
}
