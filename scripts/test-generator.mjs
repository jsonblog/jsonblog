#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
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

// Generate test blog
console.log('\n🎨 Generating test blog...');
const testDir = join(__dirname, '..', 'test-blog');
const cliPath = join(__dirname, '..', 'apps', 'cli', 'dist', 'index.js');

try {
  execSync(`node ${cliPath} build blog.json -g @jsonblog/generator-${generatorName}`, {
    stdio: 'inherit',
    cwd: testDir
  });
} catch (error) {
  console.error('❌ Generation failed');
  process.exit(1);
}

const outputDir = join(testDir, 'build');
console.log(`\n✅ Generated to: ${outputDir}`);
console.log('\n🌐 To view:');
console.log(`   cd test-blog && npx serve build`);
console.log('   Then open: http://localhost:3000\n');
