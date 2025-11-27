#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync, rmSync } from 'fs';
import { execSync } from 'child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const generatorName = process.argv[2] || 'tailwind';

console.log(`\n🧪 Testing @jsonblog/generator-${generatorName}...\n`);

// Build generator first
console.log('📦 Building generator...');
try {
  execSync(`pnpm --filter @jsonblog/generator-${generatorName} build`, {
    stdio: 'inherit',
    cwd: join(__dirname, '..')
  });
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Import and use generator directly
console.log('\n🎨 Generating test blog...');
const testDir = join(__dirname, '..', 'test-blog');
const blogDataPath = join(testDir, 'blog.json');
const outputDir = join(testDir, 'build');

try {
  // Clean output directory
  rmSync(outputDir, { recursive: true, force: true });

  // Read blog.json
  const blogData = JSON.parse(readFileSync(blogDataPath, 'utf-8'));

  // Import generator
  const generatorPath = join(__dirname, '..', 'packages', `generator-${generatorName}`, 'dist', 'index.js');
  const module = await import(generatorPath);
  const generate = module.generateBlog || module.generate || module.default;

  // Generate
  await generate(blogData, { outputDir });

  console.log(`\n✅ Generated to: ${outputDir}`);
  console.log('\n🌐 To view:');
  console.log(`   cd test-blog && npx serve build`);
  console.log('   Then open: http://localhost:3000\n');
} catch (error) {
  console.error('❌ Generation failed:', error.message);
  process.exit(1);
}
