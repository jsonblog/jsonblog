import { Prose } from './document';
import type { NavItem, PaginationView, PostSummary, PostView, SiteView } from './types';

/** Masthead: site title (links home) + optional tagline + primary nav. */
export function SiteHeader({ site }: { site: SiteView }) {
  return (
    <header class="jb-masthead">
      <div class="jb-masthead-brand">
        <a class="jb-site-title" href="/">
          {site.title}
        </a>
        {site.description ? <p class="jb-site-tagline">{site.description}</p> : null}
      </div>
      {site.nav.length ? (
        <nav class="jb-nav" aria-label="Primary">
          {site.nav.map((item: NavItem) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

export function SiteFooter({ site }: { site: SiteView }) {
  return (
    <footer class="jb-footer">
      <span>
        © {site.title}
        {site.author && site.author !== site.title ? ` · ${site.author}` : ''}
      </span>
      <span>
        built with{' '}
        <a href="https://jsonblog.dev" rel="noopener">
          jsonblog
        </a>
      </span>
    </footer>
  );
}

function PostMeta({ post }: { post: PostSummary | PostView }) {
  return (
    <span class="jb-entry-meta">
      {post.date ? (
        <time class="jb-entry-date" datetime={post.date}>
          {post.dateLabel || post.date}
        </time>
      ) : null}
      {'readingMinutes' in post && post.readingMinutes ? (
        <span class="jb-entry-reading">{post.readingMinutes} min</span>
      ) : null}
    </span>
  );
}

/** A single row in the post index. */
export function EntryRow({ post }: { post: PostSummary }) {
  return (
    <li class="jb-entry">
      <PostMeta post={post} />
      <a class="jb-entry-title" href={`/${post.slug}/`}>
        {post.title}
      </a>
    </li>
  );
}

/** The post index list. */
export function EntryList({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return <p class="jb-empty">No posts yet.</p>;
  return (
    <ul class="jb-entries">
      {posts.map((p) => (
        <EntryRow key={p.slug} post={p} />
      ))}
    </ul>
  );
}

export function TagList({ tags, class: cls }: { tags?: string[]; class?: string }) {
  if (!tags?.length) return null;
  return (
    <ul class={`jb-tags${cls ? ` ${cls}` : ''}`}>
      {tags.map((t) => (
        <li key={t}>
          <a class="jb-tag" href={`/tag/${t.replace(/[^a-z0-9]+/gi, '-').toLowerCase()}/`}>
            {t}
          </a>
        </li>
      ))}
    </ul>
  );
}

export function Pagination({ pagination }: { pagination: PaginationView }) {
  if (pagination.totalPages <= 1) return null;
  return (
    <nav class="jb-pagination" aria-label="Pagination">
      {pagination.prevHref ? (
        <a rel="prev" href={pagination.prevHref}>
          ← newer
        </a>
      ) : (
        <span aria-disabled="true">← newer</span>
      )}
      <span class="jb-pagination-status">
        {pagination.page} / {pagination.totalPages}
      </span>
      {pagination.nextHref ? (
        <a rel="next" href={pagination.nextHref}>
          older →
        </a>
      ) : (
        <span aria-disabled="true">older →</span>
      )}
    </nav>
  );
}

export function PostNav({ newer, older }: { newer?: PostSummary; older?: PostSummary }) {
  if (!newer && !older) return null;
  return (
    <nav class="jb-postnav" aria-label="More posts">
      {newer ? (
        <a class="jb-postnav-prev" rel="prev" href={`/${newer.slug}/`}>
          <span class="jb-postnav-dir">← newer</span>
          <span class="jb-postnav-title">{newer.title}</span>
        </a>
      ) : (
        <span />
      )}
      {older ? (
        <a class="jb-postnav-next" rel="next" href={`/${older.slug}/`}>
          <span class="jb-postnav-dir">older →</span>
          <span class="jb-postnav-title">{older.title}</span>
        </a>
      ) : (
        <span />
      )}
    </nav>
  );
}

/** A full post article. */
export function PostArticle({
  post,
  newer,
  older,
}: {
  post: PostView;
  newer?: PostSummary;
  older?: PostSummary;
}) {
  return (
    <article class="jb-post">
      <header class="jb-post-header">
        <PostMeta post={post} />
        <h1 class="jb-post-title">{post.title}</h1>
      </header>
      <Prose html={post.html} />
      <TagList tags={post.tags} class="jb-post-tags" />
      <PostNav newer={newer} older={older} />
    </article>
  );
}
