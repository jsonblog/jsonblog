# @jsonblog/cli

## 3.1.0 - 2025-11-20

### Minor Changes

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
  - @jsonblog/generator-boilerplate@4.0.0

## 3.0.2 - 2025-11-20

### Patch Changes

- Updated dependencies with professional design improvements
  - @jsonblog/generator-boilerplate@3.2.0
    - Redesigned header with semantic HTML and cleaner navigation
    - Post title now at top with date underneath for better hierarchy
    - Simplified AI indicator to subtle "AI-generated" badge
    - Tags moved to footer section after content
    - Professional styling inspired by Stripe, Linear, Vercel
    - Footer now links to jsonblog.dev
    - Enhanced spacing and typography throughout

## 3.0.1 - 2025-01-20

### Patch Changes

- Updated dependencies with major typography improvements
  - @jsonblog/generator-boilerplate@3.1.0
    - Typography improvements (19px font, 816px width, system fonts)
    - Automatic syntax highlighting with Highlight.js
    - Better list indentation and spacing
    - Improved code block styling
    - Enhanced readability throughout

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
  - @jsonblog/generator-boilerplate@3.0.0
