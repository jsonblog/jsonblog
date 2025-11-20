# JsonBlog Generator Tailwind

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue.svg)](https://www.typescriptlang.org/)

A modern Tailwind CSS-powered static blog generator for JsonBlog. This package provides the same functionality as [@jsonblog/generator-boilerplate](../generator-boilerplate) but uses Tailwind CSS for styling with build-time compilation and purging for optimal bundle sizes.

## Features

- 🎨 **Tailwind CSS** with utility-first approach
- ⚡ **Optimized CSS** - Build-time compilation and purging (~14KB minified)
- 🚀 **Development server** with live reload on port 3500
- 🏷️ **Tags and categories** support for better content organization
- 📄 **Pagination** with configurable posts per page
- 📡 **RSS feed** generation for content syndication
- 🗺️ **Sitemap** generation for SEO
- 🔍 **Syntax highlighting** with Highlight.js
- 📝 Clean, modern HTML output with semantic structure
- 🎨 Professional design inspired by Stripe, Linear, and Vercel
- 🔧 Customizable via tailwind.config.js
- 📘 TypeScript support
- ✅ Same API as generator-boilerplate

## Installation

```bash
npm install @jsonblog/generator-tailwind
```

## Usage

### As a Library

```typescript
import { generateBlog } from '@jsonblog/generator-tailwind';

const blog = {
  site: {
    title: 'My Blog',
    description: 'A blog about my thoughts',
  },
  basics: {
    name: 'John Doe',
  },
  settings: {
    postsPerPage: 5, // Optional: defaults to 10
  },
  posts: [
    {
      title: 'Hello World',
      slug: 'hello-world',
      content: '# Hello World\n\nThis is my first post!',
      createdAt: '2025-11-20',
      tags: ['introduction'],
    },
  ],
  pages: [],
};

const files = await generateBlog(blog, '/path/to/blog');
console.log(\`Generated \${files.length} files\`);
```

## Customization

### Tailwind Configuration

The generator includes a \`tailwind.config.js\` that extends Tailwind's default theme:

```javascript
module.exports = {
  content: ['./templates/**/*.hbs'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', ...],
        mono: ['"IBM Plex Mono"', 'Monaco', ...],
      },
      fontSize: {
        base: '19px', // Readable base font size
      },
      maxWidth: {
        content: '816px', // Optimized reading width
      },
    },
  },
};
```

### Custom CSS

The \`templates/input.css\` file uses Tailwind's \`@layer\` directive:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .post-card {
    @apply mb-10 pb-8 border-b border-gray-200;
  }
}
```

## Development

```bash
# Build Tailwind CSS only
npm run build:css

# Build everything (CSS + TypeScript)
npm run build

# Watch mode
npm run dev
```

## Comparison with generator-boilerplate

| Feature | generator-tailwind | generator-boilerplate |
|---------|-------------------|----------------------|
| CSS Framework | Tailwind CSS | Custom CSS |
| CSS Size | ~14KB (purged) | ~8.4KB |
| Customization | tailwind.config.js | Direct CSS editing |
| Utility Classes | ✅ Yes | ❌ No |
| Build Step | CSS compilation | None |

## License

MIT © JSON Blog Team
