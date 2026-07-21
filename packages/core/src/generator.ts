import axios from 'axios';
import * as fs from 'fs';
import Handlebars from 'handlebars';
import MarkdownIt from 'markdown-it';
import * as path from 'path';
import RSS from 'rss';
import { registerBaseHelpers, slug } from './helpers';
import logger from './logger';
import type { Blog, BlogPage, BlogPost, GeneratedFile } from './types';

export interface ThemeConfig {
  /** Absolute path to the theme's `templates/` directory. */
  templatesDir: string;
  /** Filename (inside templatesDir) of the stylesheet to emit as `main.css`. */
  cssSourceFile?: string;
  /** Generator package name, surfaced to templates as `generatorName`. */
  generatorName: string;
  /** Generator package version, surfaced to templates as `generatorVersion`. */
  generatorVersion: string;
  /**
   * Theme helper overrides/additions, applied on top of the base helper set.
   * The common override is `formatDate`.
   */
  helpers?: Record<string, Handlebars.HelperDelegate>;
  /**
   * Strip the first `<h1>` from rendered post content (the post template already
   * renders the title, so keeping it would duplicate the heading). Defaults to
   * `true`; the boilerplate theme's template does not render its own title, so it
   * sets this `false`.
   */
  stripPostTitle?: boolean;
}

export type GenerateBlog = (
  blog: Blog,
  basePath: string,
  generatorConfig?: Record<string, unknown>
) => Promise<GeneratedFile[]>;

// Shared markdown parser (matches the original generators' configuration).
const md = new MarkdownIt({ html: true, linkify: true, typographer: true });

// Fetch file content from URL or local path.
async function fetchFile(uri: string, basePath: string): Promise<string | undefined> {
  try {
    if (uri.startsWith('http')) {
      logger.debug({ uri }, 'Fetching remote file');
      const response = await axios.get(`${uri}?cb=${new Date().getTime()}`, {
        timeout: 30000,
        maxContentLength: 10 * 1024 * 1024,
      });
      logger.debug({ uri, status: response.status }, 'Remote file fetched successfully');
      return response.data;
    } else {
      logger.debug({ uri, basePath }, 'Reading local file');
      const filePath = path.resolve(basePath, uri.replace(/^\.\//, ''));

      if (!fs.existsSync(filePath)) {
        logger.warn({ filePath }, 'File does not exist');
        return undefined;
      }

      const stats = fs.statSync(filePath);
      if (stats.size > 10 * 1024 * 1024) {
        logger.warn({ filePath, size: stats.size }, 'File too large, skipping');
        return undefined;
      }

      const content = fs.readFileSync(filePath, 'utf8');
      logger.debug({ filePath, size: content.length }, 'Local file loaded successfully');
      return content;
    }
  } catch (error: any) {
    if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
      logger.error({ uri, errorCode: error.code }, 'Network error fetching file');
    } else if (error.response?.status) {
      logger.error({ uri, status: error.response.status }, 'HTTP error fetching file');
    } else {
      logger.error({ error, uri }, 'Unexpected error fetching file');
    }
    return undefined;
  }
}

// Process posts or pages: resolve `source`/`itemsSource`, render markdown, slugify, sort.
async function processContent<T extends BlogPost | BlogPage>(
  items: T[],
  type: 'post' | 'page',
  basePath: string,
  stripPostTitle: boolean
): Promise<T[]> {
  if (!items) return [];
  logger.info(`Processing ${items.length} ${type}s`);

  const processedItems = await Promise.all(
    items.map(async (item) => {
      let gridItems: any = 'items' in item ? item.items : undefined;

      try {
        let content = item.content || '';

        if ('source' in item && item.source) {
          const fetchedContent = await fetchFile(item.source, basePath);
          if (fetchedContent) {
            content = fetchedContent;
          }
        }

        if ('itemsSource' in item && item.itemsSource) {
          const fetchedItems = await fetchFile(item.itemsSource, basePath);
          if (fetchedItems) {
            try {
              gridItems = JSON.parse(fetchedItems);
              logger.debug(
                { itemsSource: item.itemsSource },
                'Loaded grid items from external file'
              );
            } catch (error) {
              logger.error({ error, itemsSource: item.itemsSource }, 'Failed to parse items JSON');
            }
          }
        }

        if (!content && (!('layout' in item) || item.layout !== 'grid')) {
          return {
            ...item,
            content: '<p>Error: No content found</p>',
            slug: slug(item.title),
            ...(gridItems && { items: gridItems }),
          } as T;
        }

        try {
          let rendered = content ? md.render(String(content)) : '';

          // For posts, strip the first H1 (the title is already in the template).
          if (type === 'post' && stripPostTitle) {
            rendered = rendered.replace(/<h1[^>]*>.*?<\/h1>/, '');
          }

          // A plain-text excerpt for meta descriptions / OG tags / feeds.
          const excerpt = rendered
            .replace(/<[^>]*>/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .slice(0, 160);

          return {
            ...item,
            content: rendered,
            excerpt,
            slug: slug(item.title),
            ...(gridItems && { items: gridItems }),
          } as T;
        } catch (error) {
          logger.error({ error, title: item.title }, 'Failed to render markdown');
          return {
            ...item,
            content: '<p>Error: Failed to render content</p>',
            slug: slug(item.title),
            ...(gridItems && { items: gridItems }),
          } as T;
        }
      } catch (error) {
        logger.error({ error, title: item.title, type }, 'Failed to process content');
        return {
          ...item,
          content: '<p>Error: Failed to process content</p>',
          slug: slug(item.title),
          ...(gridItems && { items: gridItems }),
        } as T;
      }
    })
  );

  return processedItems.sort((a, b) => {
    if (type === 'post' && 'createdAt' in a && 'createdAt' in b) {
      return new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime();
    }
    return 0;
  });
}

/**
 * Build a JsonBlog generator from a theme (templates + CSS + optional helper
 * overrides). Returns the standard `generateBlog(blog, basePath, config)` function.
 * Disk I/O (writing files) is the CLI's responsibility — this returns the file set.
 */
export function createGenerator(theme: ThemeConfig): GenerateBlog {
  const { templatesDir, generatorName, generatorVersion } = theme;
  const cssSourceFile = theme.cssSourceFile ?? 'main.css';
  const stripPostTitle = theme.stripPostTitle ?? true;

  const read = (name: string) => fs.readFileSync(path.join(templatesDir, name), 'utf8');
  const readOptional = (name: string): string | undefined => {
    const p = path.join(templatesDir, name);
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : undefined;
  };

  const templateFiles = {
    index: read('index.hbs'),
    post: read('post.hbs'),
    page: read('page.hbs'),
    pageGrid: readOptional('page-grid.hbs'),
    layout: read('layout.hbs'),
    tag: read('tag.hbs'),
    category: read('category.hbs'),
  };

  const css = read(cssSourceFile);

  // Isolated Handlebars environment per generator so helpers/partials never leak
  // across generators sharing a process.
  const hb = Handlebars.create();
  registerBaseHelpers(hb);
  if (theme.helpers) {
    for (const [name, fn] of Object.entries(theme.helpers)) {
      hb.registerHelper(name, fn);
    }
  }
  hb.registerPartial('layout', templateFiles.layout);
  hb.registerPartial('content', '{{> @partial-block }}');

  const compiledTemplates = {
    index: hb.compile(templateFiles.index),
    post: hb.compile(templateFiles.post),
    page: hb.compile(templateFiles.page),
    pageGrid: templateFiles.pageGrid ? hb.compile(templateFiles.pageGrid) : null,
    tag: hb.compile(templateFiles.tag),
    category: hb.compile(templateFiles.category),
  };

  return async function generateBlog(
    blog: Blog,
    basePath: string,
    generatorConfig: Record<string, unknown> = {}
  ): Promise<GeneratedFile[]> {
    logger.info(
      { basePath, hasConfig: Object.keys(generatorConfig).length > 0 },
      'Starting blog generation'
    );
    const files: GeneratedFile[] = [];

    try {
      if (!blog) {
        throw new Error('Blog configuration is required');
      }
      if (!blog.site || !blog.site.title) {
        throw new Error('Blog site configuration with title is required');
      }
      if (!blog.basics || !blog.basics.name) {
        throw new Error('Blog basics configuration with author name is required');
      }

      logger.info('Processing posts...');
      const posts = await processContent(blog.posts, 'post', basePath, stripPostTitle);
      logger.info(`Posts processed: ${posts.length}`);

      logger.info('Processing pages...');
      const pages = blog.pages
        ? await processContent(blog.pages, 'page', basePath, stripPostTitle)
        : [];
      logger.info(`Pages processed: ${pages.length}`);

      const postsPerPage = blog.settings?.postsPerPage || 10;
      const totalPages = Math.max(1, Math.ceil(posts.length / postsPerPage));

      logger.info('Generating paginated index pages...');
      const paginationTasks: Promise<GeneratedFile>[] = [];

      for (let page = 1; page <= totalPages; page++) {
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        const pagePosts = posts.slice(startIndex, endIndex);

        const pagination = {
          currentPage: page,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1,
          nextPage: page < totalPages ? page + 1 : null,
          prevPage: page > 1 ? page - 1 : null,
          isFirstPage: page === 1,
          isLastPage: page === totalPages,
        };

        const pageData = {
          blog,
          posts: pagePosts,
          pages,
          pagination,
          generatorName,
          generatorVersion,
        };

        if (page === 1) {
          paginationTasks.push(
            Promise.resolve({ name: 'index.html', content: compiledTemplates.index(pageData) })
          );
        }
        paginationTasks.push(
          Promise.resolve({
            name: `page/${page}/index.html`,
            content: compiledTemplates.index(pageData),
          })
        );
      }

      files.push(...(await Promise.all(paginationTasks)));

      logger.info('Generating post pages...');
      // posts are sorted newest-first, so index-1 is newer and index+1 is older.
      const postFiles = await Promise.all(
        posts.map(async (post, i) => ({
          name: `${post.slug}/index.html`,
          content: compiledTemplates.post({
            blog,
            post,
            posts,
            pages,
            newerPost: posts[i - 1],
            olderPost: posts[i + 1],
            generatorName,
            generatorVersion,
          }),
        }))
      );
      files.push(...postFiles);

      logger.info('Generating static pages...');
      const pageFiles = await Promise.all(
        pages.map(async (page) => {
          const template =
            page.layout === 'grid' && compiledTemplates.pageGrid
              ? compiledTemplates.pageGrid
              : compiledTemplates.page;
          return {
            name: `${page.slug}/index.html`,
            content: template({ blog, page, posts, pages, generatorName, generatorVersion }),
          };
        })
      );
      files.push(...pageFiles);

      logger.info('Generating tag pages...');
      const tagMap = new Map<string, BlogPost[]>();
      for (const post of posts) {
        if (post.tags) {
          for (const tag of post.tags) {
            if (!tagMap.has(tag)) tagMap.set(tag, []);
            tagMap.get(tag)!.push(post);
          }
        }
      }
      const tagFiles = await Promise.all(
        Array.from(tagMap.entries()).map(async ([tag, tagPosts]) => ({
          name: `tag/${slug(tag)}/index.html`,
          content: compiledTemplates.tag({
            blog,
            tag,
            posts: tagPosts,
            pages,
            generatorName,
            generatorVersion,
          }),
        }))
      );
      files.push(...tagFiles);

      logger.info('Generating category pages...');
      const categoryMap = new Map<string, BlogPost[]>();
      for (const post of posts) {
        if (post.categories) {
          for (const category of post.categories) {
            if (!categoryMap.has(category)) categoryMap.set(category, []);
            categoryMap.get(category)!.push(post);
          }
        }
      }
      const categoryFiles = await Promise.all(
        Array.from(categoryMap.entries()).map(async ([category, categoryPosts]) => ({
          name: `category/${slug(category)}/index.html`,
          content: compiledTemplates.category({
            blog,
            category,
            posts: categoryPosts,
            pages,
            generatorName,
            generatorVersion,
          }),
        }))
      );
      files.push(...categoryFiles);

      logger.info('Generating RSS feed...');
      // Canonical origin: `blog.site.url` is the source of truth; `meta.canonical`
      // is accepted for back-compat. Builds must be deterministic, so we never fall
      // back to `new Date()` — feed/sitemap dates come from post dates or are omitted.
      const siteUrl = blog.site.url || blog.meta?.canonical || 'https://example.com';
      // The feed's build date is the most recent post date (posts are sorted newest
      // first), keeping the output reproducible.
      const feedPubDate = posts.find((p) => p.createdAt)?.createdAt;

      const feed = new RSS({
        title: blog.site.title,
        description: blog.site.description,
        generator: 'JsonBlog Generator',
        feed_url: `${siteUrl}/rss.xml`,
        site_url: siteUrl,
        image_url: blog.basics.image,
        language: 'en',
        ...(feedPubDate ? { pubDate: feedPubDate } : {}),
        ttl: 60,
      });

      const stripHtml = (html: string): string => html.replace(/<[^>]*>/g, '').trim();
      for (const post of posts.slice(0, 20)) {
        const plainTextContent = post.content ? stripHtml(post.content) : '';
        const description =
          post.description ||
          plainTextContent.substring(0, 200) + (plainTextContent.length > 200 ? '...' : '');
        // Built as a loose object so `date` can be omitted (the rss types require
        // it) — omitting keeps builds deterministic for undated posts.
        const item: Record<string, unknown> = {
          title: post.title,
          description,
          url: `${siteUrl}/${post.slug}/`,
          guid: `${siteUrl}/${post.slug}/`,
          categories: [...(post.tags || []), ...(post.categories || [])],
        };
        if (post.createdAt) item.date = post.createdAt;
        feed.item(item as unknown as Parameters<typeof feed.item>[0]);
      }
      // The rss library injects a `<lastBuildDate>` of `new Date()`; pin it to the
      // deterministic feed date (or drop it) so the build is reproducible.
      let rssXml = feed.xml({ indent: true });
      rssXml = feedPubDate
        ? rssXml.replace(
            /<lastBuildDate>[^<]*<\/lastBuildDate>/,
            `<lastBuildDate>${new Date(feedPubDate).toUTCString()}</lastBuildDate>`
          )
        : rssXml.replace(/<lastBuildDate>[^<]*<\/lastBuildDate>\s*/, '');
      files.push({ name: 'rss.xml', content: rssXml });

      logger.info('Generating sitemap...');
      const urls: string[] = [];
      urls.push(`  <url>
    <loc>${siteUrl}/</loc>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>`);
      const lastmodLine = (d?: string) => (d ? `\n    <lastmod>${d}</lastmod>` : '');
      for (const post of posts) {
        urls.push(`  <url>
    <loc>${siteUrl}/${post.slug}/</loc>${lastmodLine(post.updatedAt || post.createdAt)}
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`);
      }
      for (const page of pages) {
        urls.push(`  <url>
    <loc>${siteUrl}/${page.slug}/</loc>${lastmodLine(page.updatedAt || page.createdAt)}
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`);
      }
      for (const [tag] of tagMap) {
        urls.push(`  <url>
    <loc>${siteUrl}/tag/${slug(tag)}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`);
      }
      for (const [category] of categoryMap) {
        urls.push(`  <url>
    <loc>${siteUrl}/category/${slug(category)}/</loc>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>`);
      }
      for (let page = 2; page <= totalPages; page++) {
        urls.push(`  <url>
    <loc>${siteUrl}/page/${page}/</loc>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`);
      }
      const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;
      files.push({ name: 'sitemap.xml', content: sitemap });

      logger.info('Adding CSS file...');
      files.push({ name: 'main.css', content: css });

      logger.info({ filesGenerated: files.length }, 'Blog generation completed successfully');
      return files;
    } catch (error) {
      logger.error({ error }, 'Blog generation failed');
      throw error;
    }
  };
}
