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

## Grid Layout Pages

The generator supports grid layouts for pages like videos, projects, portfolios, etc. This allows you to showcase items in a visual grid with a featured item at the top.

### Usage

In your `blog.json`, add a page with `layout: "grid"` and an `items` array:

```json
{
  "pages": [
    {
      "title": "Videos",
      "slug": "videos",
      "description": "My talks and presentations",
      "layout": "grid",
      "items": [
        {
          "title": "Building AI Products at Scale",
          "description": "A deep dive into production ML systems and the infrastructure needed to run them at scale.",
          "url": "https://youtube.com/watch?v=...",
          "image": "https://i.ytimg.com/vi/.../maxresdefault.jpg",
          "date": "2025-01-15",
          "featured": true,
          "tags": ["AI", "Infrastructure", "Scale"]
        },
        {
          "title": "Intro to RAG Systems",
          "description": "Understanding retrieval-augmented generation for building intelligent applications.",
          "url": "https://youtube.com/watch?v=...",
          "thumbnail": "https://i.ytimg.com/vi/.../hqdefault.jpg",
          "date": "2025-01-10",
          "tags": ["RAG", "LLM"]
        }
      ]
    }
  ]
}
```

### Grid Item Fields

Each item in the `items` array supports:

- `title` (required): Item title
- `description` (optional): Item description
- `url` (optional): Link URL (makes title/image clickable)
- `image` (optional): Full-size image (used for featured items)
- `thumbnail` (optional): Thumbnail image (used for grid items)
- `featured` (optional): Set to `true` to display as featured item at top
- `date` (optional): Display date (formatted automatically)
- `tags` (optional): Array of tags to display

### Layout Behavior

- **Featured items**: Display full-width at the top with larger image and more prominent styling
- **Regular items**: Display in a 2-column grid below the featured item
- **Optional content**: You can include regular markdown `content` that appears before the grid
- **Responsive**: Grid automatically adjusts to single column on mobile

### Use Cases

Perfect for:
- **Videos** - YouTube/conference talks with thumbnails
- **Projects** - Portfolio items with screenshots
- **Publications** - Papers/articles with cover images
- **Courses** - Educational content with thumbnails
- **Talks** - Speaking engagements and presentations

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
