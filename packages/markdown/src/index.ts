/**
 * @jsonblog/markdown — the markdown pipeline for JsonBlog.
 *
 * A thin wrapper over markdown-it with optional build-time syntax highlighting
 * (via @jsonblog/highlight) plus helpers for excerpts.
 */
import MarkdownIt from 'markdown-it';
import {
  type CodeHighlighter,
  containsCode,
  DEFAULT_THEMES,
  getHighlighter,
  highlightToHtml,
} from '@jsonblog/highlight';

export interface MarkdownOptions {
  /** A loaded highlighter; when present, fenced code blocks are colourised. */
  highlighter?: CodeHighlighter;
  /** [light, dark] Shiki theme names (defaults to github light/dark). */
  themes?: readonly [string, string];
  /** markdown-it options overrides. */
  markdownIt?: MarkdownIt.Options;
}

/** Create a markdown-it instance (with Shiki highlighting when a highlighter is given). */
export function createMarkdown(options: MarkdownOptions = {}): MarkdownIt {
  const { highlighter, themes = DEFAULT_THEMES } = options;
  const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    highlight: highlighter ? (code, lang) => highlightToHtml(highlighter, code, lang, themes) : undefined,
    ...options.markdownIt,
  });
  // Only auto-link real URLs (http/https/mailto). Without this, markdown-it's
  // "fuzzy" linkifier turns bare tokens like `CLAUDE.md`, `install.sh`, `Z.AI`,
  // or `www.company.com` into phantom `http://…` links. Explicit `[text](url)`
  // links and scheme'd URLs still linkify.
  md.linkify.set({ fuzzyLink: false, fuzzyEmail: false, fuzzyIP: false });
  return md;
}

/**
 * Create a markdown-it instance for a batch of content, loading Shiki **only** if
 * any of the content actually contains fenced code (so code-less builds pay nothing).
 */
export async function createMarkdownFor(
  contents: string[],
  options: Omit<MarkdownOptions, 'highlighter'> & {
    langs?: readonly string[];
  } = {}
): Promise<MarkdownIt> {
  const hasCode = contents.some(containsCode);
  const highlighter = hasCode
    ? await getHighlighter({ langs: options.langs, themes: options.themes })
    : undefined;
  return createMarkdown({ ...options, highlighter });
}

/** Render markdown to HTML. */
export function render(md: MarkdownIt, content: string): string {
  return md.render(content);
}

/** Strip the first `<h1>…</h1>` (a post template usually renders the title itself). */
export function stripFirstH1(html: string): string {
  return html.replace(/<h1[^>]*>.*?<\/h1>/, '');
}

/** Derive a plain-text excerpt from rendered HTML (for meta descriptions / feeds). */
export function excerpt(html: string, length = 160): string {
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, length);
}

export type { CodeHighlighter } from '@jsonblog/highlight';
export { MarkdownIt };
