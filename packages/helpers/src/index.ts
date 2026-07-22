/**
 * @jsonblog/helpers — framework-agnostic content utilities for JsonBlog theme authors.
 *
 * Pure functions only (no template engine): dates, slugs, reading time, pagination,
 * and grouping. Works with any rendering approach (JSX, template literals, etc.).
 */
import slugify from 'slugify';

export const SLUGIFY_OPTS = {
  lower: true,
  strict: true,
  remove: /[*+~.()'"!:@]/g,
} as const;

/** URL-safe slug for titles, tags, categories. */
export function slug(text: string): string {
  return slugify(text, SLUGIFY_OPTS);
}

/** Long-form date, e.g. "July 22, 2026". */
export function longFormDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

/** ISO date, e.g. "2026-07-22" (UTC) — a compact, technical presentation. */
export function isoDate(date: string): string {
  const d = new Date(date);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** The 4-digit year of a date string. */
export function year(date: string): string {
  return String(new Date(date).getUTCFullYear());
}

/** Estimated reading time in minutes (from plain text or HTML). */
export function readingTime(text: string, wordsPerMinute = 220): number {
  const words = text.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / wordsPerMinute));
}

export interface Paginated<T> {
  items: T[];
  page: number;
  totalPages: number;
  hasPrev: boolean;
  hasNext: boolean;
  prevPage: number | null;
  nextPage: number | null;
  isFirst: boolean;
  isLast: boolean;
}

/** Split a list into pages of `perPage`, with navigation metadata for each page. */
export function paginate<T>(items: T[], perPage = 10): Paginated<T>[] {
  const totalPages = Math.max(1, Math.ceil(items.length / perPage));
  return Array.from({ length: totalPages }, (_, i) => {
    const page = i + 1;
    return {
      items: items.slice(i * perPage, i * perPage + perPage),
      page,
      totalPages,
      hasPrev: page > 1,
      hasNext: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      isFirst: page === 1,
      isLast: page === totalPages,
    };
  });
}

/** Group items into `{ key, items }` buckets, preserving first-seen key order. */
export function groupBy<T>(items: T[], keyOf: (item: T) => string): { key: string; items: T[] }[] {
  const order: string[] = [];
  const map = new Map<string, T[]>();
  for (const item of items) {
    const k = keyOf(item);
    if (!map.has(k)) {
      map.set(k, []);
      order.push(k);
    }
    map.get(k)?.push(item);
  }
  return order.map((key) => ({ key, items: map.get(key) as T[] }));
}

/** Collect a `Map` of tag → items across posts (each post exposing a string[] via `tagsOf`). */
export function collectTerms<T>(items: T[], termsOf: (item: T) => string[] | undefined): Map<string, T[]> {
  const map = new Map<string, T[]>();
  for (const item of items) {
    for (const term of termsOf(item) || []) {
      if (!map.has(term)) map.set(term, []);
      map.get(term)?.push(item);
    }
  }
  return map;
}
