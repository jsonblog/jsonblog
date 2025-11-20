# JSONBlog Project - Claude's Technical Documentation

This document contains comprehensive technical knowledge about the JSONBlog monorepo, its architecture, and how all the pieces fit together.

## Table of Contents

1. [Project Overview](#project-overview)
2. [Monorepo Structure](#monorepo-structure)
3. [Package Architecture](#package-architecture)
4. [Build System](#build-system)
5. [Publishing & Versioning](#publishing--versioning)
6. [Generator System](#generator-system)
7. [Template System](#template-system)
8. [Typography & Design](#typography--design)
9. [Development Workflow](#development-workflow)
10. [Testing](#testing)
11. [Deployment](#deployment)

---

## Project Overview

**JSONBlog** is a simple, JSON-based static blog generator. Users create a `blog.json` file with their content, and JSONBlog generates a complete static website.

### Key Philosophy
- **Zero configuration**: Just a JSON file and one command
- **Simple data format**: All blog content in a single JSON file
- **Static output**: Fast, secure HTML files
- **Extensible**: Custom generators for different styles
- **Monorepo**: All packages maintained together for consistency

---

## Monorepo Structure

```
jsonblog/
├── apps/
│   ├── cli/                    # @jsonblog/cli - Command-line interface
│   ├── homepage/               # @jsonblog/homepage - Next.js marketing site
│   └── website/                # Legacy Jekyll site (not in workspace)
│
├── packages/
│   ├── schema/                 # @jsonblog/schema - JSON Schema & validation
│   ├── generator-boilerplate/  # @jsonblog/generator-boilerplate - Custom CSS generator
│   ├── generator-tailwind/     # @jsonblog/generator-tailwind - Tailwind CSS generator
│   └── tsconfig/               # @jsonblog/tsconfig - Shared TypeScript configs (internal)
│
├── .changeset/                 # Changesets for version management
├── .github/workflows/          # CI/CD automation
└── Configuration files
```

### Workspace Protocol

The monorepo uses **pnpm workspaces** with the `workspace:*` protocol:

```json
{
  "dependencies": {
    "@jsonblog/schema": "workspace:*",
    "@jsonblog/generator-boilerplate": "workspace:*"
  }
}
```

This ensures packages always use the latest local version during development, and gets replaced with actual version numbers during publishing.

---

## Package Architecture

### 1. @jsonblog/schema (Foundation Layer)

**Purpose**: Defines and validates the blog.json structure

**Key Files**:
- `schema.json` - JSON Schema definition
- `src/index.ts` - Zod schema and TypeScript types
- `src/cli/validate.ts` - CLI validation tool

**Type System**:
```typescript
export interface BlogData {
  site: {
    title: string;
    description?: string;
    url?: string;
  };
  basics?: {
    name?: string;
    email?: string;
    url?: string;
  };
  posts?: BlogPost[];
  pages?: BlogPage[];
}

export interface BlogPost {
  title: string;
  content?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  slug?: string;
  tags?: string[];
  categories?: string[];
  type?: 'ai' | 'human';  // For AI-generated content
}
```

**Validation**: Uses both JSON Schema (Ajv) and Zod for runtime validation

### 2. @jsonblog/generator-boilerplate (Generator Layer)

**Purpose**: Reference implementation that generates static HTML from blog.json

**Key Features**:
- Handlebars templating
- Markdown-it for content rendering
- RSS feed generation
- Sitemap generation
- Tag and category pages
- Pagination support
- AI post indicators
- Syntax highlighting (Highlight.js)

**Template Engine**:
Uses Handlebars with custom helpers:
```javascript
Handlebars.registerHelper('formatDate', (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

Handlebars.registerHelper('slugify', (text) => {
  return slugify(text, { lower: true, strict: true });
});

Handlebars.registerHelper('eq', (a, b) => a === b);
```

**Generator Interface**:
```typescript
export async function generate(
  blogData: BlogData,
  options: { outputDir: string; basePath?: string }
): Promise<void>
```

**File Structure**:
```
generator-boilerplate/
├── src/
│   ├── index.ts         # Main generator logic
│   ├── dev-server.ts    # Development server with live reload
│   └── types.ts         # TypeScript interfaces
├── templates/
│   ├── layout.hbs       # Base layout with header/footer
│   ├── index.hbs        # Homepage post listing
│   ├── post.hbs         # Individual post page
│   ├── page.hbs         # Static pages (About, etc.)
│   ├── tag.hbs          # Tag archive pages
│   ├── category.hbs     # Category archive pages
│   └── main.css         # Stylesheet (Medium-inspired)
└── assets/
    └── github.svg       # Static assets
```

### 3. @jsonblog/cli (Application Layer)

**Purpose**: Command-line interface for users

**Commands**:
```bash
jsonblog build [file]           # Build static site (default: blog.json)
jsonblog serve [file]           # Serve built site locally
jsonblog dev [file]             # Watch mode with auto-rebuild
jsonblog validate [file]        # Validate blog.json against schema
```

**Implementation**:
- Uses Commander.js for CLI parsing
- Pino for logging with pretty output
- Chokidar for file watching in dev mode
- Express for dev server

**Key Logic**:
```typescript
// CLI loads generator dynamically
const generator = await import('@jsonblog/generator-boilerplate');
await generator.generate(blogData, { outputDir: 'build' });
```

### 4. @jsonblog/homepage (Marketing Site)

**Purpose**: Next.js website documenting JSONBlog

**Features**:
- Getting started guide
- Schema documentation
- Generators documentation
- Auto-generated changelogs from CHANGELOG.md files
- Deployed on Vercel

**Changelog Parser**:
```typescript
// Reads CHANGELOG.md from each package at build time
export function getChangelogs(): PackageChangelog[] {
  const packages = [
    { name: '@jsonblog/cli', path: 'apps/cli' },
    { name: '@jsonblog/schema', path: 'packages/schema' },
    { name: '@jsonblog/generator-boilerplate', path: 'packages/generator-boilerplate' },
  ];

  // Parse markdown and return structured data
}
```

---

## Build System

### Turborepo Configuration

**File**: `turbo.json`

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],  // Build dependencies first
      "outputs": ["dist/**", ".next/**", "build/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

**Build Process**:
1. Turbo analyzes dependency graph
2. Builds packages in topological order:
   - @jsonblog/schema (no dependencies)
   - @jsonblog/generator-boilerplate (depends on schema)
   - @jsonblog/cli (depends on schema + generator)
   - @jsonblog/homepage (depends on schema + generator)

**Cache Benefits**:
- Turbo caches build outputs
- Rebuilds only changed packages
- Parallel execution where possible
- Achieved 65ms builds with full cache

### tsup Configuration

All packages use **tsup** for building (fast TypeScript bundler):

```typescript
// packages/generator-boilerplate/tsup.config.ts
export default defineConfig({
  entry: ['src/index.ts', 'src/dev-server.ts'],
  format: ['esm', 'cjs'],  // Dual format for compatibility
  dts: true,               // Generate .d.ts files
  external: [
    // Externalize all dependencies (don't bundle)
    'axios', 'handlebars', 'markdown-it', 'rss', 'slugify'
  ],
  clean: true,
  sourcemap: true,
});
```

**Why Externalize?**
- Prevents bundling issues with dynamic requires
- Smaller bundle size
- Respects peer dependencies
- Fixes `import.meta` in dual builds

---

## Publishing & Versioning

### Changesets Workflow

**Configuration**: `.changeset/config.json`

```json
{
  "changelog": [
    "@changesets/changelog-github",
    { "repo": "jsonblog/jsonblog" }
  ],
  "commit": false,
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": ["@jsonblog/tsconfig", "@jsonblog/homepage"]
}
```

**Important**: We use `@changesets/changelog-github` instead of the default changelog generator because:
- **Adds dates automatically**: Generates entries like `## 3.1.0 - 2025-01-20`
- **Links to commits and PRs**: Better traceability
- **Better formatting**: More detailed and professional
- **Homepage compatibility**: Our changelog parser expects the date format that changelog-github provides

**Creating a Changeset**:
```bash
pnpm changeset
# Or manually create .changeset/my-change.md
```

**Changeset Format**:
```markdown
---
"@jsonblog/generator-boilerplate": minor
"@jsonblog/cli": patch
---

Description of changes
```

**Publishing Process**:
```bash
# 1. Create changeset (describe your changes)
pnpm changeset
# Or manually: cat > .changeset/my-change.md << 'EOF'

# 2. Apply changesets (updates versions & CHANGELOGs)
pnpm changeset version
# Note: May fail with GitHub token error - that's okay, proceed manually

# 3. Manual version bump (if changeset version fails):
# - Update package.json version in affected packages
# - Update CHANGELOG.md with date format: ## X.Y.Z - YYYY-MM-DD
# - Remove .changeset/*.md files after applying

# 4. Build all packages
pnpm build

# 5. Commit version changes
git add .
git commit -m "Version bumps: package@version"

# 6. Publish to npm
pnpm --filter <package-name> publish --access public
# Example: pnpm --filter @jsonblog/generator-tailwind publish --access public

# 7. Create git tags and push
git tag @jsonblog/package-name@X.Y.Z
git push origin main --follow-tags
```

**⚠️ IMPORTANT REMINDER: ALWAYS PUBLISH AFTER MAKING CHANGES**

When you complete work on a package:
1. **Never forget to publish!** - Changes aren't available until published to npm
2. Create changeset describing your changes
3. Apply versions (manually if needed)
4. Build packages
5. Publish to npm with --access public
6. Create git tags and push

**Common Publishing Mistakes to Avoid:**
- ❌ Committing changes without publishing
- ❌ Forgetting to build before publishing
- ❌ Not creating git tags
- ❌ Missing --access public flag (causes publish failures)
- ❌ Not updating CHANGELOG.md with date

**Version Strategy**:
- Independent versioning (each package has own version)
- Semantic versioning (major.minor.patch)
- CHANGELOG.md manually maintained (add dates in format: ## X.Y.Z - YYYY-MM-DD)
- Git tags created manually for each release

---

## Generator System

### How Generators Work

**1. User creates blog.json**:
```json
{
  "site": { "title": "My Blog" },
  "posts": [
    {
      "title": "Hello World",
      "content": "# Hello\n\nFirst post!",
      "createdAt": "2025-01-20"
    }
  ]
}
```

**2. CLI loads generator**:
```typescript
const generator = await import('@jsonblog/generator-boilerplate');
```

**3. Generator processes data**:
```typescript
// Read blog.json
const blogData = JSON.parse(fs.readFileSync('blog.json', 'utf-8'));

// Validate with schema
const validated = BlogSchema.parse(blogData);

// Process posts (add slugs, sort by date)
const posts = validated.posts?.map(post => ({
  ...post,
  slug: post.slug || slugify(post.title)
})).sort((a, b) =>
  new Date(b.createdAt) - new Date(a.createdAt)
);

// Render templates
for (const post of posts) {
  const html = Handlebars.compile(postTemplate)({
    blog: blogData,
    post,
    pages: validated.pages
  });

  fs.writeFileSync(`build/${post.slug}.html`, html);
}
```

**4. Output structure**:
```
build/
├── index.html              # Homepage with post list
├── my-first-post.html      # Individual post pages
├── about.html              # Static pages
├── tag/
│   ├── javascript.html     # Tag archive pages
│   └── design.html
├── category/
│   └── tutorials.html      # Category archive pages
├── rss.xml                 # RSS feed
├── sitemap.xml             # Sitemap
└── main.css                # Stylesheet
```

### Custom Generators

Users can create their own generators:

```typescript
// my-generator/index.ts
import type { BlogData } from '@jsonblog/schema';

export async function generate(
  data: BlogData,
  options: { outputDir: string }
): Promise<void> {
  // Custom logic here
  // Use any template engine (React, Vue, Pug, etc.)
}
```

**Using custom generator**:
```bash
jsonblog build --generator my-generator
```

---

## Template System

### Handlebars Templates

**Layout Pattern** (`layout.hbs`):
```handlebars
<!doctype html>
<html>
<head>
  <title>{{#if post}}{{post.title}} - {{/if}}{{blog.site.title}}</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css">
  <link rel="stylesheet" href="main.css">
</head>
<body>
  <div class="title">{{blog.site.title}}</div>
  <div class="pages">
    <a href="/">Home</a>
    {{#each pages}}
      <a href="{{slug}}.html">{{title}}</a>
    {{/each}}
  </div>

  {{> content}}

  <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
  <script>hljs.highlightAll();</script>
</body>
</html>
```

**Partials** (`{{> content}}`):
- `index.hbs` - Post listing for homepage
- `post.hbs` - Individual post content
- `page.hbs` - Static page content

**Conditional Logic**:
```handlebars
{{#if (eq post.type 'ai')}}
  <span class="ai-badge">[AI-Generated]</span>
{{/if}}

{{#each posts}}
  <article class="{{#if (eq this.type 'ai')}}ai-post{{/if}}">
    <!-- ... -->
  </article>
{{/each}}
```

---

## Typography & Design

### Design Philosophy

Inspired by **Medium.com** and reading-focused platforms:

1. **Optimal readability**
2. **Generous whitespace**
3. **Clear hierarchy**
4. **Professional typography**

### Typography Specs

**Font Stack**:
```css
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

code, pre {
  font-family: 'IBM Plex Mono', 'Monaco', 'Courier New', monospace;
}
```

**Sizing**:
```css
body { font-size: 19px; }      /* 20% larger than typical */
h1 { font-size: 2.5rem; }      /* 47.5px */
h2 { font-size: 1.8rem; }      /* 34.2px */
h3 { font-size: 1.4rem; }      /* 26.6px */
h4 { font-size: 1.1rem; }      /* 20.9px */
```

**Spacing**:
```css
body { line-height: 1.75; }    /* Breathing room */
p { margin-bottom: 1.5rem; }
h1, h2, h3, h4 {
  margin-top: 2.5rem;
  margin-bottom: 1.5rem;
}
```

**Layout**:
```css
body {
  max-width: 816px;            /* 20% wider, ~70 chars/line */
  margin: 2rem auto;
  padding: 0 2rem;
}
```

### Syntax Highlighting

**Highlight.js Integration**:
- Auto-detects 190+ languages
- Atom One Dark theme
- Works with code blocks: ```language
- CDN-based (no build step)

**Code Block Styling**:
```css
pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid #333;
  overflow-x: auto;
}

/* Inline code */
code {
  background: #f5f5f5;
  color: #c7254e;
  padding: 0.2em 0.4em;
  border-radius: 3px;
}
```

### AI Post Styling

Posts with `"type": "ai"` get dimmed styling:

```css
.ai-post h2 {
  font-size: 1.2rem;    /* Smaller than regular */
  color: #666;           /* Dimmed */
  opacity: 0.85;
}

.ai-badge {
  display: inline-block;
  font-size: 0.7em;
  color: #888;
  border: 1px solid #ccc;
  padding: 3px 8px;
  background: #f8f8f8;
  border-radius: 3px;
}
```

---

## Development Workflow

### Local Development

**1. Install dependencies**:
```bash
pnpm install
```

**2. Build all packages**:
```bash
pnpm build
```

**3. Development mode** (watch for changes):
```bash
pnpm dev
```

**4. Test CLI locally**:
```bash
# From any directory with blog.json:
node /path/to/jsonblog/apps/cli/dist/index.js build
```

### Testing Changes

**Create test blog**:
```bash
mkdir /tmp/test-blog
cd /tmp/test-blog
cat > blog.json << 'EOF'
{
  "site": { "title": "Test" },
  "posts": [{ "title": "Test Post", "content": "# Test" }]
}
EOF

# Build with local CLI
node /path/to/jsonblog/apps/cli/dist/index.js build

# View output
open build/index.html
```

### Adding New Features

**1. Create changeset**:
```bash
# Manually create .changeset/feature-name.md
```

**2. Update code**:
```typescript
// packages/generator-boilerplate/src/index.ts
// Make changes...
```

**3. Update templates** if needed:
```handlebars
<!-- packages/generator-boilerplate/templates/post.hbs -->
```

**4. Update CSS** if needed:
```css
/* packages/generator-boilerplate/templates/main.css */
```

**5. Build and test**:
```bash
pnpm build
# Test with sample blog
```

**6. Commit**:
```bash
git add .
git commit -m "Add new feature"
git push
```

**7. Release** (when ready):
```bash
pnpm changeset version  # Apply changesets
pnpm build             # Build all
pnpm release           # Publish to npm
```

---

## Testing

### Package Structure

Each package has tests in `src/__tests__/`:

```
packages/schema/
└── src/
    └── __tests__/
        └── schema.test.ts

packages/generator-boilerplate/
└── src/
    └── __tests__/
        ├── index.test.ts
        ├── rss.test.ts
        ├── sitemap.test.ts
        └── tags-categories.test.ts
```

### Jest Configuration

**Standard across packages**:
```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts'],
  collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts']
};
```

### Running Tests

```bash
# All tests
pnpm test

# Specific package
pnpm --filter @jsonblog/schema test

# With coverage
pnpm test -- --coverage
```

---

## Deployment

### Publishing to npm

**Requirements**:
- npm account with 2FA
- Access to @jsonblog organization
- Clean working directory

**Process**:
```bash
# 1. Version packages
pnpm changeset version

# 2. Build
pnpm build

# 3. Publish (requires npm auth)
pnpm release
```

**CI/CD** (`.github/workflows/release.yml`):
```yaml
name: Release

on:
  push:
    branches: [main]

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - run: pnpm install
      - run: pnpm build
      - run: pnpm changeset publish
        env:
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Homepage Deployment (Vercel)

**1. Connect GitHub repo to Vercel**

**2. Configure**:
- Root directory: `apps/homepage`
- Build command: `pnpm turbo run build --filter=@jsonblog/homepage`
- Output directory: `.next`
- Install command: `pnpm install`

**3. Deploy**:
- Automatic on push to `main`
- Changelogs auto-update via build-time parsing

---

## Key Learnings

### 1. Monorepo Benefits
- Single source of truth
- Consistent tooling
- Easy refactoring across packages
- Shared dependencies

### 2. Workspace Protocol
- `workspace:*` for development
- Replaced with versions on publish
- Ensures latest local code is used

### 3. Turborepo Caching
- Massive speed improvements
- Intelligent dependency graph
- Parallel execution where possible

### 4. ESM/CJS Dual Builds
- Required for compatibility
- Use tsup with externals
- Handle `import.meta` carefully

### 5. Template System
- Handlebars is simple and effective
- Custom helpers add power
- Partials enable reuse

### 6. Typography Matters
- Medium-inspired design improves UX
- Larger fonts aid readability
- Generous spacing reduces fatigue

### 7. Syntax Highlighting
- Highlight.js is excellent for static sites
- Auto-detection works great
- CDN integration is simple

### 8. Changesets
- Essential for version coordination
- Auto-generates CHANGELOGs
- Integrates with CI/CD

### 9. Testing Strategy
- Jest for unit tests
- Integration tests with temp dirs
- Coverage tracking

### 10. Documentation
- README per package
- This claude.md for deep knowledge
- Examples in samples/

---

## Common Issues & Solutions

### Issue: tsup can't find @jsonblog/tsconfig

**Solution**: TypeScript packages don't need to extend from @jsonblog/tsconfig. Remove the extends or use relative paths.

### Issue: Dynamic require not supported in ESM

**Solution**: Externalize dependencies in tsup.config.ts instead of bundling them.

### Issue: import.meta is not available in CJS

**Solution**: This is expected. ESM gets `import.meta`, CJS gets empty object. Use conditional logic if needed.

### Issue: Changeset interactive mode fails

**Solution**: Create changeset files manually in `.changeset/` directory.

### Issue: Build fails with "file not found"

**Solution**: Run `pnpm install` to ensure all dependencies are installed and linked.

### Issue: Templates not updating after changes

**Solution**: Rebuild the generator package: `pnpm --filter @jsonblog/generator-boilerplate build`

---

## Future Enhancements

### Potential Features
- [ ] Dark mode support
- [ ] Search functionality
- [ ] Image optimization
- [ ] Social media meta tags (Open Graph, Twitter Cards)
- [ ] Comment system integration
- [ ] Analytics integration
- [ ] Multiple theme support
- [ ] Plugin system
- [ ] i18n support
- [ ] Draft posts
- [ ] Scheduled publishing

### Generator Ideas
- React-based generator with Vite
- Vue-based generator
- Minimal brutalist theme
- Magazine-style layout
- Portfolio-focused theme

---

## Resources

### External Documentation
- [Turborepo Docs](https://turbo.build/repo/docs)
- [pnpm Workspaces](https://pnpm.io/workspaces)
- [Changesets Guide](https://github.com/changesets/changesets)
- [Handlebars Docs](https://handlebarsjs.com/)
- [Highlight.js](https://highlightjs.org/)

### Internal Documentation
- `/packages/schema/README.md` - Schema documentation
- `/packages/generator-boilerplate/README.md` - Generator guide
- `/apps/cli/README.md` - CLI usage
- `/apps/homepage/README.md` - Homepage development

---

**Last Updated**: January 20, 2025
**Claude Code Version**: This documentation was created by Claude Code during the development and setup of the JSONBlog monorepo.
