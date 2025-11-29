import fs from 'fs';
import path from 'path';
import { generateBlog as generateBoilerplate } from '@jsonblog/generator-boilerplate';
import { generateBlog as generateTailwind } from '@jsonblog/generator-tailwind';
import { DEMO_BLOG } from '../src/lib/demo-blog.mjs';

const DEMOS_OUTPUT = path.join(process.cwd(), 'public', 'demos');

async function buildDemos() {
  console.log('Building generator demos...');

  // Clean and recreate output directory
  if (fs.existsSync(DEMOS_OUTPUT)) {
    fs.rmSync(DEMOS_OUTPUT, { recursive: true });
  }
  fs.mkdirSync(DEMOS_OUTPUT, { recursive: true });

  // Build each generator demo
  const demos = [
    { name: 'boilerplate', generate: generateBoilerplate },
    { name: 'tailwind', generate: generateTailwind },
  ];

  for (const demo of demos) {
    try {
      console.log(`Building ${demo.name} demo...`);
      const output = path.join(DEMOS_OUTPUT, demo.name);
      await demo.generate(DEMO_BLOG, { outputDir: output });
      console.log(`✓ ${demo.name} demo built`);
    } catch (err) {
      console.error(`✗ Failed to build ${demo.name} demo:`, err);
      // Continue building other demos
    }
  }

  console.log('✓ All demos built');
}

buildDemos().catch((err) => {
  console.error('Demo build failed:', err);
  process.exit(1);
});
