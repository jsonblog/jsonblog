import type { Blog } from '@jsonblog/schema';
import type { SeoContext } from '@jsonblog/seo';
import { Document, type PostSummary } from '@jsonblog/ui';
import type { ComponentChildren } from 'preact';

export interface Assets {
  stylesheet: string;
  fonts: string[];
}

export interface NavLink {
  label: string;
  href: string;
}

/** home.json — the same shape Canvas reads, so a blog can switch themes without edits. */
export interface HomeConfig {
  brand?: string;
  tagline?: string[];
  nav?: NavLink[];
  hero?: {
    headline?: string;
    subhead?: string;
    intro?: string;
    aboutHref?: string;
    lens?: string[];
    location?: string;
    building?: string;
    lastUpdated?: string;
  };
  projects?: {
    name: string;
    description: string;
    tags?: string[];
    license?: string;
    status?: string;
    href?: string;
  }[];
  footerNote?: string;
  social?: NavLink[];
}

export interface Chrome {
  brand: string;
  tagline: string[];
  nav: NavLink[];
  footerNote?: string;
  social?: NavLink[];
}

export function chromeFrom(home: HomeConfig | undefined, blog: Blog): Chrome {
  return {
    brand: home?.brand || blog.site.title,
    tagline: home?.tagline || (blog.site.description ? [blog.site.description] : []),
    nav: home?.nav || [{ label: 'Home', href: '/' }],
    footerNote: home?.footerNote,
    social: home?.social,
  };
}

/** ISO day (2026-10-18) — fixed width, so date columns line up in monospace. */
export const isoDay = (date?: string) => (date ? date.slice(0, 10) : '');

function Header({ chrome }: { chrome: Chrome }) {
  return (
    <header class="pt-head">
      <a class="pt-brand" href="/">
        {chrome.brand}
      </a>
      {chrome.tagline.length ? <p class="pt-tagline">{chrome.tagline.join(' ')}</p> : null}
      <nav class="pt-nav" aria-label="Primary">
        {chrome.nav.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label.toLowerCase()}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Footer({ chrome }: { chrome: Chrome }) {
  const year = new Date().getUTCFullYear();
  return (
    <footer class="pt-foot">
      <p>
        (c) {year} {chrome.brand}
        {chrome.footerNote ? ` — ${chrome.footerNote.replace(/\.$/, '').toLowerCase()}` : ''}
      </p>
      {chrome.social?.length ? (
        <p class="pt-foot-links">
          {chrome.social.map((s) => (
            <a key={s.label} href={s.href}>
              {s.label.toLowerCase()}
            </a>
          ))}
        </p>
      ) : null}
      <p class="pt-eof">EOF</p>
    </footer>
  );
}

export function Shell(props: {
  blog: Blog;
  chrome: Chrome;
  seo: SeoContext;
  assets: Assets;
  children: ComponentChildren;
}) {
  const { blog, chrome, seo, assets, children } = props;
  return (
    <Document
      blog={blog}
      seo={seo}
      seoOptions={{ themeColor: ['#ffffff', '#000000'] }}
      stylesheets={[assets.stylesheet]}
      preloadFonts={assets.fonts}
      bodyClass="pt"
    >
      <div class="pt-wrap">
        <Header chrome={chrome} />
        <main id="main">{children}</main>
        <Footer chrome={chrome} />
      </div>
    </Document>
  );
}

/** A post index as aligned text rows: `2026-10-18  Title`. */
export function Lines({ posts }: { posts: PostSummary[] }) {
  if (!posts.length) return <p>nothing here yet.</p>;
  return (
    <ul class="pt-lines">
      {posts.map((p) => (
        <li key={p.slug}>
          <time datetime={p.date}>{isoDay(p.date)}</time>
          <a href={`/${p.slug}/`}>{p.title}</a>
        </li>
      ))}
    </ul>
  );
}
