# @jsonblog/generator-mono

> Warm paper, serif prose, mono UI — a subtle editorial engineering theme for [JsonBlog](https://jsonblog.dev).

A JsonBlog generator that renders a calm, text-first blog: warm off-white paper, a serif reading column for prose, and a monospace UI for chrome (nav, dates, footer). It's the theme that powers [ajaxdavis.dev](https://ajaxdavis.dev) and is the flagship example of the JsonBlog generator contract.

## Install

```bash
npm install -g @jsonblog/cli @jsonblog/generator-mono
```

## Use

In your `blog.json`:

```json
{
  "site": { "title": "My Blog", "description": "…", "url": "https://example.dev" },
  "generator": { "name": "@jsonblog/generator-mono" }
}
```

Then:

```bash
jsonblog build      # → ./build (index.html, posts, pages, tags, rss.xml, sitemap.xml, main.css)
jsonblog dev        # build + serve + live-reload
```

## What it renders

- Paginated `index.html` + `page/N/index.html`
- Per-post pretty URLs (`post-slug/index.html`) with the leading `# H1` stripped (the template renders the title)
- Static pages, including a `grid` layout for link/video collections
- `tag/<t>/index.html` and `category/<c>/index.html`
- `rss.xml`, `sitemap.xml`, and `main.css`

## Contract

Implements the standard JsonBlog generator signature — a pure function returning the files to write; the CLI owns disk I/O:

```ts
generateBlog(blog, basePath, generatorConfig?) => Promise<{ name: string; content: string }[]>
```

## License

MIT © Thomas Davis
