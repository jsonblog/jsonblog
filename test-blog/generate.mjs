#!/usr/bin/env node

import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Import generator
const generator = await import('../packages/generator-tailwind/dist/index.js');
const generateBlog = generator.generateBlog || generator.default;

// Read blog.json
const blogData = JSON.parse(readFileSync(join(__dirname, 'blog.json'), 'utf-8'));

// basePath is where blog.json lives (for resolving relative paths like videos.json)
const basePath = __dirname;

// Output directory
const outputDir = join(__dirname, 'build');

// Clean and recreate output directory
rmSync(outputDir, { recursive: true, force: true });
mkdirSync(outputDir, { recursive: true });

console.log('🎨 Generating blog...');

// Generate files
const files = await generateBlog(blogData, basePath);

// Write files
for (const file of files) {
  const filePath = join(outputDir, file.name);
  const fileDir = dirname(filePath);

  // Create directory if needed
  mkdirSync(fileDir, { recursive: true });

  // Write file
  writeFileSync(filePath, file.content, 'utf-8');
}

console.log(`✅ Generated ${files.length} files to: ${outputDir}`);
console.log('\n🌐 To view:');
console.log(`   cd test-blog/build && python3 -m http.server 3500`);
console.log('   Then open: http://localhost:3500\n');
