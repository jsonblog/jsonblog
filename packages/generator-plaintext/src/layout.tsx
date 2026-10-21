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
  /** One line set beside the brand (the site description). */
  motto?: string;
  tagline: string[];
  nav: NavLink[];
  footerNote?: string;
  social?: NavLink[];
}

export function chromeFrom(home: HomeConfig | undefined, blog: Blog): Chrome {
  return {
    brand: home?.brand || blog.site.title,
    motto: blog.site.description,
    tagline: home?.tagline || [],
    nav: home?.nav || [{ label: 'Home', href: '/' }],
    footerNote: home?.footerNote,
    social: home?.social,
  };
}

/** Monochrome contact icons, keyed by lower-cased social label; unknown labels fall back to text. */
const ICONS: Record<string, ComponentChildren> = {
  github: (
    <path
      fill="currentColor"
      d="M12 .3a12 12 0 0 0-3.8 23.4c.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.6-1.4-1.4-1.8-1.4-1.8-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.8-1.6-2.7-.3-5.5-1.3-5.5-5.9 0-1.3.5-2.4 1.2-3.2-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11.5 11.5 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2.8.8 1.2 1.9 1.2 3.2 0 4.6-2.8 5.6-5.5 5.9.4.4.8 1.1.8 2.2v3.3c0 .3.2.7.8.6A12 12 0 0 0 12 .3"
    />
  ),
  twitter: (
    <path
      fill="currentColor"
      d="M24 4.6a9.9 9.9 0 0 1-2.8.8 4.9 4.9 0 0 0 2.1-2.7c-.9.6-2 1-3.1 1.2a4.9 4.9 0 0 0-8.4 4.5A14 14 0 0 1 1.6 3.2a4.8 4.8 0 0 0 1.6 6.5 4.9 4.9 0 0 1-2.3-.6v.1a4.9 4.9 0 0 0 4 4.8 5 5 0 0 1-2.2.1 4.9 4.9 0 0 0 4.6 3.4A9.9 9.9 0 0 1 0 19.5a14 14 0 0 0 7.6 2.2c9 0 14-7.5 14-14v-.6c1-.7 1.8-1.6 2.4-2.5z"
    />
  ),
  email: (
    <g fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="5" width="20" height="14" />
      <path d="m2 5 10 8 10-8" />
    </g>
  ),
  rss: (
    <g fill="none" stroke="currentColor" stroke-width="2.5">
      <circle cx="5" cy="19" r="1.5" fill="currentColor" stroke="none" />
      <path d="M4 11a9 9 0 0 1 9 9M4 4a16 16 0 0 1 16 16" />
    </g>
  ),
};

function SocialLinks({ social }: { social: NavLink[] }) {
  return (
    <nav class="pt-social" aria-label="Contact">
      {social.map((s) => {
        const icon = ICONS[s.label.toLowerCase()];
        return (
          <a key={s.label} href={s.href} title={s.label} aria-label={icon ? s.label : undefined} rel="me noopener">
            {icon ? (
              <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
                {icon}
              </svg>
            ) : (
              s.label.toLowerCase()
            )}
          </a>
        );
      })}
    </nav>
  );
}

/** ISO day (2026-10-18) — fixed width, so date columns line up in monospace. */
export const isoDay = (date?: string) => (date ? date.slice(0, 10) : '');

function Header({ chrome }: { chrome: Chrome }) {
  return (
    <header class="pt-head">
      <p class="pt-brandline">
        <a class="pt-brand" href="/">
          {chrome.brand}
        </a>
        {chrome.motto ? <span class="pt-motto">{chrome.motto}</span> : null}
      </p>
      {chrome.tagline.length ? <p class="pt-tagline">{chrome.tagline.join(' ')}</p> : null}
      <div class="pt-navline">
        <nav class="pt-nav" aria-label="Primary">
          {chrome.nav.map((n) => (
            <a key={n.href} href={n.href}>
              {n.label.toLowerCase()}
            </a>
          ))}
        </nav>
        {chrome.social?.length ? <SocialLinks social={chrome.social} /> : null}
      </div>
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
