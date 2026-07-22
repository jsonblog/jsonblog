/**
 * @jsonblog/highlight — build-time syntax highlighting via Shiki.
 *
 * Dual light/dark themes are emitted as CSS variables, so there is no runtime
 * JavaScript and theme switching is pure CSS. The highlighter is loaded lazily.
 */

/** The subset of the Shiki highlighter we use (kept minimal so `.d.ts` stays small). */
export interface CodeHighlighter {
  codeToHtml(code: string, options: Record<string, unknown>): string;
  getLoadedLanguages(): string[];
}

export interface HighlightOptions {
  /** Languages to preload. */
  langs?: readonly string[];
  /** [light, dark] Shiki theme names. */
  themes?: readonly [string, string];
}

/** A sensible default language set for technical blogs. */
export const DEFAULT_LANGS = [
  'javascript', 'typescript', 'tsx', 'json', 'bash', 'python', 'rust', 'go',
  'sql', 'yaml', 'html', 'css', 'markdown', 'diff',
] as const;

export const DEFAULT_THEMES: readonly [string, string] = ['github-light', 'github-dark'];

let cached: Promise<CodeHighlighter> | undefined;
let cacheKey = '';

/** Load (and cache) a Shiki highlighter. Repeated calls with the same options reuse it. */
export async function getHighlighter(options: HighlightOptions = {}): Promise<CodeHighlighter> {
  const langs = options.langs ?? DEFAULT_LANGS;
  const themes = options.themes ?? DEFAULT_THEMES;
  const key = JSON.stringify([langs, themes]);
  if (!cached || key !== cacheKey) {
    cacheKey = key;
    cached = import('shiki').then(({ createHighlighter }) =>
      createHighlighter({ themes: [...themes], langs: [...langs] as string[] })
    ) as unknown as Promise<CodeHighlighter>;
  }
  return cached;
}

/**
 * Highlight a code string to dual-theme HTML. Unknown languages fall back to
 * plain text. Never throws — returns an empty string on failure so callers can
 * fall back to their own rendering.
 */
export function highlightToHtml(
  highlighter: CodeHighlighter,
  code: string,
  lang: string | undefined,
  themes: readonly [string, string] = DEFAULT_THEMES
): string {
  const language = lang && highlighter.getLoadedLanguages().includes(lang) ? lang : 'text';
  try {
    return highlighter.codeToHtml(code, {
      lang: language,
      themes: { light: themes[0], dark: themes[1] },
      defaultColor: false,
    });
  } catch {
    return '';
  }
}

/** Cheap check for whether a markdown string contains fenced code (to skip loading Shiki). */
export function containsCode(markdown: string): boolean {
  return markdown.includes('```') || markdown.includes('~~~');
}
