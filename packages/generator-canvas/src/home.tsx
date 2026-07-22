import type { Blog } from '@jsonblog/schema';
import type { SeoContext } from '@jsonblog/seo';
import { Document } from '@jsonblog/ui';
import type { ComponentChildren } from 'preact';

export interface Assets {
  /** Stylesheet href (content-hashed for cache-busting). */
  stylesheet: string;
  /** woff2 font URLs to preload. */
  fonts: string[];
}

export interface NavLink {
  label: string;
  href: string;
}
export interface HomeConfig {
  brand: string;
  tagline: string[];
  nav: NavLink[];
  hero: {
    headline: string;
    subhead: string;
    intro: string;
    aboutHref?: string;
    lens: string[];
    location?: string;
    lastUpdated?: string;
  };
  featured?: { label?: string; title: string; summary?: string; href: string };
  notes?: { date: string; title: string; href: string }[];
  projects?: {
    letter: string;
    color: string;
    name: string;
    description: string;
    tags?: string[];
    license?: string;
    status?: string;
    href?: string;
  }[];
  themes?: { icon: string; name: string; count: number; description: string }[];
  reading?: { title: string; progress: number }[];
  quote?: { text: string; author?: string };
  newsletter?: { title: string; description?: string; placeholder?: string; action?: string; note?: string };
  footerNote?: string;
  social?: NavLink[];
}

/** Chrome (header + footer) shared by every page in the theme. */
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

const SearchIcon = () => (
  <svg class="canvas-search" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <circle cx="7" cy="7" r="4.5" fill="none" stroke="currentColor" stroke-width="1.4" />
    <line x1="10.5" y1="10.5" x2="14" y2="14" stroke="currentColor" stroke-width="1.4" />
  </svg>
);

export function EditorialHeader({ chrome }: { chrome: Chrome }) {
  return (
    <header class="ed-head">
      <div class="ed-head-brand">
        <a class="ed-brand" href="/">
          {chrome.brand}
        </a>
        {chrome.tagline.length ? (
          <span class="ed-brand-tag">
            {chrome.tagline.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </span>
        ) : null}
      </div>
      <nav class="ed-nav" aria-label="Primary">
        {chrome.nav.map((n) => (
          <a key={n.href} href={n.href}>
            {n.label}
          </a>
        ))}
        <SearchIcon />
      </nav>
    </header>
  );
}

export function EditorialFooter({ chrome }: { chrome: Chrome }) {
  const year = new Date().getUTCFullYear();
  return (
    <footer class="ed-foot">
      <span class="ed-foot-left">
        © {year} {chrome.brand}
        {chrome.footerNote ? <span class="ed-foot-note">{chrome.footerNote}</span> : null}
      </span>
      {chrome.social?.length ? (
        <span class="ed-foot-social">
          {chrome.social.map((s) => (
            <a key={s.label} href={s.href}>
              {s.label}
            </a>
          ))}
        </span>
      ) : null}
    </footer>
  );
}

/** The editorial page shell used by every page (header + main + footer). */
export function Shell(props: {
  blog: Blog;
  chrome: Chrome;
  seo: SeoContext;
  assets: Assets;
  children: ComponentChildren;
  wide?: boolean;
}) {
  const { blog, chrome, seo, assets, children, wide } = props;
  return (
    <Document
      blog={blog}
      seo={seo}
      seoOptions={{ themeColor: ['#f4f1ea', '#14130f'] }}
      stylesheets={[assets.stylesheet]}
      preloadFonts={assets.fonts}
      bodyClass="ed"
    >
      <div class={`ed-wrap${wide ? ' ed-wide' : ''}`}>
        <EditorialHeader chrome={chrome} />
        <main id="main">{children}</main>
        <EditorialFooter chrome={chrome} />
      </div>
    </Document>
  );
}

function Label({ children, href }: { children: ComponentChildren; href?: string }) {
  return href ? (
    <a class="ed-label ed-label-link" href={href}>
      {children}
    </a>
  ) : (
    <span class="ed-label">{children}</span>
  );
}

function FeaturedArt() {
  return (
    <svg class="ed-featured-art" viewBox="0 0 240 200" aria-hidden="true" fill="none">
      <ellipse cx="120" cy="100" rx="78" ry="42" stroke="currentColor" stroke-width="1" transform="rotate(-24 120 100)" />
      <ellipse cx="120" cy="100" rx="78" ry="42" stroke="currentColor" stroke-width="1" transform="rotate(30 120 100)" />
      <ellipse cx="120" cy="100" rx="52" ry="70" stroke="currentColor" stroke-width="1" transform="rotate(8 120 100)" />
    </svg>
  );
}

function Hero({ home }: { home: HomeConfig }) {
  const { hero } = home;
  return (
    <section class="ed-hero">
      <div class="ed-hero-lead">
        <h1 class="ed-headline">{hero.headline}</h1>
        <p class="ed-subhead">{hero.subhead}</p>
      </div>
      <div class="ed-hero-intro">
        <p>{hero.intro}</p>
        {hero.aboutHref ? (
          <a class="ed-more" href={hero.aboutHref}>
            About {home.brand} →
          </a>
        ) : null}
      </div>
      <aside class="ed-colophon">
        <div>
          <Label>Current lens</Label>
          <p class="ed-colophon-val">{hero.lens.join(' · ')}</p>
        </div>
        {hero.location ? (
          <div>
            <Label>Location</Label>
            <p class="ed-colophon-val">{hero.location}</p>
          </div>
        ) : null}
        {hero.lastUpdated ? (
          <div>
            <Label>Last updated</Label>
            <p class="ed-colophon-val">{hero.lastUpdated}</p>
          </div>
        ) : null}
      </aside>
    </section>
  );
}

function FeaturedAndNotes({ home }: { home: HomeConfig }) {
  return (
    <section class="ed-featured-row">
      {home.featured ? (
        <a class="ed-featured" href={home.featured.href}>
          <FeaturedArt />
          <div class="ed-featured-body">
            <Label>{home.featured.label || 'Featured'}</Label>
            <h2 class="ed-featured-title">{home.featured.title}</h2>
            {home.featured.summary ? <p class="ed-featured-sum">{home.featured.summary}</p> : null}
            <span class="ed-more">Read essay →</span>
          </div>
        </a>
      ) : null}
      {home.notes?.length ? (
        <div class="ed-notes">
          <div class="ed-notes-head">
            <Label>Selected notes</Label>
            <Label href="/tag/notes/">View all notes →</Label>
          </div>
          <ul>
            {home.notes.map((n) => (
              <li key={n.href}>
                <a href={n.href}>
                  <span class="ed-note-date">{n.date}</span>
                  <span class="ed-note-title">{n.title}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function Projects({ home }: { home: HomeConfig }) {
  if (!home.projects?.length) return null;
  return (
    <section class="ed-section">
      <div class="ed-section-head">
        <Label>Current projects</Label>
        <Label href="/projects/">View all projects →</Label>
      </div>
      <div class="ed-projects">
        {home.projects.map((p) => (
          <a class="ed-project" key={p.name} href={p.href || '#'}>
            <div class="ed-project-top">
              <span class="ed-badge" style={`background:${p.color}`}>
                {p.letter}
              </span>
              <span class="ed-project-name">{p.name}</span>
            </div>
            <p class="ed-project-desc">{p.description}</p>
            <div class="ed-project-meta">
              {p.tags?.length ? <span>{p.tags.join(' · ')}</span> : null}
              {p.license ? <span>{p.license}</span> : null}
            </div>
            {p.status ? <span class="ed-project-status">Status: {p.status}</span> : null}
          </a>
        ))}
      </div>
    </section>
  );
}

function ArchiveThemes({ home }: { home: HomeConfig }) {
  if (!home.themes?.length) return null;
  return (
    <section class="ed-section ed-section-tint">
      <div class="ed-section-head">
        <Label>Archive by theme</Label>
        <Label href="/archive/">Browse all essays →</Label>
      </div>
      <div class="ed-themes">
        {home.themes.map((t) => (
          <div class="ed-theme" key={t.name}>
            <span class="ed-theme-icon" aria-hidden="true">
              {t.icon}
            </span>
            <div class="ed-theme-head">
              <span class="ed-theme-name">{t.name}</span>
              <span class="ed-theme-count">{t.count} essays</span>
            </div>
            <p class="ed-theme-desc">{t.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Coda({ home }: { home: HomeConfig }) {
  return (
    <section class="ed-coda">
      {home.reading?.length ? (
        <div class="ed-reading">
          <Label>What I'm working through</Label>
          <ul>
            {home.reading.map((r) => (
              <li key={r.title}>
                <span class="ed-reading-title">{r.title}</span>
                <span class="ed-reading-bar">
                  <span class="ed-reading-fill" style={`width:${r.progress}%`} />
                </span>
                <span class="ed-reading-pct">{r.progress}%</span>
              </li>
            ))}
          </ul>
          <Label href="/reading/">View reading list →</Label>
        </div>
      ) : null}
      {home.quote ? (
        <figure class="ed-quote">
          <blockquote>{home.quote.text}</blockquote>
          {home.quote.author ? <figcaption>{home.quote.author}</figcaption> : null}
        </figure>
      ) : null}
      {home.newsletter ? (
        <div class="ed-news">
          <Label>{home.newsletter.title}</Label>
          {home.newsletter.description ? <p class="ed-news-desc">{home.newsletter.description}</p> : null}
          <form class="ed-news-form" method="post" action="#">
            <input type="email" placeholder={home.newsletter.placeholder || 'Your email'} aria-label="Email" />
            <button type="submit">{home.newsletter.action || 'Subscribe'}</button>
          </form>
          {home.newsletter.note ? <p class="ed-news-note">{home.newsletter.note}</p> : null}
        </div>
      ) : null}
    </section>
  );
}

export function HomePage(props: {
  blog: Blog;
  home: HomeConfig;
  chrome: Chrome;
  seo: SeoContext;
  assets: Assets;
}) {
  const { home, ...shell } = props;
  return (
    <Shell {...shell} wide>
      <Hero home={home} />
      <FeaturedAndNotes home={home} />
      <Projects home={home} />
      <ArchiveThemes home={home} />
      <Coda home={home} />
    </Shell>
  );
}
