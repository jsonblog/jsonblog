# JSONBlog Homepage

The official homepage and documentation site for JSONBlog.

## Development

```bash
# Install dependencies (from monorepo root)
pnpm install

# Run dev server
pnpm --filter @jsonblog/homepage dev

# Build for production
pnpm --filter @jsonblog/homepage build
```

## Features

- **Marketing site** - Explains what JSONBlog is and why to use it
- **Getting Started guide** - Installation and quick start instructions
- **Generators page** - Documentation for official and community generators
- **Schema reference** - Complete documentation of blog.json structure
- **Changelog** - Auto-generated from CHANGELOG.md files in each package

## Changelog Integration

The changelog page automatically reads CHANGELOG.md files from all published packages during build time. When you run `pnpm release` and publish new versions, the changelogs are updated and Vercel will automatically deploy the updated site.

## Deployment

This site is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set the root directory to `apps/homepage`
3. Vercel will auto-detect Next.js and configure the build
4. On every push to main, the site automatically deploys

The site rebuilds whenever CHANGELOG.md files are updated, ensuring the changelog page stays current.
