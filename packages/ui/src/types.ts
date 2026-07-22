/** View models the JsonBlog components render. A generator maps `blog.json` to these. */

export interface NavItem {
  label: string;
  href: string;
}

export interface SiteView {
  title: string;
  description?: string;
  url?: string;
  author?: string;
  nav: NavItem[];
}

export interface PostView {
  title: string;
  slug: string;
  /** Rendered HTML body (markdown → HTML). */
  html: string;
  excerpt?: string;
  /** Raw ISO date (for <time datetime>). */
  date?: string;
  /** Human-formatted date. */
  dateLabel?: string;
  tags?: string[];
  categories?: string[];
  type?: string;
  readingMinutes?: number;
}

export interface PostSummary {
  title: string;
  slug: string;
  date?: string;
  dateLabel?: string;
  tags?: string[];
  type?: string;
}

export interface PaginationView {
  page: number;
  totalPages: number;
  prevHref?: string;
  nextHref?: string;
}
