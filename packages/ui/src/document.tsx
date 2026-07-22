import type { Blog } from '@jsonblog/schema';
import { type SeoContext, type SeoOptions, seoHead } from '@jsonblog/seo';
import type { ComponentChildren } from 'preact';

export interface HeadOptions {
  blog: Blog;
  seo: SeoContext;
  seoOptions?: SeoOptions;
  /** Stylesheet href(s), e.g. "/main.css?v=abc". */
  stylesheets?: string[];
  /** Fonts to preload (woff2 URLs). */
  preloadFonts?: string[];
  /** Extra raw HTML appended to <head>. */
  extra?: string;
}

/** Compose the inner HTML of <head>: SEO + charset/viewport + fonts + styles + RSS. */
export function headHtml(opts: HeadOptions): string {
  const { blog, seo, seoOptions, stylesheets = [], preloadFonts = [], extra = '' } = opts;
  const parts: string[] = [
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
  ];
  for (const f of preloadFonts) {
    parts.push(`<link rel="preload" href="${f}" as="font" type="font/woff2" crossorigin>`);
  }
  for (const s of stylesheets) parts.push(`<link rel="stylesheet" href="${s}">`);
  if (blog.site.url) {
    parts.push(
      `<link rel="alternate" type="application/rss+xml" title="${blog.site.title} RSS" href="/rss.xml">`
    );
  }
  parts.push(seoHead(blog, seo, seoOptions));
  if (extra) parts.push(extra);
  return parts.join('\n  ');
}

export interface DocumentProps extends HeadOptions {
  lang?: string;
  bodyClass?: string;
  children?: ComponentChildren;
}

/** The full HTML document. Head is injected as raw HTML; body holds components. */
export function Document(props: DocumentProps) {
  const { lang = 'en', bodyClass, children, ...head } = props;
  return (
    <html lang={lang}>
      {/* biome-ignore lint/security/noDangerouslySetInnerHtml: head is composed from trusted, escaped SEO output */}
      <head dangerouslySetInnerHTML={{ __html: `\n  ${headHtml(head)}\n` }} />
      <body class={bodyClass}>
        <a class="jb-skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

/** Rendered markdown body. */
export function Prose({ html, class: cls }: { html: string; class?: string }) {
  return (
    // biome-ignore lint/security/noDangerouslySetInnerHtml: markdown is rendered at build time
    <div class={`jb-prose${cls ? ` ${cls}` : ''}`} dangerouslySetInnerHTML={{ __html: html }} />
  );
}
