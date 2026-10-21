# @jsonblog/generator-boilerplate

## 5.0.1

### Patch Changes

- [`dbf9106`](https://github.com/jsonblog/jsonblog/commit/dbf910655032a864362bfa96ccc4b63385af1ecb) Thanks [@thomasdavis](https://github.com/thomasdavis)! - Bug fixes and modernization:

  - **generator-boilerplate**: fix flat-URL 404s — templates now emit directory URLs (`/slug/`) matching the engine output.
  - **schema**: add `site.url` as the canonical-origin field; drop the unused ajv dependency and orphaned CLI.
  - **cli**: fix the ESM `init` crash, report the real `--version`, exit non-zero on build/validation failure, clean human-readable output, and add `jsonblog validate` and `jsonblog dev` (live-reload). `init` now scaffolds runnable sample content and guards against clobbering with `--force`.
  - Deterministic builds across all generators (no `new Date()` in output); canonical/OG/RSS/sitemap URLs derive from `blog.site.url`.
  - Correct dual ESM/CJS type exports (publint + are-the-types-wrong clean).

- Updated dependencies [[`dbf9106`](https://github.com/jsonblog/jsonblog/commit/dbf910655032a864362bfa96ccc4b63385af1ecb), [`dbf9106`](https://github.com/jsonblog/jsonblog/commit/dbf910655032a864362bfa96ccc4b63385af1ecb)]:
  - @jsonblog/core@1.1.0
  - @jsonblog/schema@3.2.0

## 5.0.0

### Major Changes

- Implement directory-based pretty URLs and add interactive particle animation

  **BREAKING CHANGE: File Structure**

  Both generators now use directory-based URLs (e.g., `/post-slug/index.html` instead of `/post-slug.html`). This enables pretty URLs that work on ALL platforms without server configuration.

  **Generated File Structure Changes:**

  - Posts: `post-slug.html` → `post-slug/index.html`
  - Pages: `about.html` → `about/index.html`
  - Tags: `tag/javascript.html` → `tag/javascript/index.html`
  - Categories: `category/tutorial.html` → `category/tutorial/index.html`
  - Pagination: `page/2.html` → `page/2/index.html`

  **Benefits:**

  - ✅ Pretty URLs work everywhere (GitHub Pages, Netlify, Vercel, S3, etc.)
  - ✅ No server configuration required
  - ✅ Industry-standard approach (same as Jekyll, Hugo, Gatsby)
  - ✅ SEO-friendly clean URLs

  **Updated:**

  - RSS feed URLs now use trailing slashes
  - Sitemap URLs now use trailing slashes
  - Dev server routing updated to handle directory structure

  **Tailwind Generator: Interactive Particle Animation**

  Replaced gradient hover effect with physics-based particle animation using tsparticles:

  - Blue particle network matching site accent color (#0066cc)
  - Interactive on hover - particles connect when mouse is near
  - Smooth, performant animation with 40 particles
  - Subtle opacity and size animations
  - ~100KB library size via CDN

  **Migration Guide:**

  If you have custom server rules that depend on `.html` extensions, you may need to update them. The new structure works automatically on most platforms:

  - **Vercel**: Works automatically, no changes needed
  - **Netlify**: Works automatically, no changes needed
  - **GitHub Pages**: Works automatically, no changes needed
  - **Nginx**: Add `try_files $uri $uri/ $uri/index.html =404;`
  - **Apache**: Already works with default settings

  **Technical Details:**

  - Dev servers updated to serve `/path/index.html` for `/path` requests
  - Template links remain unchanged (already used extensionless URLs)
  - All generators maintain consistent behavior

## 4.0.0 - 2025-11-20

### Major Changes

- Add generator configuration support

  Major enhancement allowing users to pass arbitrary configuration to generators through blog.json:

  **Schema Changes (@jsonblog/schema):**

  - Added `GeneratorConfigSchema` for validating generator configuration
  - Added optional `generator` field to `BlogSchema` with nested `name` and `config` properties
  - Both `name` and `config` fields are optional for maximum flexibility

  **CLI Changes (@jsonblog/cli):**

  - Added `getGeneratorName()` helper to extract generator name from blog.json (takes precedence over CLI flag)
  - Added `getGeneratorConfig()` helper to extract generator configuration
  - Updated `build()` function to pass configuration as 3rd parameter to generators
  - Updated `build` and `watch` commands to use new configuration system
  - Added logging to show when generator config is being used

  **Generator Changes (Breaking):**

  - Updated function signature to accept optional 3rd parameter: `generatorConfig: Record<string, any> = {}`
  - Both `@jsonblog/generator-boilerplate` and `@jsonblog/generator-tailwind` now support configuration
  - Generators log whether config is provided via `hasConfig` flag
  - Backward compatible: config parameter is optional with empty object default

  **Example Usage:**

  ```json
  {
    "site": { "title": "My Blog" },
    "basics": { "name": "Author" },
    "generator": {
      "name": "@jsonblog/generator-tailwind",
      "config": {
        "theme": {
          "colors": {
            "primary": "#007acc"
          }
        }
      }
    },
    "posts": [...]
  }
  ```

  **Breaking Change:**
  Custom generator implementations must update their function signature to accept the optional 3rd `generatorConfig` parameter. Generators that don't update will still work (JavaScript allows extra arguments) but won't receive configuration.

  **Design:**
  Follows industry best practices from Gatsby, Babel, webpack, and other plugin-based tools with nested configuration patterns.

### Patch Changes

- Updated dependencies []:
  - @jsonblog/schema@3.1.0

## 3.2.0 - 2025-11-20

### Minor Changes

- Redesign blog template for professional appearance

  Major design improvements inspired by professional engineering blogs (Stripe, Linear, Vercel):

  **Layout Changes:**

  - Redesigned header with semantic HTML (header/nav/main tags)
  - Removed old sidebar/hamburger navigation patterns
  - Cleaner navigation with improved spacing and hover states
  - Footer now links to jsonblog.dev instead of GitHub

  **Post Page Improvements:**

  - Post title now appears at top (larger, more prominent at 2.75rem)
  - Date displays underneath title for better hierarchy
  - Simplified AI indicator to subtle "AI-generated" badge
  - Tags moved to footer section after content
  - Better visual hierarchy with improved spacing

  **Styling Enhancements:**

  - Enhanced header with subtle bottom border for separation
  - Professional AI indicator styling (subtle gray badge)
  - Better spacing throughout (3rem margins, 2rem padding)
  - Cleaner navigation without heavy borders
  - Improved article title sizing and letter spacing

  The design now follows patterns from professional engineering blogs while maintaining the minimal black & white aesthetic.

## 3.1.0 - 2025-01-20

### Minor Changes

- a8442c7: Improve typography and add automatic syntax highlighting

  Major improvements to reading experience inspired by Medium.com:

  **Typography Enhancements:**

  - Increased base font size from 16px to 19px (20% larger) for better readability
  - Improved line-height from 1.6 to 1.75 for better breathing room
  - Increased max-width from 680px to 816px (20% wider)
  - Changed to system fonts for body text for native feel across devices
  - Improved heading hierarchy with larger sizes and better spacing
  - Better paragraph and list spacing throughout

  **Syntax Highlighting:**

  - Added Highlight.js for automatic syntax highlighting
  - Supports 190+ languages with auto-detection
  - Atom One Dark theme for professional code appearance
  - Dark code blocks with improved padding and border-radius

  **List & Code Improvements:**

  - Fixed ordered/unordered list indentation
  - Improved spacing between list items and nested lists
  - Better inline code styling with distinct backgrounds
  - Enhanced blockquotes, tables, and other elements

  **Visual Updates:**

  - Updated link colors to #0066cc for better contrast
  - Improved responsive breakpoints
  - Better table styling with zebra striping
  - Enhanced overall visual hierarchy

  Breaking change: Body font changed from IBM Plex Mono to system fonts. IBM Plex Mono is now used only for code blocks.

## 3.0.0

### Major Changes

- # Major Release: Monorepo Migration & Package Renaming

  ## Breaking Changes

  All packages have been renamed with the `@jsonblog/` scope and migrated to a modern Turborepo + pnpm monorepo:

  - `jsonblog-schema` → `@jsonblog/schema`
  - `jsonblog-generator-boilerplate` → `@jsonblog/generator-boilerplate`
  - `jsonblog-cli` → `@jsonblog/cli`

  ## Module System

  - Packages now provide **dual ESM + CJS builds** for maximum compatibility
  - CLI is ESM-only (requires Node.js 20+)
  - Proper package exports with TypeScript types

  ## Migration Guide

  ### Installation

  ```bash
  # Old
  npm install jsonblog-schema jsonblog-generator-boilerplate jsonblog-cli

  # New
  npm install @jsonblog/schema @jsonblog/generator-boilerplate @jsonblog/cli
  ```

  ### Imports

  ```typescript
  // Old
  import schema from "jsonblog-schema";
  const generator = require("jsonblog-generator-boilerplate");

  // New
  import * as schema from "@jsonblog/schema";
  import { generateBlog } from "@jsonblog/generator-boilerplate";
  ```

  ## Improvements

  - ⚡ Faster builds with Turborepo caching
  - 📦 Better package management with pnpm workspaces
  - 🔄 Coordinated releases with Changesets
  - 🎯 Modern ESM/CJS dual builds
  - 🛠️ Improved TypeScript support

  ## Technical Details

  - Built with **tsup** for fast, optimized bundles
  - External dependencies properly handled (no bundling issues)
  - ESM-compatible with `import.meta.url` support
  - Fixed `__dirname` usage for ESM compatibility

  ## Repository

  All packages now live in a unified monorepo: https://github.com/jsonblog/jsonblog

### Patch Changes

- Updated dependencies
  - @jsonblog/schema@3.0.0
