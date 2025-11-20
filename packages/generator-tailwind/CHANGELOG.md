# @jsonblog/generator-tailwind

## 2.1.0 - 2025-11-20

### Minor Changes

- Enhance header design, reduce font sizes, and remove .html extensions

  **Visual Improvements:**
  - Enhanced header with bold title, blue accent underline, italic description
  - Animated navigation underlines that grow on hover
  - Header hover effect with blue accent line sweep

  **Font Size Reduction (-10%):**
  - Base font: 19px → 17px
  - All headings and UI elements scaled proportionally

  **Pretty URLs:**
  - Removed .html extensions from all links
  - Configure hosting with `cleanUrls: true` for Vercel

## 2.0.1 - 2025-11-20

### Patch Changes

- Fix Tailwind generator to use proper utility classes

  **Problem**: The generator was using semantic CSS classes (`.post-card`, `.title`, etc.) instead of Tailwind utility classes, causing templates to not display correctly even though Tailwind CSS was properly included.

  **Solution**: Converted all templates to use Tailwind utility classes directly, following the jsonblog.dev homepage design system.

  **Changes**:
  - Updated `input.css` to remove semantic component classes, keeping only base styles and content utilities
  - Converted all templates (layout, index, post, page, tag, category) to use Tailwind utility classes
  - Added subtle animations (fade-in on page load, hover effects on cards and buttons)
  - Implemented hover states with scale and color transitions
  - Maintained professional design inspired by jsonblog.dev homepage
  - Reduced CSS bundle size from 14KB to 12KB

  **Design Features**:
  - IBM Plex Mono font for monospace aesthetic
  - Clean black/white/gray color scheme with #0066cc accent
  - Smooth transitions on all interactive elements
  - Hover effects: cards translate up, buttons scale and invert colors
  - Fade-in animation on page load for header and content
  - Responsive design with mobile-first approach
  - AI-generated post badges with distinct styling

  **Visual Improvements**:
  - Post cards have subtle hover lift effect
  - Tags and pagination buttons have smooth color inversion on hover
  - Navigation links have color transition on hover
  - Proper spacing and typography hierarchy
  - Professional, minimal aesthetic matching homepage

  All functionality remains the same - this is a pure visual/styling fix to make the Tailwind generator work as intended.

## 2.0.0 - 2025-11-20

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

## 1.0.0 - 2025-11-20

### Minor Changes

- Initial release of Tailwind CSS generator

  New package providing Tailwind CSS-powered static blog generation:

  **Features:**
  - Build-time Tailwind CSS compilation with CLI
  - Utility-first CSS approach with optimized bundle (~14KB)
  - All features from generator-boilerplate (tags, pagination, RSS, sitemap)
  - Professional design matching boilerplate aesthetics
  - Customizable via tailwind.config.js
  - Same API and template structure as generator-boilerplate

  **Why Tailwind?**
  - Modern utility-first CSS framework
  - Excellent for rapid prototyping
  - Easy theme customization
  - Responsive design built-in
  - Industry-standard approach

  Users can now choose between custom CSS (@jsonblog/generator-boilerplate) or Tailwind CSS (@jsonblog/generator-tailwind) based on their preferences.

---

# Previous History (Copied from generator-boilerplate)

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
  import schema from 'jsonblog-schema';
  const generator = require('jsonblog-generator-boilerplate');

  // New
  import * as schema from '@jsonblog/schema';
  import { generateBlog } from '@jsonblog/generator-boilerplate';
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
