# @jsonblog/generator-boilerplate

## 3.1.0

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
