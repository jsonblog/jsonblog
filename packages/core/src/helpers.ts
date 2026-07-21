import type Handlebars from 'handlebars';
import slugify from 'slugify';

export const SLUGIFY_OPTS = {
  lower: true,
  strict: true,
  remove: /[*+~.()'"!:@]/g,
} as const;

export function slug(text: string): string {
  return slugify(text, SLUGIFY_OPTS);
}

/**
 * The default long-form date helper (e.g. "July 19, 2026"). Themes that want a
 * different presentation (the mono theme renders ISO `YYYY-MM-DD`) pass their own
 * `formatDate` via the theme's `helpers` map.
 */
export function longFormDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Register the base helper set on an isolated Handlebars environment. Theme
 * overrides are applied afterwards by the caller, so a theme can replace any of
 * these (typically `formatDate`).
 */
export function registerBaseHelpers(hb: typeof Handlebars): void {
  hb.registerHelper('formatDate', longFormDate);
  hb.registerHelper('slugify', slug);
  hb.registerHelper('eq', (a: unknown, b: unknown) => a === b);
  hb.registerHelper('add', (a: number, b: number) => a + b);
  hb.registerHelper('subtract', (a: number, b: number) => a - b);
  hb.registerHelper('multiply', (a: number, b: number) => a * b);
  hb.registerHelper('gt', (a: number, b: number) => a > b);
  hb.registerHelper('lt', (a: number, b: number) => a < b);
}
