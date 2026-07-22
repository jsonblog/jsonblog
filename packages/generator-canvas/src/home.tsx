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
    letter: string;
    color: string;
    name: string;
    description: string;
    tags?: string[];
    license?: string;
    status?: string;
    href?: string;
  }[];
  footerNote?: string;
  social?: NavLink[];
  /** Publish the /styleguide/ component gallery (theme-dev only; off by default). */
  styleguide?: boolean;
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
  const hero = home.hero || {};
  return (
    <section class="ed-hero">
      <div class="ed-hero-lead">
        {hero.headline ? <h1 class="ed-headline">{hero.headline}</h1> : null}
        {hero.subhead ? <p class="ed-subhead">{hero.subhead}</p> : null}
      </div>
      <div class="ed-hero-intro">
        {hero.intro ? <p>{hero.intro}</p> : null}
        {hero.aboutHref ? (
          <a class="ed-more" href={hero.aboutHref}>
            About →
          </a>
        ) : null}
      </div>
      <aside class="ed-colophon">
        {hero.lens?.length ? (
          <div>
            <Label>Currently thinking about</Label>
            <p class="ed-colophon-val">{hero.lens.join(' · ')}</p>
          </div>
        ) : null}
        {hero.building ? (
          <div>
            <Label>Currently building</Label>
            <p class="ed-colophon-val">{hero.building}</p>
          </div>
        ) : null}
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

interface Featured {
  title: string;
  summary?: string;
  href: string;
}

function EntryLines({ posts }: { posts: PostSummary[] }) {
  return (
    <ul class="ed-lines">
      {posts.map((n) => (
        <li key={n.slug}>
          <a href={`/${n.slug}/`}>
            <span class="ed-note-date">{n.dateLabel || n.date}</span>
            <span class="ed-note-title">{n.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

function FeaturedAndEssays({ featured, essays }: { featured?: Featured; essays: PostSummary[] }) {
  return (
    <section class="ed-featured-row">
      {featured ? (
        <a class="ed-featured" href={featured.href}>
          <FeaturedArt />
          <div class="ed-featured-body">
            <Label>Featured essay</Label>
            <h2 class="ed-featured-title">{featured.title}</h2>
            {featured.summary ? <p class="ed-featured-sum">{featured.summary}</p> : null}
            <span class="ed-more">Read essay →</span>
          </div>
        </a>
      ) : null}
      <div class="ed-notes">
        <div class="ed-notes-head">
          <Label>Writing</Label>
          <Label href="/essays/">All essays →</Label>
        </div>
        <EntryLines posts={essays} />
      </div>
    </section>
  );
}

/** The AI devlog — clearly labelled as machine-written. */
function DevlogSection({ devlog }: { devlog: PostSummary[] }) {
  if (!devlog.length) return null;
  return (
    <section class="ed-section ed-section-tint">
      <div class="ed-section-head">
        <div class="ed-devlog-title">
          <Label>The devlog</Label>
          <span class="ed-ai-note">
            <span class="ed-ai-dot" aria-hidden="true" /> Written by AI — an autonomous log of what
            shipped each week
          </span>
        </div>
        <Label href="/devlog/">All devlog entries →</Label>
      </div>
      <ul class="ed-lines ed-lines-2col">
        {devlog.map((n) => (
          <li key={n.slug}>
            <a href={`/${n.slug}/`}>
              <span class="ed-note-date">{n.dateLabel || n.date}</span>
              <span class="ed-note-title">{n.title}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Projects({ home }: { home: HomeConfig }) {
  if (!home.projects?.length) return null;
  return (
    <section class="ed-section">
      <div class="ed-section-head">
        <Label>Projects</Label>
        <Label href="/projects/">All projects →</Label>
      </div>
      <div class="ed-projects">
        {home.projects.map((p) => (
          <a class="ed-project" key={p.name} href={p.href || '#'} rel="noopener">
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

export function HomePage(props: {
  blog: Blog;
  home: HomeConfig;
  chrome: Chrome;
  seo: SeoContext;
  assets: Assets;
  featured?: Featured;
  essays: PostSummary[];
  devlog: PostSummary[];
}) {
  const { home, featured, essays, devlog, ...shell } = props;
  return (
    <Shell {...shell} wide>
      <Hero home={home} />
      <FeaturedAndEssays featured={featured} essays={essays} />
      <DevlogSection devlog={devlog} />
      <Projects home={home} />
    </Shell>
  );
}
