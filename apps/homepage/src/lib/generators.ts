export interface GeneratorMetadata {
  // Identity
  id: string;
  slug: string;
  name: string;
  displayName: string;
  description: string;
  longDescription?: string;

  // Classification
  type: 'official' | 'community';
  status: 'stable' | 'beta' | 'experimental';

  // Package Info
  npmPackage: string;
  version: string;
  repository: string;

  // Visuals
  screenshot?: string;
  demoUrl?: string;

  // Metadata
  tags: string[];
  categories: string[];
  features: string[];

  // Technical
  templateEngine: string;
  cssFramework?: string;

  // Stats (fetched at build time)
  stats?: {
    weeklyDownloads?: number;
    lastPublished?: string;
  };

  // Usage
  installCommand: string;
  usageExample?: string;
}

export interface GeneratorRegistry {
  generators: GeneratorMetadata[];
  tags: string[];
  categories: string[];
}

export const GENERATORS: GeneratorMetadata[] = [
  {
    id: 'boilerplate',
    slug: 'boilerplate',
    name: '@jsonblog/generator-boilerplate',
    displayName: 'Boilerplate',
    description: 'A clean, minimal reference implementation with IBM Plex Mono typography',
    longDescription:
      'The reference implementation for JSONBlog generators. Features a Medium-inspired design with generous whitespace, optimal typography, and fast static HTML output. Perfect starting point for creating your own generator.',
    type: 'official',
    status: 'stable',
    npmPackage: '@jsonblog/generator-boilerplate',
    version: '5.0.0',
    repository: 'https://github.com/ajaxdavis/jsonblog/tree/main/packages/generator-boilerplate',
    demoUrl: 'https://boilerplate.demos.jsonblog.dev',
    screenshot: '/marketplace/screenshots/boilerplate.png',
    tags: ['minimal', 'typography', 'medium-inspired', 'ai-ready'],
    categories: ['Blog', 'Personal'],
    features: [
      'Responsive design',
      'IBM Plex Mono typography',
      'Tags and categories',
      'RSS feed',
      'Sitemap',
      'Markdown rendering',
      'AI-generated post indicators',
      'Syntax highlighting (Highlight.js)',
    ],
    templateEngine: 'Handlebars',
    cssFramework: 'Custom CSS',
    installCommand: 'npm install -g @jsonblog/generator-boilerplate',
    usageExample: `import { generate } from '@jsonblog/generator-boilerplate';
await generate(blogData, { outputDir: './build' });`,
  },
  {
    id: 'tailwind',
    slug: 'tailwind',
    name: '@jsonblog/generator-tailwind',
    displayName: 'Tailwind',
    description: 'AI Lab Notebook aesthetic with Tailwind CSS and grid layouts',
    longDescription:
      'A modern generator featuring the AI Lab Notebook aesthetic. Includes Tailwind CSS with utility-first approach, grid layout support for portfolios/videos, and optimized CSS bundle size (~14KB). Perfect for technical blogs and personal sites.',
    type: 'official',
    status: 'stable',
    npmPackage: '@jsonblog/generator-tailwind',
    version: '4.3.0',
    repository: 'https://github.com/ajaxdavis/jsonblog/tree/main/packages/generator-tailwind',
    demoUrl: 'https://tailwind.demos.jsonblog.dev',
    screenshot: '/marketplace/screenshots/tailwind.png',
    tags: ['modern', 'utility-first', 'ai-lab', 'grid-layout'],
    categories: ['Blog', 'Portfolio', 'Technical'],
    features: [
      'Tailwind CSS',
      'Grid layouts for portfolios',
      'Syntax highlighting',
      'Tags and categories',
      'RSS feed',
      'Sitemap',
      'Optimized CSS (~14KB)',
      'External grid items support',
    ],
    templateEngine: 'Handlebars',
    cssFramework: 'Tailwind CSS',
    installCommand: 'npm install -g @jsonblog/generator-tailwind',
    usageExample: `import { generate } from '@jsonblog/generator-tailwind';
await generate(blogData, { outputDir: './build' });`,
  },
];

export function getGeneratorRegistry(): GeneratorRegistry {
  const allTags = new Set<string>();
  const allCategories = new Set<string>();

  GENERATORS.forEach((gen) => {
    gen.tags.forEach((tag) => allTags.add(tag));
    gen.categories.forEach((cat) => allCategories.add(cat));
  });

  return {
    generators: GENERATORS,
    tags: Array.from(allTags).sort(),
    categories: Array.from(allCategories).sort(),
  };
}

export function getGeneratorBySlug(slug: string): GeneratorMetadata | undefined {
  return GENERATORS.find((gen) => gen.slug === slug);
}
