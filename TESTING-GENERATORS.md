# Generator Testing Strategy

This document outlines strategies for efficiently testing JSONBlog generators during development.

## Quick Start: Test a Generator in 30 Seconds

```bash
# 1. Build the generator you're testing
pnpm --filter @jsonblog/generator-tailwind build

# 2. Use the test script (see below)
pnpm test:generator tailwind
```

---

## Strategy 1: Dedicated Test Directory with Sample Content

### Setup

Create a `test-blog/` directory in the monorepo root with rich sample content:

```bash
mkdir -p test-blog
```

Create `test-blog/blog.json`:

```json
{
  "site": {
    "title": "Test Blog - Editorial Design",
    "description": "Testing the editorial/magazine aesthetic with various content types",
    "url": "http://localhost:3000"
  },
  "basics": {
    "name": "Test Author",
    "email": "test@example.com"
  },
  "posts": [
    {
      "title": "The Art of Editorial Design in Digital Publishing",
      "slug": "editorial-design",
      "description": "Exploring how traditional print design principles translate to modern web experiences, with a focus on typography and sophisticated layouts.",
      "content": "# Introduction\n\nEditorial design has a rich history in print media. Publications like *Vogue*, *The New Yorker*, and *Harper's* have established timeless design principles that prioritize readability, elegance, and content hierarchy.\n\n## Typography Matters\n\nThe choice of typeface can make or break a design. Serif fonts like **Playfair Display** bring gravitas and sophistication, while complementary sans-serif options like **DM Sans** provide modern contrast.\n\n> \"Typography is what language looks like.\" — Ellen Lupton\n\nThis pull quote demonstrates how blockquotes are styled in our editorial theme.\n\n## Code Examples\n\nEven technical content deserves beautiful presentation:\n\n```javascript\nfunction createEditorialLayout(content) {\n  return {\n    typography: 'Playfair Display',\n    spacing: 'generous',\n    colors: 'burgundy and forest green'\n  };\n}\n```\n\n## Lists and Structure\n\nKey principles of editorial design:\n\n1. **Hierarchy**: Clear visual distinction between elements\n2. **White Space**: Generous margins and breathing room\n3. **Contrast**: Bold headings against refined body text\n4. **Consistency**: Repeating patterns that guide the eye\n\n### Unordered Lists\n\n- Drop caps on first paragraphs\n- Pull quotes for emphasis\n- Magazine-style post cards\n- Sophisticated color palettes\n\n## Tables\n\n| Element | Before | After |\n|---------|--------|-------|\n| Headings | Monospace | Playfair Display |\n| Body | 17px | 18px Lora |\n| Accent | Blue | Burgundy |\n| Layout | Simple list | Magazine grid |\n\n---\n\n## Conclusion\n\nBy combining traditional editorial principles with modern web technologies, we create experiences that honor content while delighting readers.",
      "createdAt": "2025-01-28",
      "categories": ["Design", "Typography"],
      "tags": ["editorial", "design", "typography", "web"]
    },
    {
      "title": "Building Sophisticated Color Palettes",
      "slug": "color-palettes",
      "description": "Moving beyond primary colors to create memorable, distinctive brand identities through thoughtful color selection.",
      "content": "# The Psychology of Color\n\nColor is more than decoration—it's communication. **Burgundy** (#8B2635) evokes sophistication and editorial quality. **Forest green** (#2C5F4D) brings natural depth and balance.\n\n## Color Harmony\n\nOur palette uses:\n- Primary: Deep burgundy\n- Secondary: Forest green  \n- Tertiary: Muted gold\n- Neutrals: Warm grays\n\n> \"Color is a power which directly influences the soul.\" — Wassily Kandinsky\n\nThis creates visual interest while maintaining sophistication.",
      "createdAt": "2025-01-27",
      "categories": ["Design"],
      "tags": ["color", "design", "branding"]
    },
    {
      "title": "The Future of Static Site Generators",
      "slug": "static-site-future",
      "description": "How static site generators are evolving to compete with dynamic platforms while maintaining their performance advantages.",
      "content": "# Static Sites in 2025\n\nStatic site generators have evolved significantly. Modern generators like JSONBlog combine:\n\n- **Simplicity**: Just a JSON file\n- **Flexibility**: Custom generators for any design\n- **Performance**: Fast, secure HTML output\n- **Design**: No compromise on aesthetics\n\n## Why Static?\n\n1. Security (no server-side code)\n2. Speed (pre-generated HTML)\n3. Simplicity (no database)\n4. Scalability (CDN-friendly)\n\nThe future is bright for static sites.",
      "createdAt": "2025-01-26",
      "categories": ["Technology"],
      "tags": ["jamstack", "performance", "web"],
      "type": "ai"
    },
    {
      "title": "Responsive Typography at Scale",
      "slug": "responsive-typography",
      "description": "Techniques for scaling typography across devices while maintaining readability and visual hierarchy.",
      "content": "# Mobile-First Typography\n\nResponsive typography requires careful planning:\n\n```css\n/* Base (mobile) */\nbody { font-size: 16px; }\nh1 { font-size: 1.75rem; }\n\n/* Tablet */\n@media (min-width: 768px) {\n  body { font-size: 18px; }\n  h1 { font-size: 2.5rem; }\n}\n\n/* Desktop */\n@media (min-width: 1024px) {\n  h1 { font-size: 3.5rem; }\n}\n```\n\nThis ensures readability at every breakpoint.",
      "createdAt": "2025-01-25",
      "categories": ["Design", "Development"],
      "tags": ["responsive", "typography", "css"]
    },
    {
      "title": "Magazine Layouts for the Web",
      "slug": "magazine-layouts",
      "description": "Adapting print magazine design patterns for digital consumption with grid systems and featured content.",
      "content": "# From Print to Pixels\n\nMagazine layouts use:\n- Featured lead articles\n- Grid-based secondary content  \n- Pull quotes and drop caps\n- Generous white space\n\nWe can achieve this on the web with CSS Grid and careful typography.",
      "createdAt": "2025-01-24",
      "categories": ["Design"],
      "tags": ["layout", "grid", "magazine"]
    }
  ],
  "pages": [
    {
      "title": "About",
      "slug": "about",
      "content": "# About This Test Blog\n\nThis is a test blog for evaluating the **Editorial/Magazine** design aesthetic of @jsonblog/generator-tailwind.\n\n## What We Test\n\n- Typography hierarchy (Playfair, Lora, DM Sans)\n- Color palette (burgundy, forest green, golden)\n- Layout patterns (featured posts, grids)\n- Editorial elements (drop caps, pull quotes)\n- Responsive behavior\n- Tag and category pages\n\n## Design Goals\n\n1. Sophistication over simplicity\n2. Content-focused readability\n3. Memorable visual identity\n4. Professional polish\n\nThis page demonstrates static page templates with centered headers and elegant dividers."
    }
  ]
}
```

### Test Script

Add to `package.json` in monorepo root:

```json
{
  "scripts": {
    "test:generator": "node scripts/test-generator.js"
  }
}
```

Create `scripts/test-generator.js`:

```javascript
#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const generatorName = process.argv[2] || 'tailwind';

console.log(`\n🧪 Testing @jsonblog/generator-${generatorName}...\n`);

// Build generator first
console.log('📦 Building generator...');
execSync(`pnpm --filter @jsonblog/generator-${generatorName} build`, {
  stdio: 'inherit',
  cwd: join(__dirname, '..')
});

// Generate test blog
console.log('\n🎨 Generating test blog...');
const testDir = join(__dirname, '..', 'test-blog');
const outputDir = join(testDir, 'build');

// Use CLI to generate
execSync(`node apps/cli/dist/index.js build blog.json -o build -g @jsonblog/generator-${generatorName}`, {
  stdio: 'inherit',
  cwd: testDir
});

console.log(`\n✅ Generated to: ${outputDir}`);
console.log('🌐 To view: cd test-blog && npx serve build');
console.log('');
```

Make it executable:

```bash
chmod +x scripts/test-generator.js
```

---

## Strategy 2: Watch Mode with Hot Reload

For rapid iteration during development, create a watch script.

### Setup

Add to generator's `package.json`:

```json
{
  "scripts": {
    "dev:test": "node scripts/dev-with-test.js"
  }
}
```

Create `packages/generator-tailwind/scripts/dev-with-test.js`:

```javascript
#!/usr/bin/env node

import { exec } from 'child_process';
import { watch } from 'chokidar';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const generatorRoot = join(__dirname, '..');
const testBlogDir = join(generatorRoot, '../../test-blog');

console.log('👀 Watching for changes...\n');

// Initial build
rebuild();

// Watch for changes
const watcher = watch([
  'templates/**/*',
  'src/**/*',
  'tailwind.config.js'
], {
  cwd: generatorRoot,
  ignoreInitial: true
});

watcher.on('change', (path) => {
  console.log(`\n📝 Changed: ${path}`);
  rebuild();
});

function rebuild() {
  console.log('🔨 Building...');

  // Build generator
  exec('pnpm build', { cwd: generatorRoot }, (err) => {
    if (err) {
      console.error('❌ Build failed:', err.message);
      return;
    }

    // Regenerate test blog
    console.log('🎨 Regenerating test blog...');
    exec('node ../../apps/cli/dist/index.js build blog.json -o build',
      { cwd: testBlogDir },
      (err) => {
        if (err) {
          console.error('❌ Generation failed:', err.message);
          return;
        }

        console.log('✅ Ready! Refresh your browser.\n');
      }
    );
  });
}
```

### Usage

Terminal 1 (watch and rebuild):
```bash
cd packages/generator-tailwind
pnpm dev:test
```

Terminal 2 (serve with live reload):
```bash
cd test-blog
npx browser-sync start --server build --files "build/**/*"
```

Now edits to templates automatically rebuild and refresh the browser!

---

## Strategy 3: Visual Regression Testing

For ensuring design consistency across changes.

### Setup

Install dependencies:

```bash
pnpm add -D puppeteer pixelmatch pngjs
```

Create `packages/generator-tailwind/tests/visual-regression.test.ts`:

```typescript
import puppeteer from 'puppeteer';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join } from 'path';

const SCREENSHOT_DIR = join(__dirname, 'screenshots');
const BASELINE_DIR = join(SCREENSHOT_DIR, 'baseline');
const CURRENT_DIR = join(SCREENSHOT_DIR, 'current');
const DIFF_DIR = join(SCREENSHOT_DIR, 'diff');

// Ensure directories exist
[BASELINE_DIR, CURRENT_DIR, DIFF_DIR].forEach(dir => {
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
});

describe('Visual Regression Tests', () => {
  let browser;
  let page;

  beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
  });

  afterAll(async () => {
    await browser.close();
  });

  const pages = [
    { name: 'homepage', path: 'index.html' },
    { name: 'post', path: 'editorial-design.html' },
    { name: 'about', path: 'about.html' },
    { name: 'tag', path: 'tag/design.html' }
  ];

  pages.forEach(({ name, path }) => {
    test(`${name} matches baseline`, async () => {
      const url = `file://${join(__dirname, '../../../test-blog/build', path)}`;
      await page.goto(url, { waitUntil: 'networkidle0' });

      const screenshot = await page.screenshot();
      const currentPath = join(CURRENT_DIR, `${name}.png`);
      writeFileSync(currentPath, screenshot);

      const baselinePath = join(BASELINE_DIR, `${name}.png`);

      // If no baseline, create it
      if (!existsSync(baselinePath)) {
        writeFileSync(baselinePath, screenshot);
        console.log(`Created baseline for ${name}`);
        return;
      }

      // Compare
      const baseline = PNG.sync.read(readFileSync(baselinePath));
      const current = PNG.sync.read(screenshot);
      const { width, height } = baseline;
      const diff = new PNG({ width, height });

      const numDiffPixels = pixelmatch(
        baseline.data,
        current.data,
        diff.data,
        width,
        height,
        { threshold: 0.1 }
      );

      writeFileSync(join(DIFF_DIR, `${name}.png`), PNG.sync.write(diff));

      const diffPercentage = (numDiffPixels / (width * height)) * 100;
      expect(diffPercentage).toBeLessThan(1); // Less than 1% difference
    });
  });
});
```

Run visual tests:

```bash
pnpm test:visual
```

Update baselines when design changes are intentional:

```bash
rm -rf packages/generator-tailwind/tests/screenshots/baseline
pnpm test:visual
```

---

## Strategy 4: Snapshot Testing for HTML Output

Test that generator produces expected HTML structure.

Create `packages/generator-tailwind/tests/output.test.ts`:

```typescript
import { generate } from '../src/index.js';
import { readFileSync, rmSync } from 'fs';
import { join } from 'path';
import type { BlogData } from '@jsonblog/schema';

const OUTPUT_DIR = join(__dirname, 'output');

const mockBlogData: BlogData = {
  site: {
    title: 'Test Blog',
    description: 'Test Description'
  },
  posts: [{
    title: 'Test Post',
    content: '# Hello\n\nThis is a test.',
    slug: 'test-post',
    createdAt: '2025-01-28'
  }],
  pages: []
};

describe('Generator Output', () => {
  beforeAll(async () => {
    await generate(mockBlogData, { outputDir: OUTPUT_DIR });
  });

  afterAll(() => {
    rmSync(OUTPUT_DIR, { recursive: true, force: true });
  });

  test('generates index.html', () => {
    const html = readFileSync(join(OUTPUT_DIR, 'index.html'), 'utf-8');
    expect(html).toContain('Test Blog');
    expect(html).toContain('Test Post');
    expect(html).toContain('Playfair Display'); // Check fonts loaded
    expect(html).toContain('class="editorial-header"');
  });

  test('generates post page', () => {
    const html = readFileSync(join(OUTPUT_DIR, 'test-post', 'index.html'), 'utf-8');
    expect(html).toContain('<h1>Hello</h1>');
    expect(html).toContain('class="post-header"');
    expect(html).toContain('class="post-content content"');
  });

  test('applies editorial styles', () => {
    const html = readFileSync(join(OUTPUT_DIR, 'index.html'), 'utf-8');
    expect(html).toContain('post-card--featured');
    expect(html).toContain('site-title');
    expect(html).toContain('font-serif');
  });

  test('includes main.css', () => {
    const html = readFileSync(join(OUTPUT_DIR, 'index.html'), 'utf-8');
    expect(html).toContain('href="/main.css"');
  });
});
```

---

## Strategy 5: Comparison Tool

Compare multiple generators side-by-side.

Create `scripts/compare-generators.js`:

```javascript
#!/usr/bin/env node

import { execSync } from 'child_process';
import { join } from 'path';

const generators = ['boilerplate', 'tailwind'];
const testBlogPath = join(process.cwd(), 'test-blog');

console.log('🔬 Generating with all generators...\n');

generators.forEach(gen => {
  const outputDir = join(testBlogPath, `build-${gen}`);

  console.log(`📦 Building @jsonblog/generator-${gen}...`);
  execSync(`pnpm --filter @jsonblog/generator-${gen} build`, { stdio: 'inherit' });

  console.log(`🎨 Generating with generator-${gen}...`);
  execSync(
    `node apps/cli/dist/index.js build blog.json -o build-${gen} -g @jsonblog/generator-${gen}`,
    { cwd: testBlogPath, stdio: 'inherit' }
  );

  console.log(`✅ Output: test-blog/build-${gen}\n`);
});

console.log('🌐 To compare:');
generators.forEach(gen => {
  console.log(`   - http://localhost:300${generators.indexOf(gen)} (serve build-${gen})`);
});
```

---

## Strategy 6: Performance Testing

Measure generator speed and output size.

Create `packages/generator-tailwind/tests/performance.test.ts`:

```typescript
import { generate } from '../src/index.js';
import { performance } from 'perf_hooks';
import { statSync, readdirSync, rmSync } from 'fs';
import { join } from 'path';

function getDirSize(dir: string): number {
  let size = 0;
  const files = readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const path = join(dir, file.name);
    if (file.isDirectory()) {
      size += getDirSize(path);
    } else {
      size += statSync(path).size;
    }
  }

  return size;
}

describe('Performance Benchmarks', () => {
  const outputDir = join(__dirname, 'perf-output');

  afterAll(() => {
    rmSync(outputDir, { recursive: true, force: true });
  });

  test('generates 100 posts in under 2 seconds', async () => {
    const posts = Array.from({ length: 100 }, (_, i) => ({
      title: `Post ${i}`,
      content: `# Post ${i}\n\nContent for post ${i}`,
      slug: `post-${i}`,
      createdAt: '2025-01-28'
    }));

    const blogData = {
      site: { title: 'Perf Test', description: 'Test' },
      posts,
      pages: []
    };

    const start = performance.now();
    await generate(blogData, { outputDir });
    const duration = performance.now() - start;

    console.log(`Generated 100 posts in ${duration.toFixed(0)}ms`);
    expect(duration).toBeLessThan(2000);
  });

  test('output size is reasonable', () => {
    const size = getDirSize(outputDir);
    const sizeMB = (size / 1024 / 1024).toFixed(2);

    console.log(`Output size: ${sizeMB}MB for 100 posts`);
    expect(size).toBeLessThan(5 * 1024 * 1024); // Less than 5MB
  });
});
```

---

## Recommended Workflow

### Daily Development:

```bash
# Terminal 1: Watch mode with hot reload
cd packages/generator-tailwind
pnpm dev:test

# Terminal 2: Serve with live reload
cd test-blog
npx browser-sync start --server build --files "build/**/*"
```

### Before Committing:

```bash
# 1. Run unit tests
pnpm test

# 2. Run visual regression tests
pnpm test:visual

# 3. Compare with other generators
node scripts/compare-generators.js

# 4. Check performance
pnpm test:performance
```

### Before Publishing:

```bash
# 1. Build
pnpm build

# 2. Test with CLI
cd test-blog
node ../apps/cli/dist/index.js build blog.json -o build

# 3. Manual review
npx serve build

# 4. Create changeset
pnpm changeset

# 5. Publish
pnpm changeset version
pnpm build
pnpm --filter @jsonblog/generator-tailwind publish --access public
git tag @jsonblog/generator-tailwind@X.Y.Z
git push origin main --follow-tags
```

---

## Tips for Effective Testing

1. **Rich Test Content**: Include various content types (code blocks, blockquotes, tables, lists, images)
2. **Edge Cases**: Test with empty descriptions, missing dates, AI posts, very long titles
3. **Multiple Devices**: Test on real mobile devices, not just browser DevTools
4. **Accessibility**: Use axe DevTools or Lighthouse to check WCAG compliance
5. **Cross-Browser**: Test in Chrome, Firefox, Safari
6. **Performance**: Check Lighthouse scores, especially for mobile
7. **Print**: Test print stylesheets with Cmd+P
8. **RSS Validation**: Validate RSS feed at https://validator.w3.org/feed/

---

## Future Enhancements

- **E2E Testing**: Playwright or Cypress for full user flows
- **CI/CD Integration**: Automated visual regression in GitHub Actions
- **Design Tokens**: Extract colors/fonts to testable JSON
- **Component Library**: Storybook for individual template components
- **A/B Testing**: Framework for testing design variants
